/**
 * Pyodide web worker.
 *
 * Runs the Python `orbitals` package off the main thread.
 * The three .py source files are inlined at build time via Vite's ?raw import,
 * then written into Pyodide's virtual filesystem so they can be imported normally.
 *
 * Protocol
 *   main → worker : { type: 'sample', n, l, m, Z, n_samples, basis }
 *   worker → main : { type: 'ready' }
 *                   { type: 'result', xyz: Float32Array, phase: Float32Array }
 *                   { type: 'error',  message: string }
 */

/// <reference lib="webworker" />
// Narrow self to the correct worker type so postMessage overloads resolve.
declare const self: DedicatedWorkerGlobalScope

import { loadPyodide, type PyodideInterface, version as PYODIDE_VERSION } from 'pyodide'

// Python source inlined at build time — no runtime fetch needed.
import initPy         from '../orbitals/__init__.py?raw'
import wavefunctionPy from '../orbitals/wavefunction.py?raw'
import samplerPy      from '../orbitals/sampler.py?raw'

// Derive CDN URL from the installed package version — never drifts.
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

let py: PyodideInterface | null = null

async function setup(): Promise<void> {
  py = await loadPyodide({ indexURL: PYODIDE_CDN })
  await py.loadPackage(['numpy', 'scipy'])

  // Write the orbitals package into Pyodide's virtual filesystem.
  py.FS.mkdirTree('/orbitals')
  py.FS.writeFile('/orbitals/__init__.py',     initPy)
  py.FS.writeFile('/orbitals/wavefunction.py', wavefunctionPy)
  py.FS.writeFile('/orbitals/sampler.py',      samplerPy)

  // Import once to warm up JIT and catch any load errors early.
  py.runPython(`
import sys
sys.path.insert(0, '/')
from orbitals.sampler import sample_orbital   # warm-up import
`)

  self.postMessage({ type: 'ready' })
}

self.onmessage = (e: MessageEvent) => {
  const { type, n, l, m, Z, n_samples, basis } = e.data as {
    type: string
    n: number; l: number; m: number; Z: number
    n_samples: number; basis: string
  }
  if (type !== 'sample' || !py) return

  try {
    // Run the sampler synchronously on the worker thread.
    // Store results in named globals to avoid tuple-unpacking PyProxy issues.
    py.runPython(`
import numpy as _np
from orbitals.sampler import sample_orbital as _so
_xyz_raw, _phase_raw = _so(${n}, ${l}, ${m}, ${Z}.0, ${n_samples}, basis='${basis}')
_xyz_f32   = _xyz_raw.astype(_np.float32).ravel()   # flat (n*3,)
_phase_f32 = _phase_raw.astype(_np.float32)          # (n,)
del _xyz_raw, _phase_raw
`)

    const xyzProxy   = py.globals.get('_xyz_f32')
    const phaseProxy = py.globals.get('_phase_f32')
    const xyz   = xyzProxy.toJs()   as Float32Array
    const phase = phaseProxy.toJs() as Float32Array
    xyzProxy.destroy()
    phaseProxy.destroy()
    py.runPython('del _xyz_f32, _phase_f32')

    // Transfer buffers — zero-copy handoff to the main thread.
    self.postMessage(
      { type: 'result', xyz, phase },
      [xyz.buffer, phase.buffer],
    )
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err) })
  }
}

setup().catch(err => self.postMessage({ type: 'error', message: String(err) }))

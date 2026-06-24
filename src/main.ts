import './style.css'
import { OrbitalRenderer } from './renderer'
import { OrbitalUI }       from './ui'
import OrbitalWorker       from './worker?worker'

const panel    = document.getElementById('panel')!
const viewport = document.getElementById('viewport')!

const ui       = new OrbitalUI(panel)
const renderer = new OrbitalRenderer(viewport)

// ── Loading overlay ──────────────────────────────────────────────────────────
const loading = document.createElement('div')
loading.id = 'loading'
loading.innerHTML = `<div class="load-title">Loading Pyodide…</div><div class="load-sub">(~10 MB, cached after first load)</div>`
viewport.appendChild(loading)

// ── Worker ───────────────────────────────────────────────────────────────────
const worker = new OrbitalWorker()

function requestSample(): void {
  ui.setStatus('Sampling…')
  worker.postMessage({ type: 'sample', ...ui.params })
}

worker.onmessage = (e: MessageEvent) => {
  const { type } = e.data as { type: string }

  if (type === 'ready') {
    loading.remove()
    requestSample()

  } else if (type === 'result') {
    ui.setStatus(null)
    renderer.updateCloud(
      e.data.xyz   as Float32Array,
      e.data.phase as Float32Array,
      { ...ui.params, ...ui.renderOpts },
    )
  } else if (type === 'error') {
    loading.innerHTML = `<div class="load-title" style="color:#ff6633">Error</div><div class="load-sub">${(e.data as { message: string }).message}</div>`
    viewport.appendChild(loading)
    ui.setStatus(null)
    console.error(e.data)
  }
}

// ── UI change routing ────────────────────────────────────────────────────────
ui.onChange = (change) => {
  if (change === 'resample') {
    requestSample()
  } else if (change === 'recolor') {
    renderer.recolor({ ...ui.params, ...ui.renderOpts })
    ui.setStatus(null)
  } else if (change === 'size') {
    renderer.setPointSize(ui.renderOpts.pointSize)
  }
}

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { OrbitalParams, RenderOpts } from './types'

// Soft Gaussian sprite — drawn once, reused by every Points material.
function makeSpriteTex(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const r = size / 2
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0.0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.9)')
  grad.addColorStop(1.0, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

const SPRITE = makeSpriteTex()
const POS    = new THREE.Color(0x4d88ff)
const NEG    = new THREE.Color(0xff6633)
const MONO   = new THREE.Color(0x88ccff)

function phaseToColor(phase: number, basis: string, phaseColor: boolean): THREE.Color {
  if (!phaseColor) return MONO
  if (basis === 'real') return phase >= 0 ? POS : NEG
  // complex: phase ∈ [-π, π] → hue cycle
  const hue = (phase + Math.PI) / (2 * Math.PI)
  return new THREE.Color().setHSL(hue, 0.8, 0.55)
}

export class OrbitalRenderer {
  private scene    = new THREE.Scene()
  private camera   : THREE.PerspectiveCamera
  private gl       : THREE.WebGLRenderer
  private controls : OrbitControls
  private cloud    : THREE.Points | null = null
  // Cache last phase data for cheap recolors without resampling.
  private cachedPhase : Float32Array | null = null
  private cachedOpts  : (OrbitalParams & RenderOpts) | null = null

  constructor(container: HTMLElement) {
    this.scene.background = new THREE.Color(0x08080f)

    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 2000)
    this.camera.position.set(0, 0, 30)

    this.gl = new THREE.WebGLRenderer({ antialias: true })
    this.gl.setSize(w, h)
    this.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.gl.domElement)

    this.controls = new OrbitControls(this.camera, this.gl.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.minDistance   = 1
    this.controls.maxDistance   = 500

    // Nucleus
    this.scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    ))

    new ResizeObserver(() => {
      const w2 = container.clientWidth
      const h2 = container.clientHeight
      this.camera.aspect = w2 / h2
      this.camera.updateProjectionMatrix()
      this.gl.setSize(w2, h2)
    }).observe(container)

    const loop = () => { requestAnimationFrame(loop); this.controls.update(); this.gl.render(this.scene, this.camera) }
    loop()
  }

  updateCloud(xyz: Float32Array, phase: Float32Array, opts: OrbitalParams & RenderOpts): void {
    this.cachedPhase = phase
    this.cachedOpts  = opts
    this._rebuild(xyz, phase, opts)
  }

  // Re-color without resampling — used when phaseColor or basis toggle changes.
  recolor(opts: OrbitalParams & RenderOpts): void {
    if (!this.cloud || !this.cachedPhase) return
    this.cachedOpts = opts
    const colAttr = this.cloud.geometry.getAttribute('color') as THREE.BufferAttribute
    const buf = colAttr.array as Float32Array
    for (let i = 0; i < this.cachedPhase.length; i++) {
      const c = phaseToColor(this.cachedPhase[i], opts.basis, opts.phaseColor)
      buf[i * 3] = c.r; buf[i * 3 + 1] = c.g; buf[i * 3 + 2] = c.b
    }
    colAttr.needsUpdate = true
  }

  setPointSize(size: number): void {
    if (this.cloud) (this.cloud.material as THREE.PointsMaterial).size = size
  }

  private _rebuild(xyz: Float32Array, phase: Float32Array, opts: OrbitalParams & RenderOpts): void {
    if (this.cloud) {
      this.scene.remove(this.cloud)
      this.cloud.geometry.dispose()
      ;(this.cloud.material as THREE.Material).dispose()
      this.cloud = null
    }
    const n = phase.length
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(xyz, 3))

    const colors = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const c = phaseToColor(phase[i], opts.basis, opts.phaseColor)
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: opts.pointSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
      map: SPRITE,
      alphaMap: SPRITE,
      alphaTest: 0.01,
    })
    this.cloud = new THREE.Points(geo, mat)
    this.scene.add(this.cloud)
  }
}

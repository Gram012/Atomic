import type { OrbitalParams, RenderOpts } from './types'

// ── Orbital catalogue ────────────────────────────────────────────────────────
// [n, l, m] triples shown in the quick-pick table.
const CATALOGUE: [number, number, number][] = [
  [1, 0,  0],
  [2, 0,  0],
  [2, 1,  0],
  [2, 1,  1],
  [2, 1, -1],
  [3, 0,  0],
  [3, 1,  0],
  [3, 1,  1],
  [3, 1, -1],
  [3, 2,  0],
  [3, 2,  1],
  [3, 2, -1],
  [3, 2,  2],
  [3, 2, -2],
]

const SUB = '₀₁₂₃₄₅₆₇₈₉'
function toSub(n: number): string {
  return String(n).split('').map(d => SUB[+d]).join('')
}
export function orbLabel(n: number, l: number, m: number): string {
  const lName = ['s', 'p', 'd', 'f'][l]
  if (l === 0) return `${n}${lName}`
  const mSub = m === 0 ? '₀' : m > 0 ? `₊${toSub(m)}` : `₋${toSub(-m)}`
  return `${n}${lName}${mSub}`
}

// ── Public API ───────────────────────────────────────────────────────────────
export interface UIState {
  params: OrbitalParams
  renderOpts: RenderOpts
}

export type OnChange = (change: 'resample' | 'recolor' | 'size') => void

export class OrbitalUI {
  private _params: OrbitalParams = { n: 2, l: 1, m: 0, Z: 1, n_samples: 50_000, basis: 'real' }
  private _opts:   RenderOpts    = { pointSize: 0.13, phaseColor: true }

  onChange: OnChange = () => {}

  // Slider elements kept for constraint updates
  private slN : HTMLInputElement
  private slL : HTMLInputElement
  private slM : HTMLInputElement
  private slZ : HTMLInputElement
  private slPts: HTMLInputElement
  private slSz : HTMLInputElement
  private valN : HTMLElement
  private valL : HTMLElement
  private valM : HTMLElement
  private valZ : HTMLElement
  private valPts: HTMLElement
  private statusEl: HTMLElement
  private currentLabelEl: HTMLElement
  private tableRows: Map<string, HTMLTableRowElement> = new Map()

  get params(): OrbitalParams { return { ...this._params } }
  get renderOpts(): RenderOpts { return { ...this._opts } }

  constructor(panel: HTMLElement) {
    panel.innerHTML = this._html()
    // Wire refs
    this.slN  = panel.querySelector<HTMLInputElement>('#sl-n')!
    this.slL  = panel.querySelector<HTMLInputElement>('#sl-l')!
    this.slM  = panel.querySelector<HTMLInputElement>('#sl-m')!
    this.slZ  = panel.querySelector<HTMLInputElement>('#sl-z')!
    this.slPts = panel.querySelector<HTMLInputElement>('#sl-pts')!
    this.slSz  = panel.querySelector<HTMLInputElement>('#sl-sz')!
    this.valN  = panel.querySelector('#val-n')!
    this.valL  = panel.querySelector('#val-l')!
    this.valM  = panel.querySelector('#val-m')!
    this.valZ  = panel.querySelector('#val-z')!
    this.valPts = panel.querySelector('#val-pts')!
    this.statusEl = panel.querySelector('#status')!
    this.currentLabelEl = panel.querySelector('#current-label')!

    this._bindSliders()
    this._buildTable(panel.querySelector('#orbital-table')!)
    this._bindToggles(panel)
    this._syncUI()
  }

  setStatus(msg: string | null): void {
    if (msg === null) {
      this.statusEl.innerHTML = ''
    } else {
      this.statusEl.innerHTML = `<span class="status-dot"></span>${msg}`
    }
  }

  private _html(): string {
    return `
<div id="panel-title">
  <h1>Orbital Viewer</h1>
  <div id="current-label"></div>
</div>

<div class="panel-section">
  <div class="section-title">Orbital</div>
  <table id="orbital-table"></table>
</div>

<div class="panel-section">
  <div class="section-title">Parameters</div>
  <div class="slider-row">
    <span class="slider-lbl">n</span>
    <input id="sl-n" type="range" min="1" max="5" step="1" value="2">
    <span class="slider-val" id="val-n">2</span>
  </div>
  <div class="slider-row">
    <span class="slider-lbl">l</span>
    <input id="sl-l" type="range" min="0" max="1" step="1" value="1">
    <span class="slider-val" id="val-l">1</span>
  </div>
  <div class="slider-row">
    <span class="slider-lbl">m</span>
    <input id="sl-m" type="range" min="-1" max="1" step="1" value="0">
    <span class="slider-val" id="val-m">0</span>
  </div>
  <div class="slider-row">
    <span class="slider-lbl">Z</span>
    <input id="sl-z" type="range" min="1" max="5" step="1" value="1">
    <span class="slider-val" id="val-z">1</span>
  </div>
</div>

<div class="panel-section">
  <div class="section-title">Sampling</div>
  <div class="slider-row">
    <span class="slider-lbl">pts</span>
    <input id="sl-pts" type="range" min="5000" max="100000" step="5000" value="50000">
    <span class="slider-val" id="val-pts">50k</span>
  </div>
  <div class="slider-row">
    <span class="slider-lbl">sz</span>
    <input id="sl-sz" type="range" min="3" max="40" step="1" value="13">
    <span class="slider-val" id="val-sz">—</span>
  </div>
</div>

<div class="panel-section">
  <div class="section-title">Display</div>
  <div class="toggle-group" id="basis-group">
    <button class="toggle-btn active" data-basis="real">Real</button>
    <button class="toggle-btn" data-basis="complex">Complex</button>
  </div>
  <div class="toggle-group" style="margin-top:8px" id="phase-group">
    <button class="toggle-btn active" data-phase="on">Phase color</button>
    <button class="toggle-btn" data-phase="off">Monochrome</button>
  </div>
</div>

<div id="status"></div>`
  }

  private _buildTable(table: HTMLTableElement): void {
    let lastN = -1
    for (const [n, l, m] of CATALOGUE) {
      if (n !== lastN) {
        lastN = n
        const gr = table.insertRow()
        gr.className = 'group-label'
        const td = gr.insertCell()
        td.colSpan = 2
        td.textContent = `n = ${n}`
      }
      const row = table.insertRow()
      const labelCell = row.insertCell()
      labelCell.className = 'label-cell'
      labelCell.textContent = orbLabel(n, l, m)
      const nlmCell = row.insertCell()
      nlmCell.className = 'nlm-cell'
      nlmCell.textContent = `(${n},${l},${m > 0 ? '+' : ''}${m})`
      const key = `${n},${l},${m}`
      this.tableRows.set(key, row)
      row.addEventListener('click', () => {
        this._params.n = n; this._params.l = l; this._params.m = m
        this._syncUI()
        this.onChange('resample')
      })
    }
  }

  private _bindSliders(): void {
    const debounce = (fn: () => void, ms: number) => {
      let t: ReturnType<typeof setTimeout>
      return () => { clearTimeout(t); t = setTimeout(fn, ms) }
    }
    const triggerResample = debounce(() => this.onChange('resample'), 350)

    this.slN.addEventListener('input', () => {
      this._params.n = +this.slN.value
      this._applyConstraints()
      this._syncUI()
      triggerResample()
    })
    this.slL.addEventListener('input', () => {
      this._params.l = +this.slL.value
      this._applyConstraints()
      this._syncUI()
      triggerResample()
    })
    this.slM.addEventListener('input', () => {
      this._params.m = +this.slM.value
      this._syncUI()
      triggerResample()
    })
    this.slZ.addEventListener('input', () => {
      this._params.Z = +this.slZ.value
      this.valZ.textContent = String(this._params.Z)
      triggerResample()
    })
    this.slPts.addEventListener('input', () => {
      this._params.n_samples = +this.slPts.value
      this.valPts.textContent = `${Math.round(this._params.n_samples / 1000)}k`
      triggerResample()
    })
    this.slSz.addEventListener('input', () => {
      this._opts.pointSize = +this.slSz.value / 100
      this.onChange('size')
    })
  }

  private _bindToggles(panel: HTMLElement): void {
    panel.querySelectorAll<HTMLButtonElement>('[data-basis]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._params.basis = btn.dataset.basis as 'real' | 'complex'
        panel.querySelectorAll('[data-basis]').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        this.onChange('resample')
      })
    })
    panel.querySelectorAll<HTMLButtonElement>('[data-phase]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._opts.phaseColor = btn.dataset.phase === 'on'
        panel.querySelectorAll('[data-phase]').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        this.onChange('recolor')
      })
    })
  }

  private _applyConstraints(): void {
    const { n } = this._params
    this._params.l = Math.min(this._params.l, n - 1)
    this._params.m = Math.max(-this._params.l, Math.min(this._params.l, this._params.m))
  }

  private _syncUI(): void {
    const { n, l, m, Z, n_samples } = this._params

    // Slider values
    this.slN.value = String(n)
    this.slL.value = String(l); this.slL.max = String(n - 1)
    this.slM.value = String(m); this.slM.min = String(-l); this.slM.max = String(l)
    this.slZ.value = String(Z)
    this.slPts.value = String(n_samples)

    // Display values
    this.valN.textContent = String(n)
    this.valL.textContent = String(l)
    this.valM.textContent = m > 0 ? `+${m}` : String(m)
    this.valZ.textContent = String(Z)
    this.valPts.textContent = `${Math.round(n_samples / 1000)}k`
    this.currentLabelEl.textContent = orbLabel(n, l, m)

    // Table highlight
    this.tableRows.forEach((row, key) => {
      row.classList.toggle('selected', key === `${n},${l},${m}`)
    })
  }
}

export interface OrbitalParams {
  n: number
  l: number
  m: number
  Z: number
  n_samples: number
  basis: 'complex' | 'real'
}

export interface RenderOpts {
  pointSize: number
  phaseColor: boolean
}

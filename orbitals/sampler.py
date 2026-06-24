"""
Monte Carlo sampler for |ψ_nlm|² via separable inverse-CDF (complex basis)
and 2D rejection sampling (real basis).

All coordinates in atomic units. Returns Cartesian xyz and a per-point scalar
for coloring: complex phase angle (radians) or sign (±1) for the real basis.
"""

import numpy as np
from scipy.integrate import cumulative_trapezoid
from scipy.special import lpmv

from .wavefunction import R_nl, Y_lm_real, psi


# Radial sampler

def _build_radial_cdf(n: int, l: int, Z: float, n_grid: int = 2000):
    r_max = 6.0 * n ** 2 / Z
    r_grid = np.linspace(0.0, r_max, n_grid)
    pdf = r_grid ** 2 * R_nl(n, l, Z, r_grid) ** 2
    pdf[0] = 0.0  # r²|R|² → 0 at origin
    cdf = cumulative_trapezoid(pdf, r_grid, initial=0.0)
    cdf /= cdf[-1]
    return r_grid, cdf


def sample_radial(n: int, l: int, Z: float, n_samples: int, rng=None):
    """Sample r from P(r) = r²|R_nl(r)|² via inverse-CDF."""
    if rng is None:
        rng = np.random.default_rng()
    r_grid, cdf = _build_radial_cdf(n, l, Z)
    u = rng.uniform(0.0, 1.0, n_samples)
    return np.interp(u, cdf, r_grid)


# Angular samplers

def sample_angular_complex(l: int, m: int, n_samples: int, rng=None):
    """
    Sample (theta, phi) from |Y_l^m|².

    |Y_l^m|² is φ-independent, so φ ~ Uniform[0, 2π) and
    cosθ is drawn from |P_l^|m|(cosθ)|² via inverse-CDF.
    """
    if rng is None:
        rng = np.random.default_rng()
    phi = rng.uniform(0.0, 2.0 * np.pi, n_samples)
    u_grid = np.linspace(-1.0, 1.0, 2000)
    Pm = lpmv(abs(m), l, u_grid)  # P_l^|m|(cosθ), no Condon-Shortley
    pdf = Pm ** 2
    pdf[[0, -1]] = 0.0
    cdf = cumulative_trapezoid(pdf, u_grid, initial=0.0)
    cdf /= cdf[-1]
    u = rng.uniform(0.0, 1.0, n_samples)
    cos_theta = np.interp(u, cdf, u_grid)
    theta = np.arccos(np.clip(cos_theta, -1.0, 1.0))
    return theta, phi


def sample_angular_real(l: int, m: int, n_samples: int, rng=None):
    """
    Sample (theta, phi) from |Y_lm_real|² by rejection sampling.

    The real basis |Y|² is not separable in θ and φ, so we use the
    uniform-on-sphere proposal: cosθ ~ Uniform[-1,1], φ ~ Uniform[0,2π).
    """
    if rng is None:
        rng = np.random.default_rng()
    # Estimate max|Y|² on a fine grid with a small safety margin.
    th_g = np.linspace(0.0, np.pi, 400)
    ph_g = np.linspace(0.0, 2.0 * np.pi, 400)
    TT, PP = np.meshgrid(th_g, ph_g, indexing="ij")
    max_val = Y_lm_real(l, m, TT, PP) ** 2
    envelope = float(max_val.max()) * 1.05

    thetas, phis = [], []
    remaining = n_samples
    while remaining > 0:
        batch = max(remaining * 5, 2000)
        cos_t = rng.uniform(-1.0, 1.0, batch)
        p = rng.uniform(0.0, 2.0 * np.pi, batch)
        t = np.arccos(cos_t)
        accept = rng.uniform(0.0, envelope, batch) < Y_lm_real(l, m, t, p) ** 2
        thetas.append(t[accept])
        phis.append(p[accept])
        remaining -= int(accept.sum())

    theta = np.concatenate(thetas)[:n_samples]
    phi = np.concatenate(phis)[:n_samples]
    return theta, phi


# Full orbital sampler

def sample_orbital(
    n: int,
    l: int,
    m: int,
    Z: float,
    n_samples: int,
    basis: str = "complex",
    rng=None,
):
    """
    Draw n_samples points from |ψ_nlm|².

    Returns
    -------
    xyz : (n_samples, 3) float64 — Cartesian positions in atomic units
    color_scalar : (n_samples,) float64
        complex basis → phase angle of ψ in radians (−π … π)
        real basis    → sign of ψ (±1.0); zero at nodal surfaces
    """
    if rng is None:
        rng = np.random.default_rng()

    r = sample_radial(n, l, Z, n_samples, rng=rng)

    if basis == "complex":
        theta, phi = sample_angular_complex(l, m, n_samples, rng=rng)
    else:
        theta, phi = sample_angular_real(l, m, n_samples, rng=rng)

    x = r * np.sin(theta) * np.cos(phi)
    y = r * np.sin(theta) * np.sin(phi)
    z = r * np.cos(theta)
    xyz = np.column_stack([x, y, z])

    psi_vals = psi(n, l, m, Z, r, theta, phi, basis=basis)
    if basis == "complex":
        color_scalar = np.angle(psi_vals)
    else:
        color_scalar = np.sign(psi_vals.real)

    return xyz, color_scalar

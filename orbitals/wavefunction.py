"""
Hydrogenic wavefunction evaluation in atomic units (a₀ = 1).

Convention for spherical coordinates: theta = polar (colatitude), phi = azimuthal.

SciPy ≥1.15 has sph_harm_y(l, m, theta, phi) with physics-standard argument order.
Older SciPy has sph_harm(m, l, theta, phi) where the names are SWAPPED relative to
physics — its 'theta' is the azimuthal angle and 'phi' is the polar angle.
The shim below normalises both to (l, m, theta_polar, phi_azimuthal).
"""

import math
import numpy as np
from scipy.special import genlaguerre

try:
    from scipy.special import sph_harm_y as _sph_harm_y
    def _Y(l: int, m: int, theta, phi):
        return _sph_harm_y(l, m, theta, phi)
except ImportError:
    # SciPy < 1.15: sph_harm(m, n, theta, phi) where theta=azimuthal, phi=polar.
    from scipy.special import sph_harm as _sph_harm_old  # type: ignore[attr-defined]
    def _Y(l: int, m: int, theta, phi):
        return _sph_harm_old(m, l, phi, theta)  # swap: our phi→its theta, our theta→its phi


def R_nl(n: int, l: int, Z: float, r):
    """
    Radial wavefunction R_nl(r) for a hydrogenic atom.

    ρ = 2Zr/n
    R_nl = N · e^(-ρ/2) · ρ^l · L_{n-l-1}^{2l+1}(ρ)
    N = sqrt[ (2Z/n)^3 · (n-l-1)! / (2n · (n+l)!) ]
    """
    r = np.asarray(r, dtype=float)
    rho = 2.0 * Z * r / n
    norm = np.sqrt(
        (2.0 * Z / n) ** 3
        * math.factorial(n - l - 1)
        / (2 * n * math.factorial(n + l))
    )
    L = genlaguerre(n - l - 1, 2 * l + 1)
    return norm * np.exp(-rho / 2.0) * rho**l * L(rho)


def Y_lm_complex(l: int, m: int, theta, phi):
    """Complex spherical harmonic Y_l^m(theta, phi). Includes Condon-Shortley phase."""
    return _Y(l, m, theta, phi)


def Y_lm_real(l: int, m: int, theta, phi):
    """
    Real spherical harmonic, constructed from complex ones.

    m = 0 : Y_l^0  (already real)
    m > 0 : sqrt(2) * (-1)^m * Re(Y_l^m)   ∝ P_l^m(cosθ) cos(mφ)
    m < 0 : -sqrt(2) * (-1)^|m| * Im(Y_l^|m|)  ∝ P_l^|m|(cosθ) sin(|m|φ)

    All combinations are orthonormal on S².
    """
    if m == 0:
        return _Y(l, 0, theta, phi).real
    elif m > 0:
        return np.sqrt(2.0) * ((-1) ** m) * _Y(l, m, theta, phi).real
    else:
        M = -m
        return -np.sqrt(2.0) * ((-1) ** M) * _Y(l, M, theta, phi).imag


def psi(n: int, l: int, m: int, Z: float, r, theta, phi, basis: str = "complex"):
    """
    Full hydrogenic wavefunction ψ_nlm at spherical coordinates (r, theta, phi).

    basis='complex' returns complex Y_l^m; basis='real' returns the real combination.
    """
    radial = R_nl(n, l, Z, r)
    angular = Y_lm_complex(l, m, theta, phi) if basis == "complex" else Y_lm_real(l, m, theta, phi)
    return radial * angular

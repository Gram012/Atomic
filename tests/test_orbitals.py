"""
Phase 0 validation: normalization, mean radius, and node counts.

All integrals are analytic targets; numerical tolerances are loose enough
to be robust but tight enough to catch formula bugs.
"""

import numpy as np
import pytest
from scipy.integrate import dblquad, quad
from scipy.special import lpmv

from orbitals.wavefunction import R_nl, Y_lm_complex, Y_lm_real

Z = 1  # hydrogen


def _r_max(n):
    # 6n²/Z is tight for small n; at least 12/Z ensures the 1s tail is captured.
    return max(6.0 * n ** 2 / Z, 12.0 / Z)

# (n, l, m) triples to test
ORBITALS = [
    (1, 0,  0),
    (2, 0,  0),
    (2, 1,  0),
    (2, 1,  1),
    (2, 1, -1),
    (3, 0,  0),
    (3, 1,  0),
    (3, 2,  1),
    (3, 2, -2),
]


# ---------------------------------------------------------------------------
# Radial normalization  ∫₀^∞ r² |R_nl|² dr = 1
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("n,l,m", ORBITALS)
def test_radial_normalization(n, l, m):
    result, _ = quad(
        lambda r: r ** 2 * R_nl(n, l, Z, r) ** 2,
        0.0, _r_max(n),
        limit=200,
    )
    assert abs(result - 1.0) < 1e-4, f"({n},{l}): integral = {result:.6f}"


# ---------------------------------------------------------------------------
# Angular normalization  ∫ |Y_lm|² sinθ dθ dφ = 1
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("n,l,m", ORBITALS)
def test_angular_normalization_complex(n, l, m):
    result, _ = dblquad(
        lambda phi, theta: abs(Y_lm_complex(l, m, theta, phi)) ** 2 * np.sin(theta),
        0.0, np.pi,
        0.0, 2.0 * np.pi,
        epsabs=1e-5, epsrel=1e-5,
    )
    assert abs(result - 1.0) < 1e-3, f"({n},{l},{m}): integral = {result:.6f}"


@pytest.mark.parametrize("n,l,m", ORBITALS)
def test_angular_normalization_real(n, l, m):
    result, _ = dblquad(
        lambda phi, theta: Y_lm_real(l, m, theta, phi) ** 2 * np.sin(theta),
        0.0, np.pi,
        0.0, 2.0 * np.pi,
        epsabs=1e-5, epsrel=1e-5,
    )
    assert abs(result - 1.0) < 1e-3, f"({n},{l},{m}): integral = {result:.6f}"


# ---------------------------------------------------------------------------
# Mean radius  ⟨r⟩ = [3n² − l(l+1)] / (2Z)
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("n,l,m", ORBITALS)
def test_mean_r(n, l, m):
    analytic = (3 * n ** 2 - l * (l + 1)) / (2.0 * Z)
    result, _ = quad(
        lambda r: r ** 3 * R_nl(n, l, Z, r) ** 2,
        0.0, _r_max(n),
        limit=200,
    )
    assert abs(result - analytic) / analytic < 1e-3, (
        f"({n},{l}): ⟨r⟩ = {result:.4f}, analytic = {analytic:.4f}"
    )


# ---------------------------------------------------------------------------
# Radial node count: R_nl has exactly n−l−1 interior zeros
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("n,l,m", ORBITALS)
def test_radial_node_count(n, l, m):
    r = np.linspace(1e-6, _r_max(n), 5000)
    R = R_nl(n, l, Z, r)
    nodes = int(np.sum(np.diff(np.sign(R)) != 0))
    assert nodes == n - l - 1, f"({n},{l}): {nodes} radial nodes, expected {n-l-1}"


# ---------------------------------------------------------------------------
# Angular node count: P_l^|m|(cosθ) has exactly l−|m| zeros in (−1, 1)
# ---------------------------------------------------------------------------

# Unique (l, m) pairs from the test list
_LM = list({(l, m) for _, l, m in ORBITALS})


@pytest.mark.parametrize("l,m", _LM)
def test_theta_node_count(l, m):
    u = np.linspace(-1.0 + 1e-6, 1.0 - 1e-6, 5000)
    P = lpmv(abs(m), l, u)
    nodes = int(np.sum(np.diff(np.sign(P)) != 0))
    assert nodes == l - abs(m), f"(l={l},m={m}): {nodes} θ-nodes, expected {l-abs(m)}"

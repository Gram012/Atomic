### Welcome to Atomic!
Atomic is an interactive 3D web viewer for hydrogenic electron orbitals. I began working on this project in early 2026 and published the first release in June of that year. What started out as a small project to model a hydrogen atom in order to retain some of my skills from my undergraduate physics degree has evolved into a vast learning opportunity.
Through this project I have learned so much about 2D and 3D simulation (specifically Monte Carlo Point Clouds), elements of quantum mechanics that I never covered in my undergraduate degree, and a whole host of new python libraries and web hosting tools.

### What's Been Built (The "Basics"):
* orbitals/ Python package — hydrogenic wavefunction evaluation (R_nl, Y_lm, ψ) in atomic units using NumPy/SciPy, with a compatibility shim for SciPy < 1.15's swapped sph_harm argument order
* Monte Carlo sampler — inverse-CDF radial sampling exploiting P(r) = r²|R_nl|²; separable inverse-CDF angular sampling for the complex basis; 2D rejection sampling for the real basis (where |Y|² is not separable in θ and φ)
* Validation test suite — 51 tests covering normalization (∫|ψ|²dV = 1), mean radius (⟨r⟩ = [3n²−l(l+1)]/2Z), radial node counts (n−l−1), and angular node counts (l−|m| zeros of P_l^|m|)
* Pyodide Web Worker — runs the Python sampler off the main thread; Python source files inlined at build time via Vite ?raw imports; results returned as zero-copy transferable Float32Array buffers
* Three.js renderer — Points geometry with soft Gaussian sprites (circular, not square), phase-colored by ψ sign (real basis: blue/orange lobes) or continuous hue cycle (complex basis); nucleus sphere at origin; OrbitControls for grab/pan/rotate/zoom
* Full UI panel — orbital quick-pick table (1s–3d), sliders for n/l/m/Z/sample-count/point-size with dynamic range constraints, Real/Complex basis toggle, Phase color/Monochrome toggle; basis/parameter changes trigger debounced resampling, display-only changes recolor in-place without resampling

### What's Next:
* 2D radial distribution P(r) panel alongside the 3D view
* Cross-section slicing (clip plane through the cloud)
* Isosurfaces via marching cubes (skimage under Pyodide) — tentative
* Hybrid orbitals (sp, sp², sp³ as fixed linear combinations)
* Time-dependent superpositions — Σ cₙψₙ e^(−iEₙt/ℏ), with |ψ(t)|² animated in real time via the requestAnimationFrame loop

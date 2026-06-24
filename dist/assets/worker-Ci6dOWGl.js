var ce=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports);var Pe=ce((ke,T)=>{var me=Object.defineProperty,p=(e,n)=>me(e,"name",{value:n,configurable:!0}),U=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(n,r)=>(typeof require<"u"?require:n)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});function M(e){return!isNaN(parseFloat(e))&&isFinite(e)}p(M,"_isNumber");function _(e){return e.charAt(0).toUpperCase()+e.substring(1)}p(_,"_capitalize");function O(e){return function(){return this[e]}}p(O,"_getter");var S=["isConstructor","isEval","isNative","isToplevel"],E=["columnNumber","lineNumber"],F=["fileName","functionName","source"],ue=["args"],fe=["evalOrigin"],P=S.concat(E,F,ue,fe);function d(e){if(e)for(var n=0;n<P.length;n++)e[P[n]]!==void 0&&this["set"+_(P[n])](e[P[n]])}p(d,"StackFrame");d.prototype={getArgs:function(){return this.args},setArgs:function(e){if(Object.prototype.toString.call(e)!=="[object Array]")throw new TypeError("Args must be an Array");this.args=e},getEvalOrigin:function(){return this.evalOrigin},setEvalOrigin:function(e){if(e instanceof d)this.evalOrigin=e;else if(e instanceof Object)this.evalOrigin=new d(e);else throw new TypeError("Eval Origin must be an Object or StackFrame")},toString:function(){var e=this.getFileName()||"",n=this.getLineNumber()||"",r=this.getColumnNumber()||"",o=this.getFunctionName()||"";return this.getIsEval()?e?"[eval] ("+e+":"+n+":"+r+")":"[eval]:"+n+":"+r:o?o+" ("+e+":"+n+":"+r+")":e+":"+n+":"+r}};d.fromString=p(function(e){var n=e.indexOf("("),r=e.lastIndexOf(")"),o=e.substring(0,n),i=e.substring(n+1,r).split(","),t=e.substring(r+1);if(t.indexOf("@")===0)var a=/@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(t,""),s=a[1],l=a[2],c=a[3];return new d({functionName:o,args:i||void 0,fileName:s,lineNumber:l||void 0,columnNumber:c||void 0})},"StackFrame$$fromString");for(w=0;w<S.length;w++)d.prototype["get"+_(S[w])]=O(S[w]),d.prototype["set"+_(S[w])]=(function(e){return function(n){this[e]=!!n}})(S[w]);var w;for(v=0;v<E.length;v++)d.prototype["get"+_(E[v])]=O(E[v]),d.prototype["set"+_(E[v])]=(function(e){return function(n){if(!M(n))throw new TypeError(e+" must be a Number");this[e]=Number(n)}})(E[v]);var v;for(b=0;b<F.length;b++)d.prototype["get"+_(F[b])]=O(F[b]),d.prototype["set"+_(F[b])]=(function(e){return function(n){this[e]=String(n)}})(F[b]);var b,N=d;function Y(){var e=/^\s*at .*(\S+:\d+|\(native\))/m,n=/^(eval@)?(\[native code])?$/;return{parse:p(function(r){if(r.stack&&r.stack.match(e))return this.parseV8OrIE(r);if(r.stack)return this.parseFFOrSafari(r);throw new Error("Cannot parse given Error object")},"ErrorStackParser$$parse"),extractLocation:p(function(r){if(r.indexOf(":")===-1)return[r];var o=/(.+?)(?::(\d+))?(?::(\d+))?$/,i=o.exec(r.replace(/[()]/g,""));return[i[1],i[2]||void 0,i[3]||void 0]},"ErrorStackParser$$extractLocation"),parseV8OrIE:p(function(r){var o=r.stack.split(`
`).filter(function(i){return!!i.match(e)},this);return o.map(function(i){i.indexOf("(eval ")>-1&&(i=i.replace(/eval code/g,"eval").replace(/(\(eval at [^()]*)|(,.*$)/g,""));var t=i.replace(/^\s+/,"").replace(/\(eval code/g,"(").replace(/^.*?\s+/,""),a=t.match(/ (\(.+\)$)/);t=a?t.replace(a[0],""):t;var s=this.extractLocation(a?a[1]:t),l=a&&t||void 0,c=["eval","<anonymous>"].indexOf(s[0])>-1?void 0:s[0];return new N({functionName:l,fileName:c,lineNumber:s[1],columnNumber:s[2],source:i})},this)},"ErrorStackParser$$parseV8OrIE"),parseFFOrSafari:p(function(r){var o=r.stack.split(`
`).filter(function(i){return!i.match(n)},this);return o.map(function(i){if(i.indexOf(" > eval")>-1&&(i=i.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,":$1")),i.indexOf("@")===-1&&i.indexOf(":")===-1)return new N({functionName:i});var t=/((.*".+"[^@]*)?[^@]*)(?:@)/,a=i.match(t),s=a&&a[1]?a[1]:void 0,l=this.extractLocation(i.replace(t,""));return new N({functionName:s,fileName:l[0],lineNumber:l[1],columnNumber:l[2],source:i})},this)},"ErrorStackParser$$parseFFOrSafari")}}p(Y,"ErrorStackParser");var de=new Y,he=de,y=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string"&&!process.browser,C=y&&typeof T<"u"&&typeof T.exports<"u"&&typeof U<"u"&&typeof __dirname<"u",ye=y&&!C,_e=typeof Deno<"u",q=!y&&!_e,ge=q&&typeof window=="object"&&typeof document=="object"&&typeof document.createElement=="function"&&"sessionStorage"in window&&typeof importScripts!="function",we=q&&typeof importScripts=="function"&&typeof self=="object";typeof navigator=="object"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome")==-1&&navigator.userAgent.indexOf("Safari")>-1;var H,D,Z,j,$;async function A(){if(!y||(H=(await import("./__vite-browser-external-9wXp6ZBx.js")).default,j=await import("./__vite-browser-external-9wXp6ZBx.js"),$=await import("./__vite-browser-external-9wXp6ZBx.js"),Z=(await import("./__vite-browser-external-9wXp6ZBx.js")).default,D=await import("./__vite-browser-external-9wXp6ZBx.js"),z=D.sep,typeof U<"u"))return;let e=j,n=await import("./__vite-browser-external-9wXp6ZBx.js"),r=await import("./__vite-browser-external-9wXp6ZBx.js"),o=await import("./__vite-browser-external-9wXp6ZBx.js"),i={fs:e,crypto:n,ws:r,child_process:o};globalThis.require=function(t){return i[t]}}p(A,"initNodeModules");function W(e,n){return D.resolve(n||".",e)}p(W,"node_resolvePath");function B(e,n){return n===void 0&&(n=location),new URL(e,n).toString()}p(B,"browser_resolvePath");var L;y?L=W:L=B;var z;y||(z="/");function V(e,n){return e.startsWith("file://")&&(e=e.slice(7)),e.includes("://")?{response:fetch(e)}:{binary:$.readFile(e).then(r=>new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}}p(V,"node_getBinaryResponse");function J(e,n){let r=new URL(e,location);return{response:fetch(r,n?{integrity:n}:{})}}p(J,"browser_getBinaryResponse");var k;y?k=V:k=J;async function G(e,n){let{response:r,binary:o}=k(e,n);if(o)return o;let i=await r;if(!i.ok)throw new Error(`Failed to load '${e}': request failed.`);return new Uint8Array(await i.arrayBuffer())}p(G,"loadBinaryFile");var R;if(ge)R=p(async e=>await import(e),"loadScript");else if(we)R=p(async e=>{try{globalThis.importScripts(e)}catch(n){if(n instanceof TypeError)await import(e);else throw n}},"loadScript");else if(y)R=K;else throw new Error("Cannot determine runtime environment");async function K(e){e.startsWith("file://")&&(e=e.slice(7)),e.includes("://")?Z.runInThisContext(await(await fetch(e)).text()):await import(H.pathToFileURL(e).href)}p(K,"nodeLoadScript");async function Q(e){if(y){await A();let n=await $.readFile(e,{encoding:"utf8"});return JSON.parse(n)}else return await(await fetch(e)).json()}p(Q,"loadLockFile");async function X(){if(C)return __dirname;let e;try{throw new Error}catch(o){e=o}let n=he.parse(e)[0].fileName;if(y&&!n.startsWith("file://")&&(n=`file://${n}`),ye){let o=await import("./__vite-browser-external-9wXp6ZBx.js");return(await import("./__vite-browser-external-9wXp6ZBx.js")).fileURLToPath(o.dirname(n))}let r=n.lastIndexOf(z);if(r===-1)throw new Error("Could not extract indexURL path from pyodide module location");return n.slice(0,r)}p(X,"calculateDirname");function ee(e){let n=e.FS,r=e.FS.filesystems.MEMFS,o=e.PATH,i={DIR_MODE:16895,FILE_MODE:33279,mount:function(t){if(!t.opts.fileSystemHandle)throw new Error("opts.fileSystemHandle is required");return r.mount.apply(null,arguments)},syncfs:async(t,a,s)=>{try{let l=i.getLocalSet(t),c=await i.getRemoteSet(t),m=a?c:l,f=a?l:c;await i.reconcile(t,m,f),s(null)}catch(l){s(l)}},getLocalSet:t=>{let a=Object.create(null);function s(m){return m!=="."&&m!==".."}p(s,"isRealDir");function l(m){return f=>o.join2(m,f)}p(l,"toAbsolute");let c=n.readdir(t.mountpoint).filter(s).map(l(t.mountpoint));for(;c.length;){let m=c.pop(),f=n.stat(m);n.isDir(f.mode)&&c.push.apply(c,n.readdir(m).filter(s).map(l(m))),a[m]={timestamp:f.mtime,mode:f.mode}}return{type:"local",entries:a}},getRemoteSet:async t=>{let a=Object.create(null),s=await ve(t.opts.fileSystemHandle);for(let[l,c]of s)l!=="."&&(a[o.join2(t.mountpoint,l)]={timestamp:c.kind==="file"?new Date((await c.getFile()).lastModified):new Date,mode:c.kind==="file"?i.FILE_MODE:i.DIR_MODE});return{type:"remote",entries:a,handles:s}},loadLocalEntry:t=>{let a=n.lookupPath(t).node,s=n.stat(t);if(n.isDir(s.mode))return{timestamp:s.mtime,mode:s.mode};if(n.isFile(s.mode))return a.contents=r.getFileDataAsTypedArray(a),{timestamp:s.mtime,mode:s.mode,contents:a.contents};throw new Error("node type not supported")},storeLocalEntry:(t,a)=>{if(n.isDir(a.mode))n.mkdirTree(t,a.mode);else if(n.isFile(a.mode))n.writeFile(t,a.contents,{canOwn:!0});else throw new Error("node type not supported");n.chmod(t,a.mode),n.utime(t,a.timestamp,a.timestamp)},removeLocalEntry:t=>{var a=n.stat(t);n.isDir(a.mode)?n.rmdir(t):n.isFile(a.mode)&&n.unlink(t)},loadRemoteEntry:async t=>{if(t.kind==="file"){let a=await t.getFile();return{contents:new Uint8Array(await a.arrayBuffer()),mode:i.FILE_MODE,timestamp:new Date(a.lastModified)}}else{if(t.kind==="directory")return{mode:i.DIR_MODE,timestamp:new Date};throw new Error("unknown kind: "+t.kind)}},storeRemoteEntry:async(t,a,s)=>{let l=t.get(o.dirname(a)),c=n.isFile(s.mode)?await l.getFileHandle(o.basename(a),{create:!0}):await l.getDirectoryHandle(o.basename(a),{create:!0});if(c.kind==="file"){let m=await c.createWritable();await m.write(s.contents),await m.close()}t.set(a,c)},removeRemoteEntry:async(t,a)=>{await t.get(o.dirname(a)).removeEntry(o.basename(a)),t.delete(a)},reconcile:async(t,a,s)=>{let l=0,c=[];Object.keys(a.entries).forEach(function(u){let g=a.entries[u],x=s.entries[u];(!x||n.isFile(g.mode)&&g.timestamp.getTime()>x.timestamp.getTime())&&(c.push(u),l++)}),c.sort();let m=[];if(Object.keys(s.entries).forEach(function(u){a.entries[u]||(m.push(u),l++)}),m.sort().reverse(),!l)return;let f=a.type==="remote"?a.handles:s.handles;for(let u of c){let g=o.normalize(u.replace(t.mountpoint,"/")).substring(1);if(s.type==="local"){let x=f.get(g),pe=await i.loadRemoteEntry(x);i.storeLocalEntry(u,pe)}else{let x=i.loadLocalEntry(u);await i.storeRemoteEntry(f,g,x)}}for(let u of m)if(s.type==="local")i.removeLocalEntry(u);else{let g=o.normalize(u.replace(t.mountpoint,"/")).substring(1);await i.removeRemoteEntry(f,g)}}};e.FS.filesystems.NATIVEFS_ASYNC=i}p(ee,"initializeNativeFS");var ve=p(async e=>{let n=[];async function r(i){for await(let t of i.values())n.push(t),t.kind==="directory"&&await r(t)}p(r,"collect"),await r(e);let o=new Map;o.set(".",e);for(let i of n){let t=(await e.resolve(i)).join("/");o.set(t,i)}return o},"getFsHandles");function ne(e){let n={noImageDecoding:!0,noAudioDecoding:!0,noWasmDecoding:!1,preRun:oe(e),quit(r,o){throw n.exited={status:r,toThrow:o},o},print:e.stdout,printErr:e.stderr,thisProgram:e._sysExecutable,arguments:e.args,API:{config:e},locateFile:r=>e.indexURL+r,instantiateWasm:se(e.indexURL)};return n}p(ne,"createSettings");function te(e){return function(n){let r="/";try{n.FS.mkdirTree(e)}catch(o){console.error(`Error occurred while making a home directory '${e}':`),console.error(o),console.error(`Using '${r}' for a home directory instead`),e=r}n.FS.chdir(e)}}p(te,"createHomeDirectory");function re(e){return function(n){Object.assign(n.ENV,e)}}p(re,"setEnvironment");function ae(e){return e?[async n=>{n.addRunDependency("fsInitHook");try{await e(n.FS,{sitePackages:n.API.sitePackages})}finally{n.removeRunDependency("fsInitHook")}}]:[]}p(ae,"callFsInitHook");function ie(e){let n=G(e);return async r=>{let o=r._py_version_major(),i=r._py_version_minor();r.FS.mkdirTree("/lib"),r.API.sitePackages=`/lib/python${o}.${i}/site-packages`,r.FS.mkdirTree(r.API.sitePackages),r.addRunDependency("install-stdlib");try{let t=await n;r.FS.writeFile(`/lib/python${o}${i}.zip`,t)}catch(t){console.error("Error occurred while installing the standard library:"),console.error(t)}finally{r.removeRunDependency("install-stdlib")}}}p(ie,"installStdlib");function oe(e){let n;return e.stdLibURL!=null?n=e.stdLibURL:n=e.indexURL+"python_stdlib.zip",[...ae(e.fsInit),ie(n),te(e.env.HOME),re(e.env),ee]}p(oe,"getFileSystemInitializationFuncs");function se(e){if(typeof WasmOffsetConverter<"u")return;let{binary:n,response:r}=k(e+"pyodide.asm.wasm");return function(o,i){return(async function(){try{let t;r?t=await WebAssembly.instantiateStreaming(r,o):t=await WebAssembly.instantiate(await n,o);let{instance:a,module:s}=t;i(a,s)}catch(t){console.warn("wasm instantiation failed!"),console.warn(t)}})(),{}}}p(se,"getInstantiateWasmFunc");var I="0.27.7";async function le(e={}){var n,r;await A();let o=e.indexURL||await X();o=L(o),o.endsWith("/")||(o+="/"),e.indexURL=o;let i={fullStdLib:!1,jsglobals:globalThis,stdin:globalThis.prompt?globalThis.prompt:void 0,lockFileURL:o+"pyodide-lock.json",args:[],env:{},packageCacheDir:o,packages:[],enableRunUntilComplete:!0,checkAPIVersion:!0,BUILD_ID:"e94377f5ce7dcf67e0417b69a0016733c2cfb6b4622ee8c490a6f17eb58e863b"},t=Object.assign(i,e);(n=t.env).HOME??(n.HOME="/home/pyodide"),(r=t.env).PYTHONINSPECT??(r.PYTHONINSPECT="1");let a=ne(t),s=a.API;if(s.lockFilePromise=Q(t.lockFileURL),typeof _createPyodideModule!="function"){let u=`${t.indexURL}pyodide.asm.js`;await R(u)}let l;if(e._loadSnapshot){let u=await e._loadSnapshot;ArrayBuffer.isView(u)?l=u:l=new Uint8Array(u),a.noInitialRun=!0,a.INITIAL_MEMORY=l.length}let c=await _createPyodideModule(a);if(a.exited)throw a.exited.toThrow;if(e.pyproxyToStringRepr&&s.setPyProxyToStringMethod(!0),s.version!==I&&t.checkAPIVersion)throw new Error(`Pyodide version does not match: '${I}' <==> '${s.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);c.locateFile=u=>{throw new Error("Didn't expect to load any more file_packager files!")};let m;l&&(m=s.restoreSnapshot(l));let f=s.finalizeBootstrap(m,e._snapshotDeserializer);return s.sys.path.insert(0,""),f.version.includes("dev")||s.setCdnUrl(`https://cdn.jsdelivr.net/pyodide/v${f.version}/full/`),s._pyodide.set_excepthook(),await s.packageIndexReady,s.initializeStreams(t.stdin,t.stdout,t.stderr),f}p(le,"loadPyodide");var be=`from .wavefunction import R_nl, psi
from .sampler import sample_orbital

__all__ = ["R_nl", "psi", "sample_orbital"]
`,xe=`"""
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
`,Se=`"""
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
`;const Ee=`https://cdn.jsdelivr.net/pyodide/v${I}/full/`;let h=null;async function Fe(){h=await le({indexURL:Ee}),await h.loadPackage(["numpy","scipy"]),h.FS.mkdirTree("/orbitals"),h.FS.writeFile("/orbitals/__init__.py",be),h.FS.writeFile("/orbitals/wavefunction.py",xe),h.FS.writeFile("/orbitals/sampler.py",Se),h.runPython(`
import sys
sys.path.insert(0, '/')
from orbitals.sampler import sample_orbital   # warm-up import
`),self.postMessage({type:"ready"})}self.onmessage=e=>{const{type:n,n:r,l:o,m:i,Z:t,n_samples:a,basis:s}=e.data;if(!(n!=="sample"||!h))try{h.runPython(`
import numpy as _np
from orbitals.sampler import sample_orbital as _so
_xyz_raw, _phase_raw = _so(${r}, ${o}, ${i}, ${t}.0, ${a}, basis='${s}')
_xyz_f32   = _xyz_raw.astype(_np.float32).ravel()   # flat (n*3,)
_phase_f32 = _phase_raw.astype(_np.float32)          # (n,)
del _xyz_raw, _phase_raw
`);const l=h.globals.get("_xyz_f32"),c=h.globals.get("_phase_f32"),m=l.toJs(),f=c.toJs();l.destroy(),c.destroy(),h.runPython("del _xyz_f32, _phase_f32"),self.postMessage({type:"result",xyz:m,phase:f},[m.buffer,f.buffer])}catch(l){self.postMessage({type:"error",message:String(l)})}};Fe().catch(e=>self.postMessage({type:"error",message:String(e)}))});export default Pe();

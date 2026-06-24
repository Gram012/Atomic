import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    // Don't pre-bundle pyodide — it's huge and loads its own runtime
    exclude: ['pyodide'],
  },
  worker: {
    format: 'es',
  },
  server: {
    headers: {
      // Required by Pyodide for SharedArrayBuffer (used in some paths)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})

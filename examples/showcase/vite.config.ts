import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Consumes sukuna-ui via the precompiled CSS path (sukuna-ui/styles.css) — zero-config, no Tailwind.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // sukuna-ui is `bun link`ed from the repo root, which has its own node_modules/react. Force a
    // single React copy so hooks/context inside the library see the same runtime as the app.
    dedupe: ['react', 'react-dom'],
  },
  ssr: {
    // Prerender build (`vite build --ssr src/entry-server.tsx`): bundle every dependency —
    // including the linked library and its Base UI deps, which live in the root node_modules —
    // into one file that `scripts/prerender.ts` can import under Bun. React stays external: it
    // resolves from this app's node_modules at runtime (one copy, and Bun's parser rejects the
    // re-bundled react-dom/server output).
    noExternal: true,
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'],
  },
})

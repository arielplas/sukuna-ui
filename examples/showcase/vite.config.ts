import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The explorer imports the library + its stories from source (../../../src) and builds Tailwind so
// every story utility renders (see src/styles.css). Storybook does the same.
const repoRoot = resolve(import.meta.dirname, '..', '..')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // sukuna-ui is `bun link`ed from the repo root, which has its own node_modules/react. Force a
    // single React copy so hooks/context inside the library see the same runtime as the app.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    // Allow importing the library source and stories, which live above this app's root.
    fs: { allow: [repoRoot] },
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

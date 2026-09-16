import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Consumes @sukuna/ui via the precompiled CSS path (@sukuna/ui/styles.css) — the zero-config,
// non-Tailwind consumer story. No Tailwind in this app at all.
export default defineConfig({
  plugins: [react()],
})

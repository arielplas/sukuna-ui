import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Consumes sukuna-ui via the precompiled CSS path (sukuna-ui/styles.css) — zero-config, no Tailwind.
export default defineConfig({
  plugins: [react()],
})

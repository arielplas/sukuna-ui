import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The standalone consumer story (Q27): only @sukuna-ui/video and its prebuilt video.css. No
// Tailwind and no sukuna-ui. Media fixtures are the Storybook ones (served at /video/*).
export default defineConfig({
  plugins: [react()],
  publicDir: fileURLToPath(new URL('../../.storybook/public', import.meta.url)),
  resolve: {
    // @sukuna-ui/video is `bun link`ed from the repo; force one React copy.
    dedupe: ['react', 'react-dom'],
  },
})

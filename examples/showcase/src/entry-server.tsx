import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'

/**
 * Server entry for the prerender step (`vite build --ssr src/entry-server.tsx`).
 *
 * Renders the exact tree `main.tsx` hydrates — same `StrictMode` wrapper, same `App` — so the
 * server markup and the client's first render are byte-for-byte the same. No CSS import here:
 * the stylesheet is bundled by the client build and already linked from `index.html`.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Tailwind entry: pulls in the sukuna-ui theme and generates every utility the components and their
// stories use (see styles.css). The explorer renders arbitrary story markup, so it needs the full
// utility set, the same way Storybook does.
import './styles.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('missing #root')

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production builds are prerendered (see scripts/prerender.ts), so we hydrate the server markup.
// `vite dev` serves the raw index.html with an empty root; there we mount from scratch instead of
// asking React to hydrate nothing (which would log a mismatch and re-render anyway). Check for an
// element, not any node: the dev shell keeps the `<!--app-html-->` placeholder comment in the root.
if (root.firstElementChild !== null) {
  hydrateRoot(root, tree, {
    onRecoverableError: (error) => {
      console.error('[sukuna-ui showcase] hydration recoverable error:', error)
    },
  })
} else {
  createRoot(root).render(tree)
}

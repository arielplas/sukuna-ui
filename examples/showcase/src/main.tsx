import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Zero-config consumer path: one precompiled stylesheet, no Tailwind.
import 'sukuna-ui/styles.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('missing #root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

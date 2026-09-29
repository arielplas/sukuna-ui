import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The whole styling story for a standalone app: one prebuilt stylesheet.
import '@sukunagg/video/video.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('missing #root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

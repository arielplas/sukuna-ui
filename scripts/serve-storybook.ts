// Static file server for the built Storybook, used by Playwright's `webServer` (see
// playwright.config.ts). Serves `storybook-static/` on port 6007.
import { serve } from 'bun'

const DIR = new URL('../storybook-static', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const PORT = 6007

serve({
  port: PORT,
  fetch(req) {
    const path = new URL(req.url).pathname
    const file = path === '/' ? '/index.html' : path
    return new Response(Bun.file(`${DIR}${file}`))
  },
})

console.log(`serving storybook-static on http://localhost:${PORT}`)

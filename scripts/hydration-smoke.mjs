// Runtime hydration smoke: load a running SSR consumer app in Chromium and fail if React logs any
// hydration warning/error (or the page throws). Usage: node scripts/hydration-smoke.mjs <url>
// Run under Node (Playwright's browser transport hangs under Bun — see docs/ai-decisions.md D16).
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:3111'
const problems = []

const browser = await chromium.launch()
const page = await browser.newPage()

page.on('console', (msg) => {
  const text = msg.text()
  if (msg.type() === 'error' || /hydrat|did not match|server rendered/i.test(text)) {
    problems.push(`[console.${msg.type()}] ${text}`)
  }
})
page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message}`))

await page.goto(url, { waitUntil: 'networkidle' })
// Give React a beat to hydrate and surface any mismatch.
await page.waitForTimeout(1000)
// Sanity: the SSR'd heading is present.
await page.getByRole('heading', { name: /sukuna\/ui in next\.js/i }).waitFor({ timeout: 5000 })

await browser.close()

if (problems.length > 0) {
  console.error(`Hydration smoke FAILED (${problems.length}):\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('Hydration smoke passed: no hydration warnings, page rendered.')

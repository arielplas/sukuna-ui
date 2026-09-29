// Standalone VideoPlayer smoke (Q27): load the built examples/video-standalone app — only
// @sukunagg/video + its video.css, on a page with hostile global CSS — and fail unless the chrome
// keeps its own look, app content inside the player keeps the host's, and `--vp-*` re-themes it.
// Usage: node scripts/video-standalone-smoke.mjs [dist dir]
// Run under Node (Playwright's browser transport hangs under Bun — see docs/ai-decisions.md D16).
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

const dir = process.argv[2] ?? 'examples/video-standalone/dist'
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt',
  '.jpg': 'image/jpeg',
}
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const file = join(dir, path === '/' ? 'index.html' : path)
  if (!existsSync(file) || !statSync(file).isFile()) {
    res.statusCode = 404
    return res.end()
  }
  res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream')
  createReadStream(file).pipe(res)
}).listen(0)

const problems = []
const expect = (label, actual, wanted) => {
  if (actual !== wanted) problems.push(`${label}: got ${actual}, want ${wanted}`)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } })
page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message}`))
await page.goto(`http://localhost:${server.address().port}/`)

const [player, themed] = [0, 1].map((i) => page.locator('section[data-vp-root]').nth(i))
await player.waitFor()
const style = (locator, props) =>
  locator.evaluate((el, ps) => {
    const cs = getComputedStyle(el)
    return Object.fromEntries(ps.map((p) => [p, cs.getPropertyValue(p)]))
  }, props)

// 1. The chrome ignores the host's `button {}` / `* {}` rules.
const big = await style(player.getByRole('button', { name: 'Play' }).first(), [
  'border-top-width',
  'padding-left',
  'font-family',
  'box-sizing',
])
expect('control button border', big['border-top-width'], '0px')
expect('control button padding', big['padding-left'], '0px')
expect('control button box-sizing', big['box-sizing'], 'border-box')
if (/Georgia/.test(big['font-family'])) problems.push('control button inherited the host font')
const root = await style(player, ['background-color', 'border-top-left-radius'])
expect('root background (--vp-color-well)', root['background-color'], 'rgb(0, 0, 0)')
expect('root radius (--vp-radius-lg)', root['border-top-left-radius'], '16px')

// 2. App content inside the player keeps the host's styles (outside the scoped reset).
await player.getByRole('button', { name: 'Play', exact: true }).first().click()
await page.waitForTimeout(500)
await player.getByRole('button', { name: 'Pause', exact: true }).first().click()
const cta = player.getByRole('region', { name: 'Offer' }).getByRole('button', { name: 'Subscribe' })
await cta.waitFor({ timeout: 5000 })
const host = await style(cta, ['background-color', 'border-top-width', 'padding-left'])
expect('overlay app button background', host['background-color'], 'rgb(6, 84, 214)')
expect('overlay app button border', host['border-top-width'], '3px')
expect('overlay app button padding', host['padding-left'], '22px')

// 3. `--vp-*` on a wrapper re-themes the player.
const themedRoot = await style(themed, ['border-top-left-radius'])
expect('re-themed radius (--vp-radius-lg)', themedRoot['border-top-left-radius'], '4px')
const bigPlay = await themed
  .getByRole('button', { name: 'Play' })
  .evaluateAll((els) => els.map((el) => getComputedStyle(el).backgroundImage))
if (!bigPlay.some((bg) => bg.includes('rgb(20, 184, 166)')))
  problems.push(`re-themed big play button: no teal gradient in ${bigPlay.join(' | ')}`)

await browser.close()
server.close()

if (problems.length > 0) {
  console.error(`Standalone video smoke FAILED (${problems.length}):\n${problems.join('\n')}`)
  process.exit(1)
}
console.log(
  'Standalone video smoke OK — chrome intact on a hostile page, app content untouched, --vp-* re-themes',
)

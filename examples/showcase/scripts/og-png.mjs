// One-off rasterizer: public/og.svg → public/og.png (1200×630) for crawlers that don't render SVG
// Open Graph images (Twitter/X, Slack, LinkedIn). Uses the repo-root Playwright install — no new
// dependency. Run under Node (Playwright's browser transport hangs under Bun, see docs/ai-decisions.md
// D16): `node scripts/og-png.mjs`. Commit the resulting PNG; it is not part of `bun run build`.
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const here = dirname(fileURLToPath(import.meta.url))
const svgPath = resolve(here, '..', 'public', 'og.svg')
const pngPath = resolve(here, '..', 'public', 'og.png')

const svg = await readFile(svgPath, 'utf8')
// Inline the SVG so it shares the document's fonts (an <img src="og.svg"> could not load Archivo).
const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>html,body{margin:0;background:#0A0A0B}svg{display:block}</style>
</head><body>${svg}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
const png = await page.locator('svg').screenshot({ type: 'png' })
await browser.close()

await writeFile(pngPath, png)
console.log(`wrote ${pngPath} (${png.length.toLocaleString()} bytes)`)

/**
 * Prerender the showcase into real HTML (Vite SSG-lite).
 *
 * Runs after `vite build` (client → dist/) and `vite build --ssr` (server → dist-ssr/):
 *   1. imports dist-ssr/entry-server.js and renders <App /> with react-dom/server;
 *   2. injects that markup into dist/index.html's `<div id="root">`;
 *   3. rewrites the default site origin with SITE_URL (canonical, OG, JSON-LD, robots.txt);
 *   4. injects the library version from the root package.json into JSON-LD `softwareVersion`;
 *   5. writes dist/sitemap.xml;
 *   6. removes dist-ssr.
 *
 * Usage: `bun run scripts/prerender.ts` (wired into `bun run build`). Set SITE_URL for a custom
 * domain, e.g. `SITE_URL=https://ui.example.com bun run build`.
 */
import { existsSync, rmSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const DEFAULT_SITE_URL = 'https://sukuna-ui.vercel.app'
const SITE_URL = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, '')

const showcaseDir = resolve(import.meta.dir, '..')
const distDir = resolve(showcaseDir, 'dist')
const ssrDir = resolve(showcaseDir, 'dist-ssr')
const rootPackageJson = resolve(showcaseDir, '..', '..', 'package.json')

const fail = (message: string): never => {
  console.error(`[prerender] ${message}`)
  process.exit(1)
}

// 1. Render.
const entryPath = resolve(ssrDir, 'entry-server.js')
if (!existsSync(entryPath)) fail(`missing ${entryPath} — run \`bun run build:ssr\` first`)
const { render } = (await import(pathToFileURL(entryPath).href)) as { render: () => string }
const appHtml = render()
if (!appHtml.includes('<h1')) fail('rendered markup has no <h1> — App did not render')

// 2. Inject into the client-built shell.
const indexPath = resolve(distDir, 'index.html')
if (!existsSync(indexPath)) fail(`missing ${indexPath} — run \`bun run build:client\` first`)
let html = await readFile(indexPath, 'utf8')

const rootPattern = /<div id="root">(?:<!--app-html-->)?<\/div>/
if (!rootPattern.test(html)) fail('could not find the empty <div id="root"> in dist/index.html')
html = html.replace(rootPattern, () => `<div id="root">${appHtml}</div>`)

// 3. Site origin (canonical, OG, twitter, JSON-LD). One env var for a custom domain.
if (SITE_URL !== DEFAULT_SITE_URL) html = html.replaceAll(DEFAULT_SITE_URL, SITE_URL)

// 4. softwareVersion from the library's package.json.
const { version } = JSON.parse(await readFile(rootPackageJson, 'utf8')) as { version?: string }
if (!version) fail(`no "version" in ${rootPackageJson}`)
html = html.replace(/"softwareVersion":\s*"[^"]*"/, `"softwareVersion": "${version}"`)

// OG image: prefer the PNG (widest crawler support); fall back to the SVG if none was shipped.
if (!existsSync(resolve(distDir, 'og.png'))) {
  html = html.replaceAll(`${SITE_URL}/og.png`, `${SITE_URL}/og.svg`)
}

await writeFile(indexPath, html)

// robots.txt ships from public/ with the default origin; point its Sitemap at SITE_URL too.
const robotsPath = resolve(distDir, 'robots.txt')
if (existsSync(robotsPath)) {
  const robots = await readFile(robotsPath, 'utf8')
  await writeFile(robotsPath, robots.replaceAll(DEFAULT_SITE_URL, SITE_URL))
}

// 5. Sitemap (single page today; add routes here when the site grows).
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
await writeFile(resolve(distDir, 'sitemap.xml'), sitemap)

// 6. The SSR bundle is a build intermediate; don't ship it.
rmSync(ssrDir, { recursive: true, force: true })

console.log(
  `[prerender] ok — ${SITE_URL}/ (v${version}), ${appHtml.length.toLocaleString()} chars of markup, sitemap.xml written`,
)

/**
 * Build the shipped stylesheet (`bun run css:build`, part of `bun run build`): compile
 * `src/styles/video.css` with the Tailwind CLI into `dist/video.css` — the prefixed player
 * utilities, its `--vp-*` theme and the scoped reset, ready to import without Tailwind.
 */
import { $ } from 'bun'

const root = new URL('..', import.meta.url)
const p = (rel: string) => new URL(rel, root).pathname.replace(/^\/([A-Za-z]:)/, '$1')

await $`bun x @tailwindcss/cli -i ${p('src/styles/video.css')} -o ${p('dist/video.css')} --minify`

console.log('dist/video.css written')

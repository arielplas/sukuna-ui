/**
 * Build the shipped CSS into `dist/` (`bun run css:build`, part of `bun run build`).
 *
 * - Compile the precompiled fallback (`src/styles/fallback.css`) with the Tailwind CLI to
 *   `dist/styles.css` for non-Tailwind consumers.
 * - Copy the generated `theme.css` and `tokens.css` to `dist/` unchanged, for Tailwind and
 *   raw-token consumers respectively.
 *
 * Assumes `bun run tokens:build` has already produced theme.css/tokens.css (the `build` script
 * runs it first).
 */
import { $ } from 'bun'

const root = new URL('..', import.meta.url)
const p = (rel: string) => new URL(rel, root).pathname.replace(/^\/([A-Za-z]:)/, '$1')

await $`bun x @tailwindcss/cli -i ${p('src/styles/fallback.css')} -o ${p('dist/styles.css')} --minify`

await Bun.write(Bun.file(p('dist/theme.css')), Bun.file(p('src/styles/theme.css')))
await Bun.write(Bun.file(p('dist/tokens.css')), Bun.file(p('src/styles/tokens.css')))

console.log('dist/styles.css + dist/theme.css + dist/tokens.css written')

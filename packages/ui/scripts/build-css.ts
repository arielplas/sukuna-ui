/**
 * Build the shipped CSS into `dist/` (`bun run css:build`, part of `bun run build`).
 *
 * - Compile the precompiled fallback (`src/styles/fallback.css`) with the Tailwind CLI to
 *   `dist/styles.css` for non-Tailwind consumers, then append the VideoPlayer's stylesheet.
 * - Copy the generated `theme.css` to `dist/`, headed by an `@import` of the VideoPlayer's
 *   stylesheet, for Tailwind consumers; copy `tokens.css` unchanged for raw-token consumers.
 *
 * The VideoPlayer lives in `@sukunagg/video` (Q27) and ships its own prebuilt, prefixed
 * `video.css`; bundling it here keeps `@sukunagg/ui/theme.css` and `@sukunagg/ui/styles.css` enough on
 * their own, as before the split. The `[data-vp-root]` block in theme.css feeds it Sukuna tokens.
 *
 * Assumes `bun run tokens:build` has already produced theme.css/tokens.css and that
 * `@sukunagg/video` is built (the root `build` runs it first, as a dependency).
 */
import { fileURLToPath } from 'node:url'
import { $ } from 'bun'

const root = new URL('..', import.meta.url)
const p = (rel: string) => new URL(rel, root).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const videoCss = fileURLToPath(import.meta.resolve('@sukunagg/video/video.css'))

await $`bun x @tailwindcss/cli -i ${p('src/styles/fallback.css')} -o ${p('dist/styles.css')} --minify`

const video = await Bun.file(videoCss).text()
const styles = await Bun.file(p('dist/styles.css')).text()
await Bun.write(p('dist/styles.css'), `${styles}\n${video}`)

const theme = await Bun.file(p('src/styles/theme.css')).text()
await Bun.write(
  p('dist/theme.css'),
  `/* VideoPlayer stylesheet (@sukunagg/video, prebuilt and prefixed — no Tailwind scan needed). */\n@import "@sukunagg/video/video.css";\n\n${theme}`,
)
await Bun.write(Bun.file(p('dist/tokens.css')), Bun.file(p('src/styles/tokens.css')))

console.log('dist/styles.css + dist/theme.css + dist/tokens.css written (with @sukunagg/video)')

/**
 * Re-add `'use client'` / `'use server'` banners that esbuild strips.
 *
 * Runs right after `tsup` in the `build` script. For every source file under `src/` whose first
 * statement is a directive, prepend that directive to the matching `dist/` outputs (`.js`, `.cjs`).
 * `bundle: false` makes the mapping 1:1 (src/a/b.tsx → dist/a/b.js + dist/a/b.cjs).
 *
 * Fails loudly if a source declares a directive but no output was found, so a build-layout change
 * can't silently drop the RSC boundary.
 */
import { Glob } from 'bun'

const SRC = new URL('../src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

const DIRECTIVE = /^\s*(['"])(use client|use server)\1/

async function leadingDirective(file: string): Promise<string | null> {
  const text = await Bun.file(file).text()
  const match = text.match(DIRECTIVE)
  return match?.[2] ?? null
}

let patched = 0
const glob = new Glob('**/*.{ts,tsx}')

for await (const rel of glob.scan({ cwd: SRC })) {
  if (/\.(test|stories)\./.test(rel) || rel.startsWith('stories/')) continue
  const directive = await leadingDirective(`${SRC}${rel}`)
  if (!directive) continue

  const base = rel.replace(/\.(ts|tsx)$/, '')
  const outputs = [`${DIST}${base}.js`, `${DIST}${base}.cjs`]
  let found = false
  for (const out of outputs) {
    const file = Bun.file(out)
    if (!(await file.exists())) continue
    found = true
    const code = await file.text()
    if (DIRECTIVE.test(code)) continue
    await Bun.write(out, `'${directive}';\n${code}`)
    patched++
  }
  if (!found) {
    throw new Error(`fix-directives: ${rel} declares "${directive}" but no dist output was found`)
  }
}

console.log(`fix-directives: prepended banners to ${patched} output file(s)`)

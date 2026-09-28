import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'

// Guards the "component built + documented but never re-exported" gap (Tabs was missing from the
// public entry through 0.5.0, so consumers couldn't import it). Every component directory must be
// re-exported from src/index.ts.
describe('public API', () => {
  it('re-exports every component directory', () => {
    const componentsDir = new URL('./components', import.meta.url)
    const indexSrc = readFileSync(new URL('./index.ts', import.meta.url), 'utf8')
    const dirs = readdirSync(componentsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)

    const missing = dirs.filter((name) => !indexSrc.includes(`/components/${name}'`))
    expect(missing).toEqual([])
  })
})

// Guards the RSC boundary (CLAUDE.md rule 5: `'use client'` only if stateful). A logic file that
// calls a hook must be a client module; one that calls none (and touches no Base UI part, whose
// modules are client modules themselves) must NOT be, or every server consumer pays for hydration.
describe('RSC boundary', () => {
  const componentsDir = new URL('./components/', import.meta.url)
  const logicFiles = readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const raw = readFileSync(new URL(`${d.name}/${d.name}.logic.tsx`, componentsDir), 'utf8')
      // Strip comments so a hook named in TSDoc (an `@example`) doesn't count as a call.
      const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      return {
        name: d.name,
        client: /^'use client'/.test(raw),
        hooks: /\buse[A-Z]\w*(<[^>]*>)?\(/.test(src),
        baseUi: src.includes("from '@base-ui/react/"),
      }
    })

  it('marks every hook-using logic file as a client module', () => {
    expect(logicFiles.filter((f) => f.hooks && !f.client).map((f) => f.name)).toEqual([])
  })

  it('never marks a stateless logic file as a client module', () => {
    expect(logicFiles.filter((f) => f.client && !f.hooks && !f.baseUi).map((f) => f.name)).toEqual(
      [],
    )
  })
})

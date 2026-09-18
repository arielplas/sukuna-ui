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

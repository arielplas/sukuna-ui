import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('.', import.meta.url))

/** Every shipped source file (tests and stories excluded), relative to src/. */
function sourceFiles(dir = SRC): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const path = join(dir, d.name)
    if (d.isDirectory()) return sourceFiles(path)
    if (!/\.tsx?$/.test(d.name) || /\.(test|stories)\./.test(d.name)) return []
    return [relative(SRC, path)]
  })
}

// Q27: the player is usable without sukuna-ui. Nothing it ships may import the library, or reach
// outside this package's src/ (which is how a workspace sibling would sneak back in).
describe('standalone', () => {
  it('never imports the ui library or a path outside the package', () => {
    const offenders = sourceFiles().flatMap((file) => {
      const text = readFileSync(join(SRC, file), 'utf8')
      return [...text.matchAll(/from '([^']+)'/g)]
        .map((m) => m[1] ?? '')
        .filter((spec) =>
          spec.startsWith('.')
            ? !resolve(SRC, file, '..', spec).startsWith(resolve(SRC))
            : /^(sukuna-ui|@sukunagg\/ui)(\/|$)/.test(spec),
        )
        .map((spec) => `${file} → ${spec}`)
    })
    expect(offenders).toEqual([])
  })
})

// The RSC boundary (CLAUDE.md rule 5): a logic file that calls a hook must be a client module;
// one that calls none must not be, or every server consumer pays for its hydration.
describe('RSC boundary', () => {
  const logicFiles = sourceFiles()
    .filter((file) => file.endsWith('.logic.tsx'))
    .map((file) => {
      const raw = readFileSync(join(SRC, file), 'utf8')
      // Strip comments so a hook named in TSDoc (an `@example`) doesn't count as a call.
      const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      return {
        file,
        client: /^'use client'/.test(raw),
        hooks: /\buse[A-Z]\w*(<[^>]*>)?\(/.test(src),
      }
    })

  it('finds the logic files', () => {
    expect(logicFiles.length).toBeGreaterThan(0)
  })

  it('marks every hook-using logic file as a client module', () => {
    expect(logicFiles.filter((f) => f.hooks && !f.client).map((f) => f.file)).toEqual([])
  })

  it('never marks a stateless logic file as a client module', () => {
    expect(logicFiles.filter((f) => f.client && !f.hooks).map((f) => f.file)).toEqual([])
  })
})

/**
 * CI drift check for the generated docs: regenerate, then fail if ANY generated path is modified
 * OR untracked. (`git diff --exit-code` alone ignores untracked files, so a brand-new component
 * whose `docs/llms/<name>.md` was never generated/committed would slip through.)
 *
 * Run: `bun run docs:check` (on a clean tree — locally, commit first).
 */

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const GENERATED = [
  'llms.txt',
  'llms-full.txt',
  'docs/llms',
  'README.md',
  'examples/showcase/public/llms.txt',
  'examples/showcase/public/llms-full.txt',
  'examples/showcase/public/llms',
]

const run = (cmd: string, args: string[]) => {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })
  if (r.status !== 0) {
    process.stderr.write(r.stderr || r.stdout)
    process.exit(r.status ?? 1)
  }
  return r.stdout
}

run('bun', ['run', 'scripts/build-docs.ts'])

// Porcelain lists both modified (` M`) and untracked (`??`) entries under the given paths.
const status = run('git', ['status', '--porcelain', '--', ...GENERATED]).trim()
if (status) {
  console.error(
    'docs:check — generated docs are out of sync with the committed tree. Run `bun run docs:build` and commit:\n',
  )
  console.error(status)
  process.exit(1)
}
console.log('docs:check — generated docs are in sync ✓')

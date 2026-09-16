/**
 * Run a command against a specific React major, then restore React 19.
 *
 *   bun run scripts/with-react.ts 18 -- bun test src
 *
 * Temporarily installs `react@<major>` + `react-dom@<major>`, runs the command, and restores
 * `package.json` (+ reinstalls) in a `finally`, so an error can't leave the repo pinned to the old
 * major. Type mismatches with `@types/react` don't matter here — `bun test` runs the runtime, it
 * doesn't typecheck. Used by `test:react18` to exercise the peer range (react >=18).
 */
import { spawnSync } from 'node:child_process'
import { $ } from 'bun'

const argv = process.argv.slice(2)
const major = argv[0]
const sep = argv.indexOf('--')
const command = sep === -1 ? [] : argv.slice(sep + 1)

if (!major || command.length === 0) {
  console.error('usage: with-react.ts <major> -- <command...>')
  process.exit(1)
}

const pkgPath = new URL('../package.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const backup = await Bun.file(pkgPath).text()

let code = 1
try {
  console.log(`\n[with-react] installing react@${major} + react-dom@${major}…`)
  await $`bun add -d react@${major} react-dom@${major}`.quiet()

  console.log(`[with-react] running: ${command.join(' ')}\n`)
  const [cmd, ...rest] = command
  const result = spawnSync(cmd as string, rest, { stdio: 'inherit', shell: true })
  code = result.status ?? 1
} finally {
  console.log('\n[with-react] restoring package.json and reinstalling…')
  await Bun.write(pkgPath, backup)
  await $`bun install`.quiet()
}

process.exit(code)

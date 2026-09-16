# Testing — `@sukuna/ui`

**One runner: `bun test`.** No Jest, no Vitest, no Storybook test addon.

| Suite | Files | Environment | Covers |
|---|---|---|---|
| Unit | `src/components/**/*.test.tsx` | happy-dom | Props, logic, a11y attributes, SSR render, hydration, axe |
| Browser | `test/browser/**/*.test.ts` | Playwright driving `storybook-static` in Chromium | Focus traps, portals, keyboard choreography for Dialog/Select/Tooltip |

Both suites are `bun test` files. The browser suite imports Playwright's library API directly (no Playwright test runner) and is tagged so it only runs when a built Storybook exists. Visual regression is Chromatic on the Storybook build; it is not a test runner.

Never use snapshot tests of rendered HTML.

## Libraries

```
bun add -d @happy-dom/global-registrator @testing-library/react @testing-library/user-event \
           @testing-library/jest-dom axe-core jest-axe @types/jest-axe playwright
```

| Package | Role |
|---|---|
| `bun test` | Runner + `expect`. Jest-compatible API. |
| `@happy-dom/global-registrator` | Registers `window`/`document` globals before tests. |
| `@testing-library/react` | `render`, `screen`, queries by role/label/text. |
| `@testing-library/user-event` | Real interaction sequences (`user.tab()`, `user.keyboard('[Space]')`, `user.type`). Prefer over `fireEvent`. |
| `@testing-library/jest-dom` | Matchers: `toBeDisabled`, `toHaveAttribute`, `toHaveAccessibleName`, `toHaveFocus`. |
| `axe-core` + `jest-axe` | `toHaveNoViolations()` per rendered variant. |
| `react-dom/server` | `renderToString` for the SSR smoke test; `react-dom/client` `hydrateRoot` for the hydration test. |
| `playwright` (library, not `@playwright/test`) | Launches Chromium inside `bun test` for the browser suite. |

## Harness

`bunfig.toml` — **two** preloads, in order. `register-dom.ts` registers happy-dom BEFORE
`setup.ts` imports Testing Library, which binds `screen` to `document.body` at import time; a
single file would bind `screen` before `document` existed (ES imports hoist) and every `screen.*`
query would throw "a global document has to be available".
```toml
[test]
preload = ["./test/register-dom.ts", "./test/setup.ts"]
coverage = true
coverageReporter = ["text", "lcov"]
coverageDir = "coverage"
coverageSkipTestFiles = true
# Fail the run below 90%. Not a target, a floor.
# NOTE: the per-metric object form `{ line = 0.9, function = 0.9, statement = 0.9 }` is
# SILENTLY IGNORED by Bun 1.3.12 (parses, never fails). The scalar form IS enforced and
# checks every metric Bun tracks (functions + lines; "statement" folds into lines), so a
# file below 90% on either fails. Verified with a probe. Revisit if Bun fixes the object form.
coverageThreshold = 0.9
# Files that carry no logic worth measuring
coveragePathIgnorePatterns = [
  "src/**/*.stories.tsx",
  "src/**/index.tsx",
  "src/index.ts",
  "src/tokens.ts",
  "test/**",
  "scripts/**",
]
```

`test/setup.ts`
```ts
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { expect, afterEach } from 'bun:test'
import * as jestDom from '@testing-library/jest-dom/matchers'
import { toHaveNoViolations } from 'jest-axe'
import { cleanup } from '@testing-library/react'

GlobalRegistrator.register()
;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
// jest-axe exports `toHaveNoViolations` as `{ toHaveNoViolations: fn }` — spread it,
// don't nest it, or expect.extend rejects it as "not a valid matcher".
expect.extend({ ...jestDom, ...toHaveNoViolations })
afterEach(cleanup)
```

`test/ssr.ts` — shared helpers every component test imports:
```ts
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import type { ReactElement } from 'react'

export const renderServer = (el: ReactElement) => renderToString(el)

/** Renders on the server, hydrates on the client, fails on any hydration warning. */
export const expectHydrates = async (el: ReactElement) => {
  const html = renderToString(el)
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  const errors: string[] = []
  const orig = console.error
  console.error = (...a) => errors.push(a.join(' '))
  try {
    await new Promise<void>((r) => { hydrateRoot(host, el); queueMicrotask(r) })
  } finally {
    console.error = orig
    host.remove()
  }
  if (errors.some((e) => /hydrat/i.test(e))) throw new Error(errors.join('\n'))
}
```

`test/axe.ts`
```ts
import { axe } from 'jest-axe'
export const expectAccessible = async (container: HTMLElement) =>
  expect(await axe(container)).toHaveNoViolations()
```

Scripts:
```json
{
  "test": "bun test",
  "test:coverage": "bun test --coverage",
  "test:watch": "bun test --watch",
  "test:react18": "bun run scripts/with-react.ts 18 -- bun test src",
  "test:browser": "bun run storybook:build && bun test test/browser"
}
```
`scripts/with-react.ts` temporarily installs `react@18` + `react-dom@18` into a scratch `node_modules` and runs the command, so both peer versions are exercised in CI.

## Coverage policy

- **Floor: 90% lines and functions**, enforced by `coverageThreshold = 0.9` (scalar) in `bunfig.toml`. `bun test` exits non-zero below it, locally and in CI. Bun tracks functions + lines (statements fold into lines). **Gotcha:** the per-metric object form is silently ignored by Bun 1.3.12 — use the scalar form, which was verified to fail on either metric.
- Measured on `src/components/**/*.logic.tsx`, `src/components/**/*.styles.tsx`, `src/hooks/**`, `src/utils/**`. Stories, barrel `index` files, the token table, and test helpers are excluded because they contain no branches worth measuring; excluding them keeps the number honest instead of inflating it.
- Per-component rule: a new component may not merge below 90% on its own files, regardless of the repo total. Check with `bun test src/components/<name> --coverage`.
- Coverage counts the unit suite only (`bun test src`). The browser suite runs against a built bundle and is not instrumented. Branches that only a real browser exercises must still be reachable from a unit test where possible (e.g. call the hook directly with `renderHook`, or drive the logic with a fake portal target).
- Never raise coverage by testing implementation details or by adding `/* istanbul ignore */`-style exclusions to component code. If a branch cannot be reached from the public API, delete the branch.
- CI uploads `coverage/lcov.info` (Codecov or the GitHub summary action) so the PR shows the delta; a drop of more than 1 point on a touched file needs a justification in the PR.

## What every `<name>.test.tsx` must cover

Mirror Section 9 of the component doc. Minimum:

1. **Renders every variant × size** without throwing, on the server (`renderServer`) and client.
2. **Hydrates cleanly** (`expectHydrates`) for the default story props.
3. **axe passes** for every variant in both `data-theme` values (wrap in `<div data-theme="light">` for the second pass).
4. **Native props pass through**: `id`, `data-testid`, `aria-label`, `onClick`.
5. **`ref` forwards** to the underlying element (`ref.current instanceof HTMLButtonElement`).
6. **Consumer `className` wins** over a conflicting utility (e.g. `className="h-20"` overrides `h-10`; assert via `classList` contains `h-20` and not `h-10`).
7. **Behavioral states** specific to the component (Button: `loading` blocks `onClick` + sets `aria-busy`; Switch: Space toggles; Input: `invalid` sets `aria-invalid`).
8. **Keyboard**: `user.tab()` reaches it, Enter/Space activate where applicable.

Do not assert on full class strings. Assert roles, attributes, accessible names, and the specific utility a test is about.

## Example: `button.test.tsx`

```tsx
import { describe, it, expect, mock } from 'bun:test'
import React, { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './index'
import { renderServer, expectHydrates } from '../../../test/ssr'
import { expectAccessible } from '../../../test/axe'

const variants = ['primary', 'secondary', 'ghost'] as const
const sizes = ['sm', 'md', 'lg'] as const

describe('Button', () => {
  it('renders every variant and size on the server', () => {
    for (const variant of variants) for (const size of sizes)
      expect(renderServer(<Button variant={variant} size={size}>Go</Button>)).toContain('<button')
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Button>Go</Button>)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light']) {
      const { container, unmount } = render(<div data-theme={theme}><Button>Go</Button></div>)
      await expectAccessible(container)
      unmount()
    }
  })

  it('defaults type to button', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('blocks clicks and sets aria-busy while loading', async () => {
    const onClick = mock()
    render(<Button loading onClick={onClick}>Go</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Go</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('lets consumer className override conflicting utilities', () => {
    render(<Button className="h-20">Go</Button>)
    const cls = screen.getByRole('button').classList
    expect(cls.contains('h-20')).toBe(true)
    expect(cls.contains('h-10')).toBe(false)
  })

  it('is keyboard reachable and activates on Enter', async () => {
    const onClick = mock()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await userEvent.keyboard('[Enter]')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

## Browser suite (`test/browser/`)

happy-dom does not implement layout, `:focus-visible`, real portal timing, or scroll locking. Dialog focus trap, Tooltip positioning, and Select typeahead are tested here against the built Storybook, still under `bun test`.

`test/browser/setup.ts`
```ts
import { chromium, type Browser, type Page } from 'playwright'
import { beforeAll, afterAll } from 'bun:test'
import { serve } from 'bun'

let browser: Browser
let server: ReturnType<typeof serve>
export let page: Page

beforeAll(async () => {
  server = serve({ port: 0, fetch: (req) => new Response(Bun.file(`storybook-static${new URL(req.url).pathname === '/' ? '/index.html' : new URL(req.url).pathname}`)) })
  browser = await chromium.launch()
  page = await browser.newPage()
})
afterAll(async () => { await browser?.close(); server?.stop() })

export const openStory = (id: string) =>
  page.goto(`http://localhost:${server.port}/iframe.html?id=${id}&viewMode=story`)
```

`test/browser/dialog.test.ts`
```ts
import { describe, it, expect } from 'bun:test'
import { page, openStory } from './setup'

describe('Dialog (browser)', () => {
  it('traps focus and closes on Escape', async () => {
    await openStory('components-dialog--open')
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab')
    expect(await page.evaluate(() => document.activeElement?.closest('[role=dialog]') !== null)).toBe(true)
    await page.keyboard.press('Escape')
    expect(await page.locator('[role=dialog]').count()).toBe(0)
  })
})
```

Rules: one file per headless-backed component; story ids come from the component doc's Section 10; CI runs `test:browser` after `storybook:build`; locally it is opt-in.

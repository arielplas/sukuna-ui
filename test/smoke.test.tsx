import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import { expectAccessible } from './axe'
import { expectHydrates, renderServer } from './ssr'

// Placeholder harness smoke test (Phase 2). It proves the runner, happy-dom,
// Testing Library, SSR/hydration helpers, and jest-axe all work before any
// component exists. Replaced in spirit by real component tests from Phase 4 on;
// kept as a guard that the harness itself keeps working.
describe('test harness', () => {
  it('renders to a string on the server', () => {
    expect(renderServer(<button type="button">Go</button>)).toContain('<button')
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<button type="button">Go</button>)
  })

  it('runs axe with no violations on accessible markup', async () => {
    const { container } = render(
      <main>
        <button type="button">Go</button>
      </main>,
    )
    await expectAccessible(container)
  })
})

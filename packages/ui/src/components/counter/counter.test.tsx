import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import { act, render, screen } from '@testing-library/react'
import { createRef, Profiler } from 'react'
import { expectAccessible } from '../../../../../test/axe'
import { expectHydrates, renderServer } from '../../../../../test/ssr'
import { Counter } from './index'

// Default every test to reduced motion, so a mount that doesn't opt into animation makes the effect
// a no-op (it snaps to the final value and schedules nothing) — no stray, un-acted state updates.
let mm: ReturnType<typeof spyOn>
beforeEach(() => {
  mm = spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
})
afterEach(() => mm.mockRestore())

/** Turn animation on, capture the rAF callback, and freeze the clock so frames can be stepped. */
function mockRaf() {
  mm.mockReturnValue({ matches: false } as MediaQueryList)
  let cb: FrameRequestCallback | null = null
  const raf = spyOn(globalThis, 'requestAnimationFrame').mockImplementation((fn) => {
    cb = fn
    return 1
  })
  const caf = spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {})
  const now = spyOn(performance, 'now').mockReturnValue(0)
  return {
    step: (t: number) => act(() => cb?.(t)),
    raf,
    restore: () => {
      raf.mockRestore()
      caf.mockRestore()
      now.mockRestore()
    },
  }
}

describe('Counter', () => {
  it('server-renders the final value with an image role', () => {
    const html = renderServer(<Counter value={42} />)
    expect(html).toContain('42')
    expect(html).toContain('role="img"')
  })

  it('formats via decimals, prefix, suffix, and a custom formatter (on the label)', () => {
    render(<Counter value={99.9} decimals={1} suffix="%" data-testid="pct" />)
    expect(screen.getByTestId('pct')).toHaveAttribute('aria-label', '99.9%')

    render(<Counter value={5} prefix="$" data-testid="usd" />)
    expect(screen.getByTestId('usd')).toHaveAttribute('aria-label', '$5')

    render(<Counter value={1000} format={(n) => `$${n.toLocaleString()}`} data-testid="fmt" />)
    expect(screen.getByTestId('fmt')).toHaveAttribute('aria-label', '$1,000')
  })

  it('counts from `from` up to `value` across animation frames', () => {
    const raf = mockRaf()
    render(<Counter value={100} from={0} duration={1000} data-testid="c" />)
    const el = screen.getByTestId('c')
    // Effect sets the display to `from` before the first frame.
    expect(el.textContent).toBe('0')
    raf.step(500) // t = 0.5 → eased 0.875 → 87.5 → "88"
    expect(el.textContent).toBe('88')
    raf.step(1000) // t = 1 → exact target
    expect(el.textContent).toBe('100')
    raf.restore()
  })

  it('renders the target immediately when duration <= 0', () => {
    const raf = mockRaf()
    render(<Counter value={5} from={0} duration={0} data-testid="c" />)
    raf.step(0)
    expect(screen.getByTestId('c').textContent).toBe('5')
    raf.restore()
  })

  it('respects prefers-reduced-motion: shows the final value with no animation', () => {
    // matchMedia already reports reduced motion (beforeEach default).
    const raf = spyOn(globalThis, 'requestAnimationFrame')
    render(<Counter value={50} from={0} data-testid="c" />)
    expect(screen.getByTestId('c').textContent).toBe('50')
    expect(raf).not.toHaveBeenCalled()
    raf.mockRestore()
  })

  it('once (default) snaps to a new value; once={false} re-animates', () => {
    const raf = mockRaf()
    const { rerender } = render(<Counter value={10} from={0} duration={100} data-testid="c" />)
    raf.step(100) // finish the first animation → done
    expect(screen.getByTestId('c').textContent).toBe('10')

    rerender(<Counter value={20} from={0} duration={100} data-testid="c" />)
    expect(screen.getByTestId('c').textContent).toBe('20') // snapped, not animated
    const callsAfterSnap = raf.raf.mock.calls.length

    rerender(<Counter value={30} from={0} duration={100} once={false} data-testid="c" />)
    expect(raf.raf.mock.calls.length).toBeGreaterThan(callsAfterSnap) // scheduled a new animation
    raf.step(100)
    expect(screen.getByTestId('c').textContent).toBe('30')
    raf.restore()
  })

  it('animates without re-rendering React (paints the text node directly)', () => {
    const raf = mockRaf()
    let commits = 0
    render(
      <Profiler id="c" onRender={() => commits++}>
        <Counter value={100} from={0} duration={1000} data-testid="c" />
      </Profiler>,
    )
    const afterMount = commits
    raf.step(250)
    raf.step(500)
    raf.step(1000)
    expect(screen.getByTestId('c').textContent).toBe('100')
    expect(commits).toBe(afterMount)
    raf.restore()
  })

  it('startOnView holds at `from` until the number is intersecting', () => {
    const raf = mockRaf()
    let fire: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null = null
    const disconnect = mock(() => {})
    const original = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = class {
      constructor(cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
        fire = cb
      }
      observe() {}
      disconnect = disconnect
    } as unknown as typeof IntersectionObserver

    const { unmount } = render(
      <Counter value={100} from={0} duration={1000} startOnView data-testid="c" />,
    )
    expect(screen.getByTestId('c').textContent).toBe('0')
    act(() => fire?.([{ isIntersecting: false }]))
    expect(raf.raf).not.toHaveBeenCalled()
    act(() => fire?.([{ isIntersecting: true }]))
    expect(disconnect).toHaveBeenCalled()
    raf.step(1000)
    expect(screen.getByTestId('c').textContent).toBe('100')
    unmount()

    globalThis.IntersectionObserver = original
    raf.restore()
  })

  it('startOnView counts on mount where IntersectionObserver is missing', () => {
    const raf = mockRaf()
    const original = globalThis.IntersectionObserver
    // @ts-expect-error — simulate an environment without the API.
    delete globalThis.IntersectionObserver
    render(<Counter value={9} from={0} duration={100} startOnView data-testid="c" />)
    raf.step(100)
    expect(screen.getByTestId('c').textContent).toBe('9')
    globalThis.IntersectionObserver = original
    raf.restore()
  })

  it('handles a formatter that returns an empty string', () => {
    const raf = mockRaf()
    render(
      <Counter
        value={3}
        from={0}
        duration={100}
        format={(n) => (n < 3 ? '' : 'three')}
        data-testid="c"
      />,
    )
    raf.step(50)
    expect(screen.getByTestId('c').textContent).toBe('')
    raf.step(100)
    expect(screen.getByTestId('c').textContent).toBe('three')
    raf.restore()
  })

  it('forwards ref to the span and merges className without leaking props', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Counter value={1} ref={ref} className="text-accent" data-testid="c" />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    const el = screen.getByTestId('c')
    expect(el.classList.contains('text-accent')).toBe(true)
    expect(el.classList.contains('tabular-nums')).toBe(true)
    expect(el.hasAttribute('value')).toBe(false)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Counter value={7} />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { unmount, container } = render(
        <div data-theme={theme}>
          <Counter value={1240} aria-label="1,240 active users" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

'use client'

import { type ComponentPropsWithoutRef, forwardRef, useEffect, useRef } from 'react'
import { counterStyles } from './counter.styles'

type NativeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'>

/**
 * Props for {@link Counter}: native `<span>` attributes (minus `children`, since the number is the
 * content) plus the animation controls below.
 */
export interface CounterProps extends NativeProps {
  /** Target value. This is also what renders on the server and with no JavaScript. */
  value: number
  /**
   * Value the count-up starts from.
   * @default 0
   */
  from?: number
  /**
   * Animation length in milliseconds. Values `<= 0` render the target immediately.
   * @default 1200
   */
  duration?: number
  /**
   * Fixed number of fraction digits (ignored when `format` is set).
   * @default 0
   */
  decimals?: number
  /**
   * String placed before the number, e.g. `"$"` (ignored when `format` is set).
   * @default ''
   */
  prefix?: string
  /**
   * String placed after the number, e.g. `"%"` (ignored when `format` is set).
   * @default ''
   */
  suffix?: string
  /** Full custom formatter — overrides `decimals`/`prefix`/`suffix`, e.g. `(n) => n.toLocaleString()`. */
  format?: (n: number) => string
  /**
   * When `true`, only the first mount animates; later `value` changes snap to the new number.
   * When `false`, every `value` change re-animates from the current display.
   * @default true
   */
  once?: boolean
  /**
   * When `true`, hold at `from` until the number scrolls into view, then count up (uses
   * `IntersectionObserver`; where it is missing the count starts on mount as usual). Saves the
   * animation for counters the user actually sees, e.g. a stats band below the fold.
   * @default false
   */
  startOnView?: boolean
}

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3

/**
 * Animates a number from `from` up to `value` on mount — for stat tiles, KPIs, and pricing.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because it animates after mount, but it
 *   server-renders the **final** `value` (correct for no-JS and SEO). The count-up is a progressive
 *   enhancement; all `window`/timing access lives inside `useEffect`.
 * - Accessibility: the wrapper is `role="img"` with an `aria-label` of the final formatted value, so
 *   assistive tech announces the number once instead of on every animation frame. The animating
 *   digits are `aria-hidden`. Pass your own `aria-label` to give the number context
 *   (e.g. `"1,240 active users"`).
 * - Reduced motion: under `prefers-reduced-motion: reduce` the final value shows immediately with no
 *   animation.
 * - Performance: frames are painted into the text node directly — no React re-render per frame.
 *   Pass `startOnView` to hold the count until the number scrolls into view.
 * - Formatting: `decimals`/`prefix`/`suffix` cover the common cases; `format` is the escape hatch
 *   for currency and locale. `tabular-nums` keeps the width from jittering as digits change.
 * - Styling: color and size are inherited — wrap in `Text` or pass `className`. The ref points at
 *   the wrapping `<span>`.
 *
 * @example
 * ```tsx
 * import { Counter } from '@sukunagg/ui'
 *
 * <Counter value={1240} aria-label="1,240 active users" />
 * <Counter value={99.9} decimals={1} suffix="%" startOnView />
 * <Counter value={4999} prefix="$" format={(n) => `$${n.toLocaleString()}`} />
 * ```
 */
export const Counter = forwardRef<HTMLSpanElement, CounterProps>(function Counter(
  {
    value,
    from = 0,
    duration = 1200,
    decimals = 0,
    prefix = '',
    suffix = '',
    format,
    once = true,
    startOnView = false,
    className,
    ...rest
  },
  ref,
) {
  const fmt = (n: number): string =>
    format ? format(n) : `${prefix}${n.toFixed(decimals)}${suffix}`

  // The count-up writes straight to the digits' text node instead of setting React state, so an
  // animation costs zero re-renders (it used to reconcile the component ~60×/s per counter). React
  // still owns the node: it renders the final value on the server and on every `value` change.
  const fmtRef = useRef(fmt)
  fmtRef.current = fmt
  const digits = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = digits.current as HTMLSpanElement
    const paint = (n: number): void => {
      const text = fmtRef.current(n)
      // An empty format result leaves no text node to reuse; fall back to textContent.
      if (el.firstChild) el.firstChild.nodeValue = text
      else el.textContent = text
    }
    if (once && done.current) {
      paint(value)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(value)
      done.current = true
      return
    }

    let raf = 0
    let observer: IntersectionObserver | undefined
    const run = (): void => {
      const start = performance.now()
      const tick = (now: number): void => {
        const t = duration > 0 ? Math.min(1, (now - start) / duration) : 1
        if (t < 1) {
          paint(from + (value - from) * easeOutCubic(t))
          raf = requestAnimationFrame(tick)
        } else {
          paint(value)
          done.current = true
        }
      }
      raf = requestAnimationFrame(tick)
    }

    paint(from)
    if (startOnView && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer?.disconnect()
          run()
        }
      })
      observer.observe(el)
    } else {
      run()
    }
    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
    }
  }, [value, from, duration, once, startOnView])

  return (
    <span
      ref={ref}
      role="img"
      aria-label={fmt(value)}
      className={counterStyles({ className })}
      {...rest}
    >
      <span ref={digits} aria-hidden="true">
        {fmt(value)}
      </span>
    </span>
  )
})

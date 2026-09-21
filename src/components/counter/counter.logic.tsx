'use client'

import { type ComponentPropsWithoutRef, forwardRef, useEffect, useRef, useState } from 'react'
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
 * - Formatting: `decimals`/`prefix`/`suffix` cover the common cases; `format` is the escape hatch
 *   for currency and locale. `tabular-nums` keeps the width from jittering as digits change.
 * - Styling: color and size are inherited — wrap in `Text` or pass `className`. The ref points at
 *   the wrapping `<span>`.
 *
 * @example
 * ```tsx
 * import { Counter } from 'sukuna-ui'
 *
 * <Counter value={1240} aria-label="1,240 active users" />
 * <Counter value={99.9} decimals={1} suffix="%" />
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
    className,
    ...rest
  },
  ref,
) {
  const fmt = (n: number): string =>
    format ? format(n) : `${prefix}${n.toFixed(decimals)}${suffix}`

  const [display, setDisplay] = useState(value)
  const done = useRef(false)

  useEffect(() => {
    if (once && done.current) {
      setDisplay(value)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      done.current = true
      return
    }

    let raf = 0
    const start = performance.now()
    setDisplay(from)
    const tick = (now: number): void => {
      const t = duration > 0 ? Math.min(1, (now - start) / duration) : 1
      if (t < 1) {
        setDisplay(from + (value - from) * easeOutCubic(t))
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(value)
        done.current = true
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, from, duration, once])

  return (
    <span
      ref={ref}
      role="img"
      aria-label={fmt(value)}
      className={counterStyles({ className })}
      {...rest}
    >
      <span aria-hidden="true">{fmt(display)}</span>
    </span>
  )
})

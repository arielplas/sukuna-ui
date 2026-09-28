'use client'

import {
  Children,
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { carouselStyles } from './carousel.styles'

type NativeProps = Omit<ComponentPropsWithoutRef<'section'>, 'onChange'>

export interface CarouselProps extends NativeProps {
  /** Names the carousel region — required (WAI-ARIA). */
  'aria-label': string
  /** Controlled active slide index. */
  index?: number
  /**
   * Initial active slide when uncontrolled.
   * @default 0
   */
  defaultIndex?: number
  /** Fires with the next index on every change. */
  onIndexChange?: (index: number) => void
  /**
   * Wrap past the ends.
   * @default false
   */
  loop?: boolean
  /**
   * Advance automatically. Never auto-starts under `prefers-reduced-motion`; always renders a pause
   * control (WCAG 2.2.2) and pauses on hover/focus.
   * @default false
   */
  autoplay?: boolean
  /**
   * Autoplay interval in milliseconds.
   * @default 5000
   */
  autoplayInterval?: number
  /**
   * Pause autoplay while hovered or focused.
   * @default true
   */
  pauseOnHover?: boolean
  /**
   * Render the previous/next controls.
   * @default true
   */
  controls?: boolean
  /**
   * Render the slide indicator dots.
   * @default true
   */
  dots?: boolean
  /** The slides — each direct child becomes one slide. */
  children: React.ReactNode
}

/**
 * An accessible, one-slide-at-a-time content carousel for images, cards, or arbitrary nodes.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) — holds the active index and optional autoplay.
 *   Server-renders every slide with the first active; all timing/DOM access is inside `useEffect`.
 * - Accessibility: the root is a labelled region (`aria-roledescription="carousel"`, required
 *   `aria-label`). Each slide is `role="group"` / `aria-roledescription="slide"` /
 *   `aria-label="{n} of {total}"`. The slides container is `aria-live="polite"` when idle and
 *   `"off"` while auto-rotating. `Prev`/`Next`/dots are real buttons; when `!loop` the end controls
 *   disable. Autoplay never starts under `prefers-reduced-motion`, always exposes a pause control,
 *   and pauses on hover/focus. Arrow keys move slides; `Home`/`End` jump to the ends.
 * - Not in v1: pointer swipe/drag, vertical orientation, multiple visible slides, fade transition —
 *   navigation is via buttons, dots, and the keyboard.
 * - The ref points at the root `<section>`; `className` merges onto it.
 *
 * @example
 * ```tsx
 * import { Carousel } from 'sukuna-ui'
 *
 * <Carousel aria-label="Featured" loop autoplay>
 *   <img src="/1.jpg" alt="First" />
 *   <img src="/2.jpg" alt="Second" />
 *   <img src="/3.jpg" alt="Third" />
 * </Carousel>
 * ```
 */
export const Carousel = forwardRef<HTMLElement, CarouselProps>(function Carousel(
  {
    'aria-label': ariaLabel,
    index,
    defaultIndex = 0,
    onIndexChange,
    loop = false,
    autoplay = false,
    autoplayInterval = 5000,
    pauseOnHover = true,
    controls = true,
    dots = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const slides = Children.toArray(children)
  const count = slides.length
  const [active, setActive] = useControllableState<number>({
    value: index,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  })

  const go = useCallback(
    (to: number) => {
      if (count === 0) return
      const next = loop ? ((to % count) + count) % count : Math.max(0, Math.min(count - 1, to))
      setActive(next)
    },
    [count, loop, setActive],
  )
  const activeRef = useRef(active)
  activeRef.current = active

  // null = motion preference not yet resolved; autoplay stays off until it is (and stays off on the
  // server / first client render, so hydration matches).
  const [reduced, setReduced] = useState<boolean | null>(null)
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const [playing, setPlaying] = useState(autoplay)
  const [hovered, setHovered] = useState(false)
  const running = playing && !(pauseOnHover && hovered) && reduced === false && count > 1

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => go(activeRef.current + 1), autoplayInterval)
    return () => clearInterval(id)
  }, [running, autoplayInterval, go])

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(active - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      go(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      go(count - 1)
    }
  }

  const s = carouselStyles()
  // WAI-ARIA carousel slide semantics, spread as one object (not literal JSX attributes) so the
  // semantic-elements / aria-support lints don't mistake the slide wrapper for a <fieldset>.
  const slideProps = (i: number) => ({
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${i + 1} of ${count}`,
  })
  const hoverHandlers = pauseOnHover
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocusCapture: () => setHovered(true),
        onBlurCapture: () => setHovered(false),
      }
    : {}

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={s.root({ className })}
      onKeyDown={onKeyDown}
      {...hoverHandlers}
      {...rest}
    >
      <div className={s.viewport()} aria-live={running ? 'off' : 'polite'}>
        <div className={s.track()} style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: slides are positional and static in order.
              key={i}
              className={s.slide()}
              {...slideProps(i)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {controls && count > 1 && (
        <div className={s.controls()}>
          <button
            type="button"
            className={s.control()}
            aria-label="Previous slide"
            disabled={!loop && active === 0}
            onClick={() => go(active - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className={s.control()}
            aria-label="Next slide"
            disabled={!loop && active === count - 1}
            onClick={() => go(active + 1)}
          >
            ›
          </button>
        </div>
      )}

      {(dots || autoplay) && count > 1 && (
        <div className={s.footer()}>
          {dots && (
            <div className={s.dots()}>
              {slides.map((_, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: dots mirror the positional slides.
                  key={i}
                  type="button"
                  className={s.dot({ active: i === active })}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          )}
          {autoplay && (
            <button
              type="button"
              className={s.playToggle()}
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={() => setPlaying((p) => !p)}
            >
              <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
            </button>
          )}
        </div>
      )}
    </section>
  )
})

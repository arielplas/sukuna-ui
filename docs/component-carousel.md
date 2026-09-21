# Component: Carousel

> Follows the `docs/component-button.md` section template. Client component (`'use client'`) —
> stateful index, keyboard, swipe, and optional autoplay. Built from scratch (no Base UI carousel in
> the pinned version); follows the WAI-ARIA Carousel pattern.

## 1. Purpose

A horizontal, one-slide-at-a-time content carousel for images, cards, or arbitrary nodes — the gap
`Slider` (a range input) doesn't fill. Accessible by construction: labelled slides, a live region,
keyboard and swipe navigation, and a required pause control whenever it auto-rotates.

## 2. Files

```
src/components/carousel/
├── carousel.styles.tsx   # tv() slots (root/viewport/track/slide/control/dots/dot). Pure. Server-safe.
├── carousel.logic.tsx    # 'use client' — compound parts, index state, keyboard/swipe/autoplay, a11y.
├── carousel.test.tsx
├── carousel.stories.tsx
└── index.tsx             # export { Carousel } ; export type { CarouselProps }
```

## 3. API

Compound. `Carousel` owns state via context; the parts are namespaced (`Carousel.Viewport`, etc.),
mirroring `Accordion`/`Dialog`.

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface CarouselProps extends Omit<ComponentPropsWithoutRef<'section'>, 'onChange'> {
  index?: number                 // controlled active slide
  defaultIndex?: number          // uncontrolled initial; default 0
  onIndexChange?: (index: number) => void
  loop?: boolean                 // wrap past the ends; default false
  autoplay?: boolean             // default false
  autoplayInterval?: number      // ms; default 5000
  pauseOnHover?: boolean         // default true; also pauses on focus-within
  'aria-label': string           // REQUIRED — names the carousel region
  children: ReactNode            // the compound parts
}

// Parts (all forwardRef, accept native props + className):
// Carousel.Viewport  — overflow-clip window (div)
// Carousel.Track     — the moving flex row (div); applies the translateX transform
// Carousel.Slide     — one slide (div); role="group", aria-roledescription="slide", aria-label "{n} of {total}"
// Carousel.Prev      — previous button; disabled at start when !loop
// Carousel.Next      — next button; disabled at end when !loop
// Carousel.Dots      — indicator list; renders one Dot per slide
// Carousel.PlayToggle— pause/resume control; rendered/needed only when autoplay
```

Deliberately **not** in v1 (kept to control scope; logged as `// DECISION(open)`): vertical
orientation, `slidesToShow > 1` / peek, fade transition, infinite virtualization, thumbnail
navigation. `Prev`/`Next`/`Dots`/`PlayToggle` are optional parts — compose only what you need.

## 4. Variants → tokens

`tv()` with slots (no color variants — it inherits surface/text from its slides):

| Slot | Key utilities → tokens |
|---|---|
| root | `relative` |
| viewport | `overflow-hidden` |
| track | `flex` + `transition-transform duration-base ease-sukuna motion-reduce:transition-none` (`--sk-duration-base`, `--sk-ease`) |
| slide | `shrink-0 basis-full` |
| control (Prev/Next) | `inline-flex items-center justify-center rounded-full` + focus ring `ring-focus-ring` (`--sk-radius-pill`, `--sk-focus-ring`); `disabled:opacity-45 disabled:cursor-not-allowed` |
| dots | `flex gap-2` (`--sk-space-2`) |
| dot | `rounded-full bg-line` → active `bg-accent` (`--sk-line`, `--sk-accent`); focus ring |

No new tokens required.

## 5. States

| State | Behavior |
|---|---|
| default | active slide shown; `Track` translated by `index * -100%`. |
| navigate | Prev/Next/Dots/keys change `index`; `Track` transitions over `--sk-duration-base`. |
| prefers-reduced-motion | `motion-reduce:transition-none` — slide change is instant; **autoplay does not auto-start**. |
| at start / at end (`!loop`) | `Prev`/`Next` disabled respectively; with `loop`, they wrap. |
| autoplay running | advances every `autoplayInterval`; `PlayToggle` shows "pause". |
| autoplay paused | on hover/focus-within (`pauseOnHover`), while dragging, when `PlayToggle` pressed, or under reduced-motion. |
| swipe | pointer drag past a threshold commits to the next/prev slide; below threshold snaps back. |
| focus-visible | solid `--sk-focus-ring` on every control. |

## 6. Logic (`carousel.logic.tsx`)

- `'use client'`.
- Index via `useControllableState` (`src/hooks/use-controllable-state.ts`) — supports
  controlled/uncontrolled + `onIndexChange`.
- React context provides `{ index, count, loop, go(n), next(), prev(), isPlaying, toggle() }` to parts.
- `count` derived from the number of `Carousel.Slide` children.
- **Keyboard** (on the viewport/root, `tabIndex` managed): `ArrowLeft`/`ArrowRight` → prev/next,
  `Home`/`End` → first/last; respects `loop`.
- **Swipe**: pointer events on the track (pointerdown/move/up), translate-follow while dragging,
  commit past ~15% width or a velocity threshold; all listeners attached in handlers/`useEffect`
  only.
- **Autoplay**: `setInterval` in `useEffect`; cleared on unmount, on pause conditions, and never
  started when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
- **Live region**: the slides container is `aria-live="polite"` when **not** auto-rotating, and
  `aria-live="off"` while autoplay is running (WAI-ARIA carousel guidance).
- SSR-safe: all `window`/pointer/observer/interval access is inside `useEffect` or event handlers;
  server renders every slide with the first active.

## 7. Styles (`carousel.styles.tsx`)

```ts
import { tv, type VariantProps } from '../../utils/tv'

export const carouselStyles = tv({
  slots: {
    root: 'relative',
    viewport: 'overflow-hidden',
    track: 'flex transition-transform duration-base ease-sukuna motion-reduce:transition-none',
    slide: 'shrink-0 basis-full',
    control:
      'inline-flex items-center justify-center size-10 rounded-full bg-surface-2 text-text border border-line ' +
      'hover:bg-well cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ' +
      'disabled:opacity-45 disabled:cursor-not-allowed',
    dots: 'flex gap-2 justify-center',
    dot: 'size-2 rounded-full bg-line cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
  },
  variants: {
    active: { true: { dot: 'bg-accent' } },
  },
})
export type CarouselStyleProps = VariantProps<typeof carouselStyles>
```

The `Track` transform (`translateX(-index * 100%)`) is applied as an inline `style` computed from
state (SSR-safe: it renders on the server too) — it's positional, not theming, so it doesn't breach
the "zero runtime styling" rule.

## 8. Accessibility checklist

- [ ] Root is a labelled region: `role="group"` (or `aria-roledescription="carousel"`) +
      required `aria-label`.
- [ ] Each slide: `role="group"`, `aria-roledescription="slide"`, `aria-label="{n} of {total}"`.
- [ ] Slides container `aria-live="polite"` when idle, `"off"` during autoplay.
- [ ] `Prev`/`Next` are real `<button>`s with `aria-label`; disabled at the ends when `!loop`.
- [ ] `Dots` are buttons with `aria-label="Go to slide {n}"` and `aria-current` on the active dot.
- [ ] **Autoplay requires `PlayToggle`** (WCAG 2.2.2 pause/stop/hide); autoplay also pauses on
      hover/focus and never auto-starts under reduced-motion.
- [ ] Keyboard: arrows + Home/End move slides; controls are in the tab order; focus is never trapped.
- [ ] Swipe has button equivalents (never swipe-only).
- [ ] `motion-reduce:transition-none` makes slide changes instant.

## 9. Tests

Harness in `docs/testing.md`. Required cases:

- Server render (`renderServer`) emits all slides without throwing.
- `Next`/`Prev` change the active index; `loop=false` disables the end controls; `loop=true` wraps.
- Keyboard Arrow/Home/End navigate.
- `Dots` jump to a slide and set `aria-current`.
- Controlled `index` + `onIndexChange`; uncontrolled `defaultIndex`.
- Autoplay advances on fake timers; `PlayToggle` and hover/focus pause it; reduced-motion
  (mock `matchMedia`) prevents auto-start.
- Live region politeness flips with autoplay state.
- Slides expose `aria-label="{n} of {total}"`.
- Forwards `ref` on each part; consumer `className` merges last.
- axe: zero violations in both themes.
- Browser (Playwright): swipe/drag commits a slide; reduced-motion yields instant transitions.

## 10. Stories

`Playground`, `Basic`, `Loop`, `Autoplay` (with `PlayToggle`), `WithDots`, `Controlled`,
`ImageGallery`, `ReducedMotion` (note). Both themes via the toolbar.

## 11. Decisions

- **Built from scratch** — the pinned Base UI has no carousel. Revisit if/when one lands.
- **v1 scope = single horizontal slide**; vertical, multi-slide/peek, and fade are out (`// DECISION(open)`).
- **Swipe is in v1** — a touch carousel without it feels broken; always paired with buttons.
- **Autoplay pauses under reduced-motion and requires a visible pause control** (WCAG 2.2.2).
- Live-region politeness toggles with autoplay per WAI-ARIA guidance.
- Index state reuses `useControllableState` (consistency with Checkbox/Switch).

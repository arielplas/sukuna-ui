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

**Root-managed** (not compound in v1): each direct child becomes one slide, and the root renders the
viewport, track, controls, dots, and (with `autoplay`) the pause toggle. Index state uses
`useControllableState` (like Checkbox/Switch).

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface CarouselProps extends Omit<ComponentPropsWithoutRef<'section'>, 'onChange'> {
  'aria-label': string           // REQUIRED — names the carousel region
  index?: number                 // controlled active slide
  defaultIndex?: number          // uncontrolled initial; default 0
  onIndexChange?: (index: number) => void
  loop?: boolean                 // wrap past the ends; default false
  autoplay?: boolean             // default false
  autoplayInterval?: number      // ms; default 5000
  pauseOnHover?: boolean         // pause on hover/focus; default true
  controls?: boolean             // render prev/next; default true
  dots?: boolean                 // render indicator dots; default true
  children: ReactNode            // each direct child is one slide
}
```

Deliberately **not** in v1 (logged as `// DECISION(open)`): pointer **swipe/drag** (deferred; buttons
+ dots + keyboard cover navigation), a compound `Carousel.Slide`/`Viewport`/`Track` API, vertical
orientation, `slidesToShow > 1` / peek, fade transition, `inert` on off-screen slides (their focusable
content stays tabbable for now), infinite virtualization, thumbnail navigation.

## 4. Variants → tokens

`tv()` with slots (no color variants — it inherits surface/text from its slides):

| Slot | Key utilities → tokens |
|---|---|
| root | `relative` |
| viewport | `overflow-hidden`; carries the `aria-live` region |
| track | `flex` + `transition-transform duration-base ease-sukuna motion-reduce:transition-none` (`--sk-duration-base`, `--sk-ease`); inline `translateX` transform |
| slide | `shrink-0 grow-0 basis-full` |
| controls | absolute overlay, `pointer-events-none`; buttons re-enable pointer events |
| control | `rounded-full bg-surface-2 border border-line` + focus ring `ring-focus-ring` (`--sk-radius-pill`, `--sk-focus-ring`); `disabled:opacity-45 disabled:cursor-not-allowed` |
| footer | `mt-3 flex justify-center gap-3` — holds dots + play toggle |
| dot | `rounded-full bg-line` → `active` `bg-accent` (`--sk-line`, `--sk-accent`); focus ring |
| playToggle | small round button, focus ring |

No new tokens required.

## 5. States

| State | Behavior |
|---|---|
| default | active slide shown; track translated by `index * -100%`. |
| navigate | prev/next/dots/keys change `index`; track transitions over `--sk-duration-base`. |
| prefers-reduced-motion | `motion-reduce:transition-none` — slide change is instant; **autoplay does not auto-start**. |
| at start / at end (`!loop`) | prev/next disabled respectively; with `loop`, they wrap. |
| autoplay running | advances every `autoplayInterval`; the pause toggle shows "Pause"; slides container `aria-live="off"`. |
| autoplay paused | on hover/focus (`pauseOnHover`), when the toggle is pressed, or under reduced-motion; slides container `aria-live="polite"`. |
| focus-visible | solid `--sk-focus-ring` on every control. |

## 6. Logic (`carousel.logic.tsx`)

- `'use client'`. Root-managed — no context; each direct child is wrapped as one slide.
- Index via `useControllableState` (`src/hooks/use-controllable-state.ts`) — controlled/uncontrolled
  + `onIndexChange`. `count = Children.toArray(children).length`.
- `go(to)`: wraps (`((to % count) + count) % count`) when `loop`, else clamps to `0..count-1`;
  no-op when `count === 0`.
- **Keyboard** (`onKeyDown` on the region): `ArrowLeft`/`ArrowRight` → prev/next, `Home`/`End` →
  first/last; other keys ignored.
- **Autoplay**: `setInterval` in a `useEffect` gated on `running` (`playing && !(pauseOnHover &&
  hovered) && reduced === false && count > 1`); cleared on unmount and whenever `running` drops.
  `reduced` is tri-state (`null` until `matchMedia` resolves) so autoplay never even transiently
  starts on the server / first render or under reduced motion.
- **Live region**: the viewport is `aria-live="polite"` when not auto-rotating, `"off"` while running.
- SSR-safe: all `window`/interval access is inside `useEffect` or event handlers; server renders
  every slide with the first active. The track's `translateX` is an inline positional `style`.

## 7. Styles (`carousel.styles.tsx`)

`tv()` with slots `root`/`viewport`/`track`/`slide`/`controls`/`control`/`footer`/`dots`/`dot`/
`playToggle` and an `active` boolean variant on `dot` (`bg-accent`). All resolve through `--sk-*`
tokens; the track's `translateX(-index * 100%)` is an inline `style` (positional, not theming — no
breach of the zero-runtime-styling rule).

## 8. Accessibility checklist

- [ ] Root is a labelled region: `aria-roledescription="carousel"` + required `aria-label`.
- [ ] Each slide: `role="group"`, `aria-roledescription="slide"`, `aria-label="{n} of {total}"`.
- [ ] Viewport `aria-live="polite"` when idle, `"off"` during autoplay.
- [ ] Prev/next are real `<button>`s with `aria-label`; disabled at the ends when `!loop`.
- [ ] Dots are buttons with `aria-label="Go to slide {n}"` and `aria-current` on the active dot.
- [ ] **Autoplay always renders a pause toggle** (WCAG 2.2.2); autoplay also pauses on hover/focus
      and never auto-starts under reduced-motion.
- [ ] Keyboard: arrows + Home/End move slides; controls are in the tab order; focus is never trapped.
- [ ] `motion-reduce:transition-none` makes slide changes instant.
- [ ] Known v1 gap: off-screen slides' focusable content stays tabbable (no `inert` yet) — a
      documented follow-up.

## 9. Tests

Harness in `docs/testing.md`. Covered cases:

- Server render (`renderServer`) emits all slides + the carousel roledescription + slide labels.
- next/prev move the track; `loop=false` disables the end controls; `loop=true` wraps.
- Keyboard Arrow/Home/End navigate; other keys are ignored.
- Dots jump to a slide and set `aria-current`.
- Controlled `index` + `onIndexChange`; uncontrolled drives itself.
- Autoplay advances on a mocked `setInterval`; the pause toggle and hover/focus pause it (via the
  `aria-live` flip); reduced-motion (mocked `matchMedia`) prevents auto-start (no `setInterval`).
- `controls={false}`/`dots={false}`/`pauseOnHover={false}` and an empty carousel render safely.
- Forwards `ref`; consumer `className` merges last.
- axe: zero violations in both themes.

## 10. Stories

`Playground`, `Basic`, `Loop`, `Autoplay`, `Controlled`, `ImageGallery`. Both themes via the toolbar.

## 11. Decisions

- **Built from scratch** — the pinned Base UI has no carousel. Revisit if/when one lands.
- **Root-managed, not compound, in v1** — slides as direct children; a `Carousel.Slide`/`Viewport`
  API is a later addition if needed.
- **Swipe deferred** (`// DECISION(open)`) — the least unit-testable / most browser-only piece;
  buttons + dots + keyboard fully navigate. Immediate follow-up, paired with `inert` for off-screen
  slides.
- **Autoplay pauses under reduced-motion and always renders a visible pause control** (WCAG 2.2.2);
  `reduced` is tri-state so it never transiently starts.
- Live-region politeness toggles with autoplay per WAI-ARIA guidance.
- Index state reuses `useControllableState` (consistency with Checkbox/Switch).

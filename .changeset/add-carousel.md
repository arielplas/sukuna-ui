---
"sukuna-ui": minor
---

Add `Carousel` — an accessible, one-slide-at-a-time content carousel (the gap `Slider`, a range
input, doesn't fill). Root-managed: each direct child becomes a slide; the root renders the viewport,
track, prev/next controls, and dots. Follows the WAI-ARIA carousel pattern: labelled region, per-slide
`role="group"` + `aria-label="{n} of {total}"`, a live region that goes `off` while auto-rotating,
keyboard (arrows + Home/End), `loop`, and optional `autoplay` that never starts under
`prefers-reduced-motion` and always renders a pause control (WCAG 2.2.2). Controlled or uncontrolled
via `index`/`defaultIndex`/`onIndexChange`. Pointer swipe is a documented v1.1 follow-up. Adds a
component = minor.

---
"sukuna-ui": patch
---

Animation fixes: Tailwind v4 compiles `scale-*`/`translate-*` to the standalone `scale`/`translate`
properties, so transitions listed as `transform` never ran — popup and Dialog scale-in, the Button
press and the Card lift snapped instead of animating (11 components). Indeterminate Progress also
kept animating under `prefers-reduced-motion` (a `data-[indeterminate]` variant outranked
`motion-reduce:`). Both fixed; no API change.

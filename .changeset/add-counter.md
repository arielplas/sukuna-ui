---
"sukuna-ui": minor
---

Add `Counter` — an animated number that counts up to a target value on mount, for stat tiles, KPIs,
and pricing. Server-renders the final value (no-JS/SEO correct); the count-up is a client
enhancement that honors `prefers-reduced-motion` (shows the final value instantly). Supports
`from`, `duration`, `decimals`, `prefix`, `suffix`, a custom `format`, and `once`. The wrapper is
`role="img"` with an `aria-label` of the final value so assistive tech announces it once, not every
frame. Adds a component = minor per the breaking-change table.

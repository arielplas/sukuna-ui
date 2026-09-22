---
"sukuna-ui": minor
---

`Skeleton` gains `animation: 'pulse' | 'shimmer'` — `shimmer` is a light band sweeping across the
block, reusing the `sk-shine` keyframe shipped with ShinyText; `pulse` stays the default. `Table`
gains root options `density: 'comfortable' | 'compact'`, `striped` and `hoverable`, applied through
descendant selectors so the sub-parts stay context-free; `comfortable` is the unchanged default.
Adds variants = minor.

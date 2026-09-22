---
"sukuna-ui": minor
---

Add three additive variants to `Card`. `tone: 'premium'` is the bone/gold surface treatment
(`--sk-premium-dim` border + a 6% premium tint mixed into the surface — the "premium is a surface
treatment" ruling made concrete). `interactive` adds a hover lift and a `focus-within` ring for
cards wrapped in (or containing) a Link/Button — affordance only, it never adds a role or
`tabIndex`. `glow` adds the crimson `--sk-accent-glow` halo on hover. All motion respects
`prefers-reduced-motion`; defaults are unchanged. Adds variants = minor.

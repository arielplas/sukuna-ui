---
"sukuna-ui": minor
---

Add `ShinyText` — sweeps a soft light band across dimmed text for "New" flags, premium labels, and
subtle emphasis. Pure CSS keyframe, static/RSC-safe (no `'use client'`), no runtime deps (unlike the
GSAP-based original). The band is built from `--sk-text` over a legible `--sk-text-dim` base and
freezes under `prefers-reduced-motion`. `speed`: 'slow' | 'normal' | 'fast'. Adds a `sk-shine`
keyframe and `animate-shine*` utilities to the generated theme layer. Adds a component = minor.

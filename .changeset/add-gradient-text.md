---
"sukuna-ui": minor
---

Add `GradientText` — fills text with an on-brand gradient via `background-clip: text` for wordmarks,
hero headings, and accent phrases. Pure CSS, static/RSC-safe (no `'use client'`), zero JavaScript.
The gradient shows through `-webkit-text-fill-color: transparent` while a real `color` (accent)
stays as the accessible fallback. Ships the `accent` gradient (the `premium` variant is pending the
`--sk-gradient-premium` token, owner Q13). Renders real, selectable text as any of `span`/`p`/`h1`–`h6`.
Adds a component = minor.

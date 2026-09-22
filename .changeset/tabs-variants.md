---
"sukuna-ui": minor
---

Add variants to `Tabs`, which had none. `variant: 'underline' | 'pill'` — `underline` (default) is
the existing crimson underline; `pill` is a segmented control on a `well` track whose selected
segment is a lighter `surface` pill with crimson text (lighter than its track in both themes).
`size: 'sm' | 'md' | 'lg'` (32/40/48px, default `md`) joins the shared control scale, and
`fitted` makes tabs share the list width equally. Defaults reproduce the previous styling exactly.
Adds variants = minor.

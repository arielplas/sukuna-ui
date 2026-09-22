---
"sukuna-ui": minor
---

Add a shared `variant: 'filled' | 'outline' | 'ghost'` to the form controls — `Input`, `Select`,
`Combobox` and `NumberField` — using one map so the form layer reads as one. `filled` (default)
is the original `surface-2` fill + `line` border, so nothing changes without opting in; `outline`
is transparent with the line border; `ghost` is borderless and transparent until hover/focus (the
inline-edit field), and `invalid` still wins with the crimson border. `Combobox` also gains the
shared `size: 'sm' | 'md' | 'lg'` scale (default `md`, the previous fixed height). Adds variants =
minor.

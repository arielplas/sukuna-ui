---
"sukuna-ui": minor
---

Standardize the `size` scale to `sm | md | lg` across controls: add `lg` to `Checkbox` (24px box),
`Switch` (28×52px), `Progress` (12px track), `Select` (48px trigger) and `RadioGroup` (24px circle).
Button, Input, NumberField and ToggleGroup already had `lg`, so mixed forms no longer hit a missing
size. Defaults are unchanged (`md`). Adds a variant = minor.

---
"sukuna-ui": minor
---

Add `NumberField` — a numeric input with stepper buttons, keyboard increment (`Arrow`, `Shift`+Arrow
/`PageUp`-`PageDown` for `largeStep`, `Home`/`End` to the bounds), min/max clamping, and `Intl`
locale formatting (`format`, e.g. currency or percent). Built on Base UI `number-field`
(`'use client'`); `forwardRef` targets the `<input>`. Sizes `sm`/`md`/`lg`; wheel scrubbing is
opt-in via `allowWheelScrub`. `disabled`/`name`/`id`/`required` apply to the field root, other native
input props spread onto the input. Adds a component = minor.

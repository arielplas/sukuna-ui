---
"sukuna-ui": minor
---

Add `ToggleGroup` (plus a standalone `Toggle`) — a segmented control of pressable buttons, single by
default or multi-select via `multiple`. Built on Base UI `toggle-group`/`toggle` (`'use client'`),
prop-driven `items` like `Menu`/`Select`. Roving focus with Arrow keys, `aria-pressed` per button,
`aria-label` required on the group and on icon-only items; sizes `sm`/`md`/`lg` and horizontal or
vertical `orientation`. `onValueChange` always reports an array (even in single mode). Standalone
`Toggle` is a single on/off `<button>` (`forwardRef`). Adds components = minor.

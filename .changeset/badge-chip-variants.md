---
"sukuna-ui": minor
---

Add `variant: 'soft' | 'solid' | 'outline'` to `Badge` and `Chip` (one shared tone × variant map),
plus `selected` on `Chip` for filter lists (accent border + text via `data-selected`; visual only —
the toggle lives on a wrapping Button/Link, or use `ToggleGroup`). `variant` has no public
default: unset keeps each tone's original look (`accent` solid, the rest soft), so nothing changes
without opting in. Solid fills label with the page-background token so they stay legible in both
themes. Adds variants = minor.

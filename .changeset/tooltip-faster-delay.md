---
"sukuna-ui": minor
---

`Tooltip`: halve the default open `delay` to **300 ms** (was Base UI's 600 ms) so tooltips appear
more promptly on hover; keyboard focus still opens instantly, and you can override per-instance with
`delay`. Changing a documented default is a breaking change (minor on 0.x).

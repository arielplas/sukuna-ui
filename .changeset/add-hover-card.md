---
"sukuna-ui": minor
---

Add `HoverCard` — a rich floating card revealed on hover or keyboard focus of a link (a user card,
repo summary, footnote preview). Built on Base UI `preview-card` (`'use client'`); compound
`HoverCard` + `HoverCard.Trigger` (an `<a>`, with `delay`/`closeDelay`) + `HoverCard.Content`
(`side`/`align`/`sideOffset`). Unlike `Tooltip` its content is reachable by assistive tech and may
hold interactive elements; `prefers-reduced-motion` collapses the transition. The open `delay`
defaults to 300 ms (halved from Base UI's 600 for a snappier preview). Adds a component = minor.

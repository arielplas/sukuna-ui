---
"sukuna-ui": minor
---

Add `ContextMenu` — a right-click (desktop) / long-press (touch) menu of actions over a target area.
Built on Base UI `context-menu` (`'use client'`), prop-driven `items` reusing `Menu`'s
`MenuItemOption` shape, with popup/item styling kept in parity with `Menu`. Full keyboard support
(also `Shift`+`F10`); disabled rows skipped. `children` are wrapped in a `display: contents` trigger
that sets `user-select: none` / `-webkit-touch-callout: none` so an iOS long-press opens the menu
instead of starting text selection. Because right-click isn't discoverable, expose the same actions
through a visible control as well. Adds a component = minor.

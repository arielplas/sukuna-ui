---
"sukuna-ui": minor
---

Performance for large lists (no new dependency). Combobox and Menu items now use
`content-visibility: auto` so the browser skips layout/paint of off-screen options in long lists.
Combobox gains a `maxRenderedItems` prop (maps to Base UI's `limit`) — search still spans every
item, only the top N filtered results render. `Select.Value` uses an O(1) memoized lookup instead
of an O(n) `items.find` per render, and `MenuItemOption` accepts an optional stable `id` for keying
dynamic menus. For very large datasets (thousands of rows/options), still paginate or use
server-side search — `content-visibility` speeds paint but doesn't reduce DOM nodes; see the
Performance section of the README.

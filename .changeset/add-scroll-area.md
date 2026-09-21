---
"sukuna-ui": minor
---

Add `ScrollArea` — a bounded region with consistent, themed scrollbars across browsers/OSes. Content
is real, server-rendered DOM inside a native-scrolling viewport (wheel, keyboard, selection and
find-in-page all native); only the thumb is custom. Built on Base UI `scroll-area` (`'use client'`),
`forwardRef` to the root. `orientation` `vertical` (default) / `horizontal` / `both` (adds a corner);
size the region with `className` on the root. Adds a component = minor.

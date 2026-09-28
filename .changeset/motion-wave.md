---
"sukuna-ui": minor
---

Motion wave (CSS-only, see `docs/motion.md`): new tokens `--sk-duration-slow` / `duration-slow` and
`--sk-ease-spring` / `ease-spring`, plus an `animate-indeterminate` utility. Tabs get a sliding
indicator (horizontal and vertical); Accordion panels animate their height; Menu, ContextMenu,
Select, Combobox, Popover, Tooltip and HoverCard slide in from their trigger side; Toasts stack as a
deck that fans out on hover and can be swiped away; Meter and Progress bars grow in, and
indeterminate Progress slides instead of pulsing. Everything honors `prefers-reduced-motion`.
Adds tokens/utilities → minor.

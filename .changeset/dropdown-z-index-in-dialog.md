---
"sukuna-ui": minor
---

Fix dropdowns rendering behind a Dialog/Drawer. Select, Menu, Combobox and Tooltip put their
z-index on the inner popup, but the element portalled to `<body>` is the Base UI **positioner** —
which Floating UI gives a transform (its own stacking context), so the popup's z-index couldn't
clear a modal. The z-index now lives on the positioner.

Overlay stacking is also now a coherent, monotonic token scale so a surface opened *inside* a
dialog sits above it: `--sk-z-dialog: 50` < `--sk-z-popover: 60` < `--sk-z-toast: 70` <
`--sk-z-tooltip: 80`. New tokens `--sk-z-popover` and `--sk-z-toast` are added; `--sk-z-tooltip`
moves from `40` to `80` (it now clears dialogs, as a tooltip inside a dialog must). Dialog, Drawer
and Toast reference these tokens instead of a hard-coded `z-50`. Override any `--sk-z-*` to
re-layer.

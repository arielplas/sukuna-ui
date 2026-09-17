# sukuna-ui

## 0.4.0

### Minor Changes

- b5411f4: Fix dropdowns rendering behind a Dialog/Drawer. Select, Menu, Combobox and Tooltip put their
  z-index on the inner popup, but the element portalled to `<body>` is the Base UI **positioner** —
  which Floating UI gives a transform (its own stacking context), so the popup's z-index couldn't
  clear a modal. The z-index now lives on the positioner.

  Overlay stacking is also now a coherent, monotonic token scale so a surface opened _inside_ a
  dialog sits above it: `--sk-z-dialog: 50` < `--sk-z-popover: 60` < `--sk-z-toast: 70` <
  `--sk-z-tooltip: 80`. New tokens `--sk-z-popover` and `--sk-z-toast` are added; `--sk-z-tooltip`
  moves from `40` to `80` (it now clears dialogs, as a tooltip inside a dialog must). Dialog, Drawer
  and Toast reference these tokens instead of a hard-coded `z-50`. Override any `--sk-z-*` to
  re-layer.

## 0.3.0

### Minor Changes

- 8262442: Add three Tier-3 components: **Breadcrumbs** (navigation trail), **Slider** (single-value range,
  Base UI), and **Pagination** (controlled, with an ellipsis range helper). All themed via `--sk-*`,
  100% unit coverage, with a browser test for the Slider's keyboard behavior.
- 37bd60a: Add the final v1.1 components, completing the set: **Drawer** (side-anchored overlay over Base UI
  Dialog, left/right/top/bottom), **Stepper** (ordered progress indicator), **Combobox** (free-text
  autocomplete over Base UI), and **Table** (styled compound over native table elements). All themed
  via `--sk-*`, 100% unit coverage, with browser tests for Drawer and Combobox. The library now ships
  29 components.

## 0.2.0

### Minor Changes

- 44f2255: Add four more v1.1 components (Base UI-backed): **Avatar** (image with graceful fallback),
  **RadioGroup** (single-choice, arrow-key selection), **Tabs** (tabbed panels, horizontal), and
  **Accordion** (expandable sections). All themed via `--sk-*`, 100% unit coverage, with Playwright
  browser tests for the interactive keyboard behavior. This completes the v1.1 Tier-1 set.
- 7b6d3d3: Add four static components (v1.1): **Divider** (horizontal/vertical separator), **Alert** (info/
  success/warning/danger inline message), **Chip** (compact token with optional dismiss), and
  **Spinner** (indeterminate loading indicator). All RSC-safe, themed via `--sk-*`, 100% covered.
- 23445b1: Add three v1.1 Tier-2 components: **Skeleton** (loading placeholder, text/rectangular/circular),
  **Progress** (determinate/indeterminate bar, Base UI), and **Menu** (dropdown action menu, Base UI,
  with a browser test). All themed via `--sk-*` with 100% unit coverage.
- 87a4d40: Add **Toast** (Base UI): wrap the app in `ToastProvider` and call `useToast().toast({ title,
description })` to show transient notifications. Completes the v1.1 Tier-2 set. 100% unit coverage
  plus a browser test.

## 0.1.0

### Minor Changes

- f6b4d08: Initial release. Ten v1 components — Text, Badge, Card (static/RSC-safe); Button, Input, Checkbox,
  Switch (native interactive); Tooltip, Dialog, Select (headless-backed by Base UI) — in the Sukuna
  design language. Dark-default theming via `data-theme` with an approved light palette, Tailwind v4
  `@theme` tokens plus a precompiled `styles.css` fallback, SSR-safe zero-runtime styling, and React
  18/19 support.

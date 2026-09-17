# sukuna-ui

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

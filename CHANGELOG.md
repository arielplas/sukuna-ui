# sukuna-ui

## 0.8.0

### Minor Changes

- f896480: Add `Carousel` — an accessible, one-slide-at-a-time content carousel (the gap `Slider`, a range
  input, doesn't fill). Root-managed: each direct child becomes a slide; the root renders the viewport,
  track, prev/next controls, and dots. Follows the WAI-ARIA carousel pattern: labelled region, per-slide
  `role="group"` + `aria-label="{n} of {total}"`, a live region that goes `off` while auto-rotating,
  keyboard (arrows + Home/End), `loop`, and optional `autoplay` that never starts under
  `prefers-reduced-motion` and always renders a pause control (WCAG 2.2.2). Controlled or uncontrolled
  via `index`/`defaultIndex`/`onIndexChange`. Pointer swipe is a documented v1.1 follow-up. Adds a
  component = minor.
- c60d519: Add `ContextMenu` — a right-click (desktop) / long-press (touch) menu of actions over a target area.
  Built on Base UI `context-menu` (`'use client'`), prop-driven `items` reusing `Menu`'s
  `MenuItemOption` shape, with popup/item styling kept in parity with `Menu`. Full keyboard support
  (also `Shift`+`F10`); disabled rows skipped. `children` are wrapped in a `display: contents` trigger
  that sets `user-select: none` / `-webkit-touch-callout: none` so an iOS long-press opens the menu
  instead of starting text selection. Because right-click isn't discoverable, expose the same actions
  through a visible control as well. Adds a component = minor.
- 8a0402f: Add `Counter` — an animated number that counts up to a target value on mount, for stat tiles, KPIs,
  and pricing. Server-renders the final value (no-JS/SEO correct); the count-up is a client
  enhancement that honors `prefers-reduced-motion` (shows the final value instantly). Supports
  `from`, `duration`, `decimals`, `prefix`, `suffix`, a custom `format`, and `once`. The wrapper is
  `role="img"` with an `aria-label` of the final value so assistive tech announces it once, not every
  frame. Adds a component = minor per the breaking-change table.
- 46324fa: Add `GradientText` — fills text with an on-brand gradient via `background-clip: text` for wordmarks,
  hero headings, and accent phrases. Pure CSS, static/RSC-safe (no `'use client'`), zero JavaScript.
  The gradient shows through `-webkit-text-fill-color: transparent` while a real `color` (accent)
  stays as the accessible fallback. Ships the `accent` gradient (the `premium` variant is pending the
  `--sk-gradient-premium` token, owner Q13). Renders real, selectable text as any of `span`/`p`/`h1`–`h6`.
  Adds a component = minor.
- c60d519: Add `HoverCard` — a rich floating card revealed on hover or keyboard focus of a link (a user card,
  repo summary, footnote preview). Built on Base UI `preview-card` (`'use client'`); compound
  `HoverCard` + `HoverCard.Trigger` (an `<a>`, with `delay`/`closeDelay`) + `HoverCard.Content`
  (`side`/`align`/`sideOffset`). Unlike `Tooltip` its content is reachable by assistive tech and may
  hold interactive elements; `prefers-reduced-motion` collapses the transition. The open `delay`
  defaults to 300 ms (halved from Base UI's 600 for a snappier preview). Adds a component = minor.
- c60d519: Add `NumberField` — a numeric input with stepper buttons, keyboard increment (`Arrow`, `Shift`+Arrow
  /`PageUp`-`PageDown` for `largeStep`, `Home`/`End` to the bounds), min/max clamping, and `Intl`
  locale formatting (`format`, e.g. currency or percent). Built on Base UI `number-field`
  (`'use client'`); `forwardRef` targets the `<input>`. Sizes `sm`/`md`/`lg`; wheel scrubbing is
  opt-in via `allowWheelScrub`. `disabled`/`name`/`id`/`required` apply to the field root, other native
  input props spread onto the input. Adds a component = minor.
- c60d519: Add `ScrollArea` — a bounded region with consistent, themed scrollbars across browsers/OSes. Content
  is real, server-rendered DOM inside a native-scrolling viewport (wheel, keyboard, selection and
  find-in-page all native); only the thumb is custom. Built on Base UI `scroll-area` (`'use client'`),
  `forwardRef` to the root. `orientation` `vertical` (default) / `horizontal` / `both` (adds a corner);
  size the region with `className` on the root. Adds a component = minor.
- 3154908: Add `ShinyText` — sweeps a soft light band across dimmed text for "New" flags, premium labels, and
  subtle emphasis. Pure CSS keyframe, static/RSC-safe (no `'use client'`), no runtime deps (unlike the
  GSAP-based original). The band is built from `--sk-text` over a legible `--sk-text-dim` base and
  freezes under `prefers-reduced-motion`. `speed`: 'slow' | 'normal' | 'fast'. Adds a `sk-shine`
  keyframe and `animate-shine*` utilities to the generated theme layer. Adds a component = minor.
- c60d519: Add `ToggleGroup` (plus a standalone `Toggle`) — a segmented control of pressable buttons, single by
  default or multi-select via `multiple`. Built on Base UI `toggle-group`/`toggle` (`'use client'`),
  prop-driven `items` like `Menu`/`Select`. Roving focus with Arrow keys, `aria-pressed` per button,
  `aria-label` required on the group and on icon-only items; sizes `sm`/`md`/`lg` and horizontal or
  vertical `orientation`. `onValueChange` always reports an array (even in single mode). Standalone
  `Toggle` is a single on/off `<button>` (`forwardRef`). Adds components = minor.
- c60d519: `Tooltip`: halve the default open `delay` to **300 ms** (was Base UI's 600 ms) so tooltips appear
  more promptly on hover; keyboard focus still opens instantly, and you can override per-instance with
  `delay`. Changing a documented default is a breaking change (minor on 0.x).

### Patch Changes

- 2ec410f: Button now shows `cursor: pointer` on hover, matching every other interactive component (switch, tabs, accordion, menu items, etc.). The `disabled`/`aria-disabled`/`aria-busy` cursor states are unchanged and still override it. Visual-behavior fix with no API or layout change — patch per the breaking-change table.

## 0.7.0

### Minor Changes

- 1bebf2d: Checkbox: new `label` prop renders the text inside a real `<label>` beside the box, so clicking
  the text toggles it and names it for assistive tech. Enter now toggles the box like Space does;
  the component prevents the default so Enter never implicitly submits a surrounding form (a
  consumer `onKeyDown` that calls `preventDefault()` opts out).

### Patch Changes

- 1bebf2d: Select: the popup now opens below the trigger (flipping above when cramped) instead of Base UI's
  macOS-style "align selected item with trigger" mode, so the mouse wheel scrolls the list rather
  than growing/moving the popup. The popup is at least as wide as the trigger and caps its height at
  the space available on its side (`--available-height`), so a Select near the bottom of the
  viewport no longer runs off the page. Storybook gains a `ManyItems` story (100 numeric options).

## 0.6.0

### Minor Changes

- a6c2ba3: Accordion: new `headingLevel` prop (1–6, default 3) so each item's header renders as the right
  `<h1>`–`<h6>` for your document outline (WCAG 1.3.1), with the trigger nested inside the heading.
- ded3d69: Documented for AI agents and search. Every exported component and prop now carries rich TSDoc in
  the published `.d.ts` — purpose, `@remarks` (SSR/RSC posture, accessibility and keyboard behaviour,
  every variant with its default), `@default`, and copy-pasteable `@example`s — so IDE hover and
  agents reading `node_modules/sukuna-ui` are self-sufficient. New generated agent-facing docs
  (`llms.txt`, `llms-full.txt`, `docs/llms/<component>.md`) are built from the component specs by
  `bun run docs:build` and drift-checked in CI. The README is rewritten code-first with a "For AI
  agents" section and a generated component table; `package.json` gains `keywords`/`author` and a
  sharper description. The showcase example is now a deployable, prerendered, SEO-complete site
  (meta/Open Graph/JSON-LD `SoftwareApplication`, sitemap, robots, favicon, llms files). No runtime
  behaviour changes.
- a6c2ba3: Alert: the ARIA role now derives from `tone` — `role="alert"` (assertive) for `danger`/`warning`,
  `role="status"` (polite) otherwise — so urgent alerts interrupt screen readers appropriately. An
  explicit `role` prop still overrides.
- a6c2ba3: Button is now polymorphic: `<Button as="a" href="…">` renders an anchor with the same styling for
  "link that looks like a button". A disabled link maps to `aria-disabled` + `tabindex={-1}` +
  non-interactive styles (anchors have no native `disabled`). Default (no `as`) is unchanged.
- 72cb4e2: Export `Tabs` (and its `TabItem` / `TabsProps` types) from the package entry. The component
  shipped, was documented and tested, but was never re-exported from `src/index.ts`, so
  `import { Tabs } from "sukuna-ui"` failed. It's now importable like every other component, guarded
  by a test that asserts every component directory is re-exported.
- a6c2ba3: New `Field` component — a form-control wrapper (compound: `Field` + `Field.Label` / `Field.Control`
  / `Field.Description` / `Field.Error`) built on Base UI Field. It wires label association,
  `aria-describedby` for description and error, and `aria-invalid`, so a labelled/validated input is
  correct by construction. Set `invalid` and the error shows and links automatically.

### Patch Changes

- 72cb4e2: Breadcrumbs: key items by position instead of `href`. Keying by `href` produced duplicate React
  keys when two crumbs shared one (e.g. repeated or placeholder hrefs); a breadcrumb trail is a fixed,
  ordered list, so the index is the correct stable key.

## 0.5.0

### Minor Changes

- 02823b2: Accessibility pass (contrast + focus). Retuned color tokens so every text color clears WCAG AA in
  both themes: `text-faint` (was ~3:1, it colors all placeholders), and light-theme `premium`,
  `premium-dim` and `success`. The focus ring is now a **solid** color via a new `--sk-focus-ring`
  token (the translucent `--sk-accent-glow` failed the 3:1 non-text bar as the sole focus indicator);
  `--sk-accent-glow` remains for decorative glow. Menu/Select/Combobox keyboard highlight is now a
  crimson inset ring that meets 3:1 (was a near-invisible 6%-opacity fill). Avatar defaults `alt=""`
  when omitted, Progress defaults an accessible name when unlabeled, and the Toast close button is a
  larger touch target (24→32px). Override any `--sk-*` token to re-tune.
- 59a34b8: Button primary label now meets WCAG AA contrast. The near-white label on the crimson gradient was
  ~3.1:1; the primary label uses a new `--sk-on-accent` token (white, both themes, so it no longer
  flips to dark in light mode) and the dark-theme gradient's light stop is darkened `#FF3B4E → #D8253A`
  so white clears 4.95:1. Still a crimson gradient. The shared `--sk-gradient-accent` (wordmark/hero)
  darkens slightly with it; override the token to customize.
- eca98f2: Performance for large lists (no new dependency). Combobox and Menu items now use
  `content-visibility: auto` so the browser skips layout/paint of off-screen options in long lists.
  Combobox gains a `maxRenderedItems` prop (maps to Base UI's `limit`) — search still spans every
  item, only the top N filtered results render. `Select.Value` uses an O(1) memoized lookup instead
  of an O(n) `items.find` per render, and `MenuItemOption` accepts an optional stable `id` for keying
  dynamic menus. For very large datasets (thousands of rows/options), still paginate or use
  server-side search — `content-visibility` speeds paint but doesn't reduce DOM nodes; see the
  Performance section of the README.
- 32456bf: Respect `prefers-reduced-motion: reduce`. Every animated component now drops its movement under the
  OS "reduce motion" setting via Tailwind's `motion-reduce:` variant: spinners/skeletons/progress stop
  their spin/pulse, overlay enter-exit slide/scale transitions (Dialog, Drawer, Toast, Menu, Select,
  Combobox, Tooltip, Accordion, Switch) become instant, and the Button press-scale is disabled.
  Color-only transitions are unaffected. Verified with a Playwright test that emulates the preference.

### Patch Changes

- 2271c19: RadioGroup: clicking an option's label text now selects it, not just the radio circle. The whole
  row is the control; the accessible name (via `aria-labelledby`) and visuals are unchanged.
- 71b3b0b: Tabs: a disabled tab is now visibly dimmed with a `not-allowed` cursor. It relied on the native
  `:disabled` pseudo-class, but Base UI keeps a disabled tab focusable and marks it with
  `data-disabled` (no native `disabled` attribute), so the dim styling never applied. Now gated on
  `data-disabled` too.
- 4d8d151: Tabs: the selected tab is now clearly styled. It keyed off `data-[selected]`, but Base UI's
  `Tabs.Tab` uses `aria-selected` (there is no `data-selected`), so the active tab previously had no
  distinct styling. The selected tab now shows crimson text and a crimson underline.

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

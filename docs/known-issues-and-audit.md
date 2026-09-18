# Known issues & audit — sukuna-ui

_Compiled 2026-09-17. Two halves: **Part I** catalogs real, verified bugs (and their fixes) that
other React component libraries have shipped and struggled with — every entry links a genuine
GitHub issue/PR or official doc — so sukuna-ui can pre-empt them. **Part II** is a first-party
audit of sukuna-ui itself: accessibility + WCAG contrast (measured ratios) and performance at scale
(measured SSR + real-browser numbers for tables/dropdowns at up to 1,000,000 items). This document
was produced by five parallel research/audit agents; findings were verified, not estimated._

> Status: this is a findings document, not a changelog. Nothing here is fixed yet except the
> z-index/stacking bug (dropdowns behind dialogs), which was resolved in `0.4.0` (commit `b5411f4`)
> and is referenced throughout as the worked example. Turn the P0/P1 items below into changesets.

## Executive summary

- **Part I — ecosystem (52 verified findings):** MUI (16), Radix + Base UI (18), Chakra + Mantine
  + Ant Design (18). Five themes recur across every library:
  1. **Portalled popups vs. modals (z-index/stacking).** The single most common complaint. The
     element portalled to `<body>` gets a transform → its own stacking context, so a z-index on the
     inner popup does nothing. Everyone converged on the same answer sukuna-ui just adopted: put the
     z-index on the **positioner**, and use a **monotonic token scale** (`dialog < popover < toast <
     tooltip`). Chakra's scale and Ant Design's `zIndexContext` are the reference designs.
  2. **Runtime CSS-in-JS causes SSR/hydration pain.** MUI (Emotion insertion order), Ant Design,
     Chakra and Mantine all bled hydration mismatches and FOUC — and Ant Design, Chakra v3 and
     Mantine v7 all migrated *away* from runtime CSS-in-JS toward static CSS/CSS-vars. This is
     strong external validation of sukuna-ui's "zero runtime styling / static Tailwind" rule.
  3. **Large data needs virtualization.** Autocomplete/Select/Table in every library collapse past a
     few thousand items until windowed (react-window / rc-virtual-list / `useVirtualizedCombobox`).
  4. **Focus & `inert`.** `aria-hidden` alone doesn't remove background from the tab order; modals
     need `inert`. Focus-guard sentinels trip axe (`aria-hidden` + `tabindex`).
  5. **Dark-mode flash.** A persisted theme toggle needs a pre-paint inline script; system-default
     (CSS `prefers-color-scheme`) avoids it. sukuna-ui is dark-default, so it dodges this today.

- **Part II — sukuna-ui audit:** the accessibility pass found **1 Critical** contrast failure and a
  cluster of **High** issues (all with measured ratios); the performance pass found **2 Critical**
  virtualization gaps with hard numbers — a 1,000,000-row Table is **15.4 s / 305 MB / 5M nodes**
  to render and a 100k-row table **freezes the browser 2.2 s on mount**; a Select/Combobox popup
  blows the 100 ms open budget at **~10k items**. Nothing in the library virtualizes.

## Prioritized fix backlog (sukuna-ui)

Ranked by severity; each ties to the detailed finding in Part II and the ecosystem precedent in
Part I. Classify each as a changeset per the breaking-change table before implementing.

| # | Pri | Area | Issue (measured) | Recommended fix | Precedent |
|---|-----|------|------------------|-----------------|-----------|
| 1 | **P0** | Contrast | `text-faint` fails AA 4.5:1 in **both** themes (2.99–3.57:1) yet colors all Input/Select/Combobox **placeholders** | Retune the `text-faint` token to ≥4.5:1 on `surface`, or use `text-dim` (passes) for placeholders; re-run the contrast script | AntD palette #28760 |
| 2 | **P0** | Perf | **Table** renders every row: 100k freezes the tab 2.2 s; 1M = 15.4 s / 305 MB SSR | Opt-in `Table.Virtualized` (`@tanstack/react-virtual`); `content-visibility:auto` `@utility` as a zero-API stopgap; document a ~200-row ceiling | AntD virtual table; Mantine |
| 3 | **P0** | Perf | **Select/Combobox** render every item: open >100 ms at ~10k, 601 ms at 100k, 3.6M px scroll | Virtualized list (Base UI supports `@tanstack/react-virtual`) or `maxRenderedItems` + async-search guidance | MUI #25417/#38714; Mantine `useVirtualizedCombobox` |
| 4 | **P1** | Focus | Focus ring (`accent-glow`) fails 3:1 non-text (1.7–2.6:1) and is the **only** indicator on Button/Slider/Chip/Close | Add a solid `--sk-focus-ring` token at ≥3:1 on all surfaces; keep the glow for decorative shadow only | Chakra a11y #4225 |
| 5 | **P1** | Contrast | Button **primary label** on the crimson gradient is 3.1:1 (dark)/3.7:1 (light) | Darken the gradient's light stop toward `accent-deep`, or use a lighter label; verify ≥4.5:1 | AntD #28760 |
| 6 | **P1** | Contrast | Light-theme `premium` / `premium-dim` / `success` fail as text (2.68–4.20:1) in Badge/Chip/Alert | Darken the light-theme values to ≥4.5:1 on `surface` (status dots at 3:1 are fine) | AntD #28760 |
| 7 | **P1** | Motion | **No** component honors `prefers-reduced-motion` (0 matches library-wide) | Global `@media (prefers-reduced-motion: reduce)` rule + `motion-reduce:*` variants on animated slots | WCAG 2.3.3 |
| 8 | **P1** | Perf | Combobox does O(n) filtering per keystroke over all `items` | Expose `filterFn`/async `onFilter` for debounced server search + capped results | MUI renderOption #34712 |
| 9 | **P2** | Focus | Menu keyboard highlight is 6%-opacity (`bg-line-soft`) — near invisible, no ring | Stronger `data-[highlighted]` (e.g. `bg-surface-2` + accent), ≥3:1 vs popup | — |
| 10 | **P2** | Correctness | Menu uses array-index keys; no memoized rows | Key by a stable `id`/label; `React.memo` rows (subsumed by virtualization) | MUI stable `key` #34712 |
| 11 | **P2** | ARIA | Avatar `alt`, Progress accessible name not defaulted; Toast close is a 24px target | Default `alt=""`/`aria-label`; bump Toast close to `size-8` | Radix Toast #3634 |
| 12 | **P3** | Perf | `Select.Value` runs `items.find` (O(n)) per render; size budget covers only Button | `useMemo` a `Map<value,label>`; add size-limit entries for Table + Select | MUI Select #17806 |

### Upstream Base UI watch-list (verify sukuna-ui's pinned version)

These are real Base UI behaviors that can bite an SSR-first consumer — confirm each against the
version sukuna-ui pins, and add a regression test where noted (details in Part I → Radix & Base UI):

- **Combobox disabled `Trigger` SSR hydration mismatch** (base-ui #5726, **still open**) — a disabled
  trigger emits `disabled` client-only. sukuna-ui is SSR-first + ships Combobox: avoid rendering the
  trigger disabled on first paint until fixed.
- **Controlled Select won't clear on `value={null}`** (fixed #1596) — add a reset-to-placeholder test.
- **Tabs `onValueChange` doesn't fire for the auto-selected first tab** (fixed #4704) — set an explicit
  `defaultValue` if syncing from the callback.
- **Radio/Checkbox/Switch get no name from a wrapping `<label>`** (fixed #4142) — wire explicit
  `aria-labelledby`; sukuna-ui already does this for RadioGroup, audit Checkbox/Switch.
- **Toast `aria-live` must be `polite`/`assertive`, never `off`** (Radix #3634) and **don't add a second
  live region** (Base UI dedup PR #5731) — add a test asserting the live value.
- **Modal background needs `inert`, not just `aria-hidden`** (base-ui #4678/#5528) — verify Dialog/Drawer
  background is truly non-tabbable in a real-browser test.


---

## Part I — Known issues across the React component-library ecosystem

Real, verified issues and their fixes/status from other libraries, so sukuna-ui can learn from them. Every finding links a genuine GitHub issue/PR or official doc. Grouped by library.

### Material UI (MUI)

Material UI is the most widely deployed React component library, so its public bug tracker is a
deep record of the problems any component library eventually hits: portaled popups losing the
z-index/stacking fight with modals, SSR/hydration mismatches under the Next.js App Router,
Autocomplete/Select collapsing under large datasets, ARIA/focus-management regressions flagged by
axe, flash-of-wrong-theme on first paint, and barrel-import bundle bloat. The findings below are
real, verifiable issues and PRs (with numbers and links), spanning both `@mui/material` (Emotion +
Popper based) and the newer `@mui/base-ui` (the CSS-agnostic headless rewrite, closest in spirit to
sukuna-ui's Base UI foundation). Each note ends with why it matters for sukuna-ui — an SSR-first,
dark-default library built on Base UI + Tailwind v4 + tailwind-variants, tokens as CSS variables,
portals via the Base UI positioner.

#### Base UI Select renders behind a Dialog regardless of z-index
- **Category:** z-index / portal / stacking
- **Problem:** A `Select` placed inside a `Dialog` renders its popup *beneath* the dialog surface no matter what z-index you set on either component.
- **Root cause:** `Select.Popup` is portaled through Base UI's portal system while `Dialog` was not fully participating in the same portal/stacking strategy, so the dialog established a stacking context the portaled select could not escape — a classic "z-index does nothing across sibling stacking contexts" trap.
- **Fix / resolution:** Tracked on the Base UI roadmap and closed as completed; the direction is to make portaled popups and the dialog layer share a consistent portal + layering strategy rather than fight with raw z-index. Interim workaround: portal the Select to the same container / raise the popup's layer.
- **Link(s):** https://github.com/mui/base-ui/issues/2450
- **Relevance to sukuna-ui:** sukuna-ui also portals popups via the Base UI positioner into modal Dialogs/Drawers — the recent commit b5411f4 ("dropdowns render above dialogs/drawers") shows this exact fight; keep dialog/drawer and positioner layers on one predictable, token-driven stacking order rather than ad-hoc z-index bumps.

#### Autocomplete dropdown z-index and scroll clipping over headers/dialogs
- **Category:** z-index / portal / stacking
- **Problem:** The Autocomplete listbox appears over fixed headers and dialogs, or gets clipped, when the page scrolls.
- **Root cause:** The Popper is portaled to `<body>` but its position is recomputed on scroll; combined with app-level fixed elements and inconsistent z-index tiers the popup lands in the wrong layer.
- **Fix / resolution:** Guidance is to control the Popper `z-index`/container via `slotProps` and to close/reposition on scroll; MUI's Popper uses Popper.js/floating-ui to reposition, but the z-index tier must be set intentionally.
- **Link(s):** https://github.com/mui/material-ui/issues/30523 , https://github.com/mui/material-ui/issues/11824
- **Relevance to sukuna-ui:** Define a single documented z-index scale as `--sk-*` tokens (dropdown < popover < tooltip < dialog < toast) so portaled Base UI positioners never guess; reposition/close on scroll for anchored popups.

#### `disablePortal` foot-guns: clipping under `overflow:hidden` and misplaced poppers
- **Category:** z-index / portal / stacking
- **Problem:** Turning on `disablePortal` (to keep DOM structure for SEO/styling) causes tooltips/poppers to be clipped by an ancestor's `overflow:hidden`, and nested (popper-within-popper) cases get wrong initial placement or sporadic repositioning.
- **Root cause:** Without a portal the popup lives inside the anchor's overflow/stacking context, so it inherits clipping and its position math is relative to a scrolled/transformed ancestor rather than the viewport.
- **Fix / resolution:** MUI's default is `disablePortal={false}` (portal to body) precisely to avoid this; the tracked fixes and docs steer users back to portaling unless they truly need in-place DOM. See the multi-tooltip repositioning report (#40276) and the container/disablePortal interaction (#17088).
- **Link(s):** https://github.com/mui/material-ui/issues/40276 , https://github.com/mui/material-ui/issues/17088 , https://github.com/mui/material-ui/issues/9351
- **Relevance to sukuna-ui:** Portal-by-default for all floating elements; treat a no-portal / in-place mode as an escape hatch with a documented warning that ancestor `overflow`/`transform` will clip and mis-anchor it.

#### Next.js App Router hydration mismatch with MUI in `loading.tsx` / Suspense
- **Category:** SSR / hydration
- **Problem:** Rendering MUI components inside App Router files like `loading.tsx` (Suspense boundaries) throws hydration mismatch errors — but only on a direct/hard load, not on client navigation.
- **Root cause:** Emotion's style insertion and server/client render sequencing differ inside Suspense boundaries under the App Router, so server and client markup/class order diverge.
- **Fix / resolution:** Use the official `@mui/material-nextjs` integration (`AppRouterCacheProvider`) to control Emotion cache and insertion; MUI improved App Router support over the v5→v6 line. Umbrella tracking in #34905.
- **Link(s):** https://github.com/mui/material-ui/issues/37892 , https://github.com/mui/material-ui/issues/34905
- **Relevance to sukuna-ui:** sukuna-ui's SSR-mandatory rule already avoids the biggest class of this by having zero runtime CSS-in-JS (Tailwind utilities are static) — a strong structural advantage; keep it, and audit any Suspense/streaming boundaries for stateful `'use client'` components.

#### Hydration mismatch from `useId` under the App Router
- **Category:** SSR / hydration
- **Problem:** IDs generated with React's `useId` differ between server and client (e.g. `:R1mcq:` vs `:R6pj9:`), producing hydration warnings when the id is used in an attribute (`for`, `aria-controls`, etc.).
- **Root cause:** ID counters get out of sync when the server and client component trees don't match exactly (extra/removed wrappers, conditional rendering, mixed React versions), so `useId`'s deterministic sequence diverges.
- **Fix / resolution:** Keep server and client trees identical; never branch rendering on `typeof window`; ensure a single React version. Tracked upstream in Next.js #53110.
- **Link(s):** https://github.com/vercel/next.js/issues/53110
- **Relevance to sukuna-ui:** Components that wire label↔control with generated ids (accessible inputs, comboboxes) must use `useId` and render identical trees on both passes — no `window`/`document` reads outside `useEffect`/handlers, exactly as the CLAUDE.md non-negotiable states.

#### Emotion cache insertion-order hydration mismatch (different CSS hashes)
- **Category:** SSR / hydration
- **Problem:** On hard refresh, components render with default styles and a className hash mismatch (server `css-sppx0e` vs client `css-e1igr2`); theme overrides get dropped until a client re-render.
- **Root cause:** Emotion generates class names from style *insertion order*; if server and client insert styles in a different sequence (aggravated by certain Emotion/Next/Turbopack version combos) the deterministic hashes diverge, breaking hydration.
- **Fix / resolution:** Pin compatible Emotion versions and use MUI's Next.js cache provider so insertion order is deterministic across SSR and hydration; tracked in MUI #43045 and Emotion #3308/#3222.
- **Link(s):** https://github.com/mui/material-ui/issues/43045 , https://github.com/emotion-js/emotion/issues/3308
- **Relevance to sukuna-ui:** This is the canonical reason sukuna-ui bans runtime CSS-in-JS — static Tailwind classes have no insertion-order hashing to desync, so hydration is hash-stable by construction. A concrete argument to keep the "zero runtime styling" rule.

#### Autocomplete is slow with tens of thousands of options even with filtering
- **Category:** Performance with large data
- **Problem:** Opening the listbox with tens of thousands to ~1M options takes >1s; typing/deleting stutters. Filtering and limiting options doesn't fully help.
- **Root cause:** `useAutocomplete` maps over `groupedOptions` and creates a React element per option before render, and internal filtering iterates the full list, so cost scales with total options rather than visible ones.
- **Fix / resolution:** MUI documents a virtualization recipe (react-window `ListboxComponent`) so only visible rows render; a first-class virtualization/infinite-scroll feature is tracked for Base UI Autocomplete (#38714). Practical fixes: `filterOptions` with a hard cap, server-side search.
- **Link(s):** https://github.com/mui/material-ui/issues/25417 , https://github.com/mui/material-ui/issues/33487 , https://github.com/mui/material-ui/issues/38714
- **Relevance to sukuna-ui:** sukuna-ui ships a Combobox — bake in an option cap + optional virtualized listbox from the start, and never build the full element list eagerly; measure open latency at 10k+ items in tests.

#### Autocomplete `renderOption` re-renders every option on each keystroke
- **Category:** Performance with large data
- **Problem:** With 500+ options and a custom `renderOption` (especially with a `Checkbox`), expanding or typing re-renders *all* options, causing extreme lag.
- **Root cause:** `renderOption` output isn't memoized per option, so every input change re-creates and re-renders the entire option set instead of only changed rows.
- **Fix / resolution:** MUI hardened the `renderOption` contract (props now carry a stable `key`, encouraging correct memoized custom rows) and documents memoizing the rendered node; virtualization also mitigates. Tracked in #34712 and #42409.
- **Link(s):** https://github.com/mui/material-ui/issues/34712 , https://github.com/mui/material-ui/issues/42409
- **Relevance to sukuna-ui:** If Combobox/Select expose a custom item renderer, make the per-item render pure and memoizable, pass a stable `key`, and avoid recomputing derived props for every item on each keystroke.

#### Select/Menu with many `MenuItem`s is slow to open and close
- **Category:** Performance with large data
- **Problem:** A `Select` (or `Menu`) with a few hundred to a couple thousand items takes 0.5–1s+ to open/close, worse with icons or multi-select.
- **Root cause:** Every `MenuItem` mounts eagerly inside a Popover with transitions and ripple/focus wiring; there is no built-in virtualization, so mount cost scales with item count.
- **Fix / resolution:** Longstanding guidance is to use the native select for huge lists, virtualize the menu, or disable transitions; no built-in virtualization for `Select`.
- **Link(s):** https://github.com/mui/material-ui/issues/17806 , https://github.com/mui/material-ui/issues/11226 , https://github.com/mui/material-ui/issues/5556
- **Relevance to sukuna-ui:** For sukuna-ui's Select/Menu, either lazy-mount items only while open, cap eager children, or offer a virtualized variant; keep expensive per-item effects (ripple/focus rings) cheap.

#### Base UI focus guards ship `aria-hidden="true"` together with `tabindex="0"` (WCAG 4.1.2)
- **Category:** Accessibility
- **Problem:** When a Select/popup opens, its focus-guard sentinel elements have both `aria-hidden="true"` and `tabindex="0"`, which axe/Evinced flag as a WCAG 4.1.2 violation ("ARIA-hidden elements must not be focusable").
- **Root cause:** Focus guards need to be reachable in tab order to trap focus, but were also marked hidden from assistive tech — a contradictory combination.
- **Fix / resolution:** Direction is to use the `inert` attribute / rework guards so they manage focus without the hidden+focusable contradiction. Related: Modal marks background `aria-hidden` but leaves it tabbable (#4678), and combobox non-modal popups (#5528).
- **Link(s):** https://github.com/mui/base-ui/issues/5706 , https://github.com/mui/base-ui/issues/4678
- **Relevance to sukuna-ui:** sukuna-ui rides Base UI's positioner/focus management directly — track these Base UI a11y fixes and pin to versions where guards use `inert`; add axe/browser tests asserting no `aria-hidden` element is focusable.

#### Dialog/Modal marks background `aria-hidden` but leaves it in the tab order; focus lingers after close
- **Category:** Accessibility
- **Problem:** Opening a modal hides background content from AT with `aria-hidden` yet those buttons/links stay tabbable; and after closing a Dialog/Drawer, focus can remain on an element that is now hidden (browser warns "Blocked aria-hidden on an element because its descendant retained focus").
- **Root cause:** `aria-hidden` doesn't remove elements from sequential focus navigation, and focus isn't reliably returned to the trigger on close.
- **Fix / resolution:** Use the `inert` attribute for backgrounds (removes from both AT tree and tab order) and restore focus to the opener on close. Tracked in #46682 (focus restoration) and base-ui #4678.
- **Link(s):** https://github.com/mui/material-ui/issues/46682 , https://github.com/mui/base-ui/issues/4678
- **Relevance to sukuna-ui:** Ensure Dialog/Drawer use `inert` on the rest of the page (not just `aria-hidden`) and always return focus to the trigger — verify in real-browser (`test:browser`) tests, since jsdom won't catch focus/`inert` behavior.

#### Autocomplete `aria-controls` / `aria-activedescendant` were incorrect (ARIA 1.1/1.2)
- **Category:** Accessibility
- **Problem:** The combobox set `aria-controls` incorrectly after the input was populated and had other WAI-ARIA attribute mismatches, failing accessibility tests and confusing screen readers about the active option.
- **Root cause:** The listbox popup id and the input's `aria-controls`/`aria-activedescendant` wiring weren't kept in sync with the ARIA combobox pattern.
- **Fix / resolution:** PR #18142 gave the listbox a consistent `-popup` id suffix and fixed `aria-controls`/`aria-activedescendant`; a follow-up effort (#25365) tracked migrating from ARIA 1.1 to the ARIA 1.2 combobox pattern.
- **Link(s):** https://github.com/mui/material-ui/pull/18142 , https://github.com/mui/material-ui/issues/25365 , https://github.com/mui/material-ui/issues/18133
- **Relevance to sukuna-ui:** Follow the current ARIA 1.2 combobox pattern for Combobox — stable popup id via `useId`, correct `role`/`aria-controls`/`aria-activedescendant`, and test the attribute wiring as options change.

#### Can't reliably set `aria-label` on Autocomplete's underlying input
- **Category:** Accessibility
- **Problem:** Passing `aria-label` to Autocomplete lands on the wrong wrapper (FormControl / InputBase root) instead of the actual `<input>`, and routing it through `inputProps` can break focus behavior — leaving the control unnamed for screen readers.
- **Root cause:** Prop-spreading precedence across the nested TextField → InputBase → input slots didn't forward `aria-label` to the focusable input by default.
- **Fix / resolution:** Documented `slotProps`/`inputProps` routing to place the label on the input; tracked in #42627 and the TextField label-association issue #18132.
- **Link(s):** https://github.com/mui/material-ui/issues/42627 , https://github.com/mui/material-ui/issues/18132
- **Relevance to sukuna-ui:** Because sukuna-ui props "extend the native element," forward `aria-*`/`id`/`aria-label` straight to the real focusable input by default so accessible naming is never swallowed by wrapper slots.

#### Flash of wrong theme (dark/light) before hydration
- **Category:** Theming / dark mode
- **Problem:** With SSR, a manually-toggled color scheme flashes the wrong theme on first paint before React hydrates and applies the stored preference.
- **Root cause:** The saved mode lives in `localStorage` (client-only), so the server can't know it; the correct scheme isn't applied until JS runs, causing a visible flash.
- **Fix / resolution:** MUI's CSS-theme-variables system plus `InitColorSchemeScript` — a tiny inline script in `<head>` that reads the stored mode/system preference and sets `data-mui-color-scheme` on `<html>` *before* first paint. Emerged from the CSS-vars RFC (#27651).
- **Link(s):** https://mui.com/material-ui/customization/dark-mode/ , https://github.com/mui/material-ui/issues/27651
- **Relevance to sukuna-ui:** sukuna-ui is dark-default with tokens as CSS variables — if it ever supports a persisted toggle, ship a blocking inline `<head>` script that sets a `data-*` attribute before paint; system-default dark needs no script (CSS `prefers-color-scheme` handles it) which is the safer default.

#### `@mui/icons-material` barrel imports bloat bundles and slow dev builds
- **Category:** Bundle size / tree-shaking
- **Problem:** Named barrel imports like `import { Delete } from '@mui/icons-material'` pull the entire package into the module graph — thousands of modules — slowing dev/rebuild (icons went ~10s/11,738 modules) and risking bloated bundles when bundlers can't tree-shake through the barrel.
- **Root cause:** Barrel entry files re-export ~10,000 modules; webpack tree-shakes at the module level and must still traverse every re-export, and some bundlers ship them all.
- **Fix / resolution:** Import from deep paths (`@mui/icons-material/Delete`), or use Next.js `optimizePackageImports` (superseded `modularizeImports`) which auto-rewrites barrel imports — benchmarked `@mui/material` 7.1s/2225 → 2.9s/735 modules. Upstream tracking to flatten imports: #35840, #10857, #11281.
- **Link(s):** https://mui.com/material-ui/guides/minimizing-bundle-size/ , https://github.com/mui/material-ui/issues/35840 , https://github.com/mui/material-ui/issues/10857 , https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
- **Relevance to sukuna-ui:** Give sukuna-ui per-component entry points (its three-file `index.tsx` re-export pattern helps) and avoid a single mega-barrel; verify tree-shaking with the `check:pkg` gate and prefer deep imports for any icon set.

#### Next.js + Pigment CSS: hydration mismatch on `<body>` `style` attribute
- **Category:** SSR / hydration
- **Problem:** Using MUI with Pigment CSS in the App Router produces a hydration error over a `style={{}}` attribute injected on `<body>`.
- **Root cause:** Style/CSS-variable injection onto `<body>` differs between the server-rendered HTML and the client's first render, so React sees a `style` attribute mismatch.
- **Fix / resolution:** Tracked in #46189; the general remedy for injected-attribute mismatches is to render the same attributes on server and client (or add them via an inline pre-hydration script rather than during React render).
- **Link(s):** https://github.com/mui/material-ui/issues/46189
- **Relevance to sukuna-ui:** When sukuna-ui writes theme CSS variables or `data-*` onto `<html>`/`<body>`, emit them identically on server and client (or via a pre-paint script), so hydration never diffs a top-level `style`/attribute.


### Radix UI & Base UI

Real, verified bugs and their fixes/status across **Radix UI** (github.com/radix-ui/primitives) and **Base UI** (`@base-ui-components/react`, github.com/mui/base-ui), the two headless-primitive libraries most relevant to sukuna-ui. Since sukuna-ui is built directly on Base UI, Base UI findings are prioritized. Every finding below carries a real issue/PR number, a URL, and the version/status where it could be verified. The recurring theme most relevant to the team's recent work is the **Positioner-vs-Popup z-index / stacking-context** class of bug (Base UI's `Positioner` is the element portalled to `<body>` and Floating UI applies a `transform` to it, creating a stacking context — so z-index must live on the Positioner, not the inner Popup). Focus/`inert` management and SSR/hydration foot-guns round out the set. Findings labeled by library.

---

#### Base UI Combobox dropdown unusable inside a Radix Dialog (stacking/focus)  (Base UI)
- **Category:** Portal / positioner / stacking (z-index)
- **Problem:** A Base UI Combobox placed inside a Radix Dialog shows its dropdown visually in front of the dialog, but no items can be selected (clicks/interaction blocked).
- **Root cause:** Cross-library stacking + focus-scope conflict: Base UI portals its `Positioner` (fixed-position, Floating-UI transform → its own stacking context) while Radix Dialog owns a focus scope + high-z overlay; the two portals fight over paint order and pointer/focus capture.
- **Fix / resolution:** Closed as an `external dependency` / support question (mixing two libraries). Practical guidance: keep the popup library and the modal library the same, and put z-index on the Positioner.
- **Link(s):** https://github.com/mui/base-ui/issues/2854
- **Relevance to sukuna-ui:** Exactly the failure mode the team just fixed by moving z-index onto the Positioner; sukuna-ui composes Combobox/Select inside its own Dialog/Drawer, so keep both from the same Base UI stack and never nest across libraries.

#### z-index must sit on Base UI `Positioner`, not the inner Popup (Base UI)
- **Category:** Portal / positioner / stacking (z-index)
- **Problem:** Setting `z-50` (or any z-index) on `Select.Popup` / `Menu.Popup` / `Popover.Popup` doesn't lift the popup above a modal — the popup still renders behind dialogs/backdrops.
- **Root cause:** The element actually portalled to `<body>` is the `Positioner`. Floating UI applies a `transform` to it (and Base UI marks it with isolation), creating a new stacking context; a z-index on the *inner* Popup is only compared against its siblings inside that context, never against the page's modal layer.
- **Fix / resolution:** Documented pattern (reinforced across Base UI issues/discussions and shadcn Base UI guidance): apply z-index to `*.Positioner`. Confirmed as the correct mental model in the stacking discussion below.
- **Link(s):** https://github.com/mui/base-ui/issues/2854 ; https://base-ui.com/react/components/popover
- **Relevance to sukuna-ui:** This is the precise rule behind the team's recent fix (commit b5411f4 "dropdowns render above dialogs/drawers — z-index on positioner"). Every sukuna popup wrapper (Select/Menu/Combobox/Tooltip/Popover) must set the stacking token on the Positioner element.

#### Modal Dialog uses `aria-hidden` on the background but not `inert` (Base UI)
- **Category:** Focus management / accessibility
- **Problem:** When a modal Dialog opens, background elements get `aria-hidden="true"` but remain in the sequential tab order, so Tab can move focus into hidden background content (axe `aria_hidden_nontabbable` / focus escapes the modal).
- **Root cause:** `aria-hidden` only removes nodes from the a11y tree, not from focus order; the focus manager did not additionally neutralize tabindex on hidden descendants. The `inert` attribute would remove both, but Base UI's own focus-guard sentinels must be excluded (making them inert breaks focus trapping).
- **Fix / resolution:** Addressed by porting `aria-hidden`'s `inertOthers` behavior (focusable descendants of hidden subtrees get `tabindex="-1"`, restored on cleanup), which also fixes the combobox variant (#5528). Tracked open→fixed via the markOthers work.
- **Link(s):** https://github.com/mui/base-ui/issues/4678 ; https://github.com/mui/base-ui/issues/5528
- **Relevance to sukuna-ui:** sukuna-ui Dialog/Drawer are modal surfaces; verify background truly becomes non-tabbable (not just aria-hidden) on the Base UI version pinned, or a11y audits will flag focus escaping the modal.

#### Select `FocusGuard` renders `aria-hidden="true"` + `tabindex="0"` (Base UI)
- **Category:** Accessibility
- **Problem:** When the Select dropdown opens, its focus-guard sentinel has both `aria-hidden="true"` and `tabindex="0"`, tripping WCAG 4.1.2 scanners ("ARIA hidden element must not be focusable").
- **Root cause:** Focus guards are intentionally focusable (to bounce focus back into the popup) yet hidden from AT — a combination automated scanners always flag.
- **Fix / resolution:** **Closed as "expected behavior" / not planned** (v1.6.0). Maintainers consider the guard sentinels intentional; the reporter suggested `inert` as mitigation.
- **Link(s):** https://github.com/mui/base-ui/issues/5706
- **Relevance to sukuna-ui:** If sukuna-ui runs axe/Evinced in CI against Select/Menu, expect this "violation" and decide whether to suppress it on the guard nodes — it is a known upstream false-positive-by-design, not a sukuna bug.

#### Toast sets `aria-hidden` on a focusable element at high priority (Base UI)
- **Category:** Accessibility
- **Problem:** A toast raised with `priority="high"` is focusable but `aria-hidden`; a keyboard user can Tab onto it and a screen reader won't describe it (axe `aria-hidden-focus`, serious).
- **Root cause:** Base UI renders sibling live regions carrying the toast text, and the visible toast node was hidden from AT while still tabbable — plus the polite/assertive announcement paths duplicated text.
- **Fix / resolution:** Refactored in **PR #5731** — status-priority (polite) toasts now announce only the rendered `Toast.Title`/`Toast.Description`, matching assertive behavior, removing duplicate announcements and the hidden-but-focusable node.
- **Link(s):** https://github.com/mui/base-ui/issues/5659 ; https://github.com/mui/base-ui/pull/5731
- **Relevance to sukuna-ui:** sukuna-ui ships Toast; pin a Base UI version that includes the live-region refactor, and don't add your own extra `aria-live` region (double announcements).

#### Radio/Checkbox/Switch get no accessible name from a wrapping `<label>` (Base UI)
- **Category:** Accessibility
- **Problem:** Wrapping `Radio.Root` / `Checkbox.Root` / `Switch.Root` in a native `<label>` does not name the control; axe reports `aria-toggle-field-name` (no accessible name).
- **Root cause:** These render as `<span role="radio|checkbox|switch">` (not labelable form controls, so implicit label association doesn't apply), and the paired hidden `<input>` is `aria-hidden="true"` so it can't carry the association either. Regressed when they changed from `button` to `span` (~v1.2.0).
- **Fix / resolution:** Closed with **PR #4142**; documented workaround is a `useId()` + explicit `aria-labelledby` on the control (has-workaround label).
- **Link(s):** https://github.com/mui/base-ui/issues/4122
- **Relevance to sukuna-ui:** sukuna-ui RadioGroup (and any Checkbox/Switch) must wire an explicit `aria-labelledby`/`id` between label and control rather than relying on `<label>` wrapping — otherwise the a11y suite fails.

#### Combobox disabled `Trigger` omits native `disabled` during SSR → hydration mismatch (Base UI)
- **Category:** SSR / hydration
- **Problem:** A disabled `Combobox.Trigger` renders `<button data-disabled="">` on the server but `<button data-disabled="" disabled>` on the client, producing a React hydration warning.
- **Root cause:** The native `disabled` attribute is applied client-side only; server render emits only the `data-disabled` state attribute.
- **Fix / resolution:** **Open** as of report (v1.8.0, "waiting for maintainer"); reproduced under TanStack Start SSR + React 19.
- **Link(s):** https://github.com/mui/base-ui/issues/5726
- **Relevance to sukuna-ui:** sukuna-ui is SSR-first and uses Combobox (Autocomplete); a disabled trigger can throw a hydration warning — watch for a fixed release, or avoid rendering the trigger disabled on first paint.

#### Controlled Select won't clear when `value` set to `null` (Base UI)
- **Category:** Controlled vs uncontrolled state
- **Problem:** With a controlled Select (`value` + `onValueChange`), non-null updates work, but setting `value={null}` does not deselect — the previously chosen item stays shown instead of the placeholder.
- **Root cause:** Null was not treated as a real controlled update, so the internal selected state persisted.
- **Fix / resolution:** **Closed** with **PR #1596 / #1561** (had-workaround; affected 1.0.0-alpha.6).
- **Link(s):** https://github.com/mui/base-ui/issues/1556
- **Relevance to sukuna-ui:** sukuna-ui Select controlled wrapper must let consumers reset to placeholder via `null`; ensure the pinned Base UI version includes the fix and add a test for the reset-to-null path.

#### Tabs `onValueChange` doesn't fire for the auto-selected first tab (Base UI)
- **Category:** Controlled vs uncontrolled state
- **Problem:** With no `value`/`defaultValue`, Tabs auto-selects the first tab but never calls `onValueChange`, so consumers relying on that callback for the initial selection get nothing on mount.
- **Root cause:** The internal default selection isn't treated as a value change (no user interaction), so the callback path is skipped.
- **Fix / resolution:** **Closed via PR #4704** (affected 1.0.0-beta.0).
- **Link(s):** https://github.com/mui/base-ui/issues/2097
- **Relevance to sukuna-ui:** sukuna-ui Tabs consumers who sync tab state from `onValueChange` should set an explicit `defaultValue`, or confirm the pinned version fires the initial callback.

#### Menu `modal={false}` still traps focus on Shift+Tab (Base UI)
- **Category:** Focus management
- **Problem:** `Menu` with `modal={false}` (docs say the rest of the document stays interactive) still traps focus backward: Shift+Tab cycles between menu items and trigger instead of escaping, unlike Dialog's `modal={false}`.
- **Root cause:** The Menu focus trap isn't fully disabled in the backward direction under non-modal mode (Floating UI focus-manager behavior).
- **Fix / resolution:** Treated as a regression; fix landed via **floating-ui/floating-ui#3334** (marked recently completed). Request to add a `modal="trap-focus"` middle option also raised.
- **Link(s):** https://github.com/mui/base-ui/issues/1997
- **Relevance to sukuna-ui:** sukuna-ui Menu/dropdowns that opt into non-modal behavior should verify Shift+Tab actually leaves the menu on the pinned version.

#### Breaking rename: `openMultiple`/`toggleMultiple` → `multiple` (Base UI)
- **Category:** Base UI migration / prop rename
- **Problem:** Inconsistent multi-select prop names across Accordion (`openMultiple`), Toggle group (`toggleMultiple`), and Select led to a breaking rename to a single `multiple` prop.
- **Root cause:** API-consistency cleanup tracked in the naming discussion (#1075); shipped as breaking change **#2764**.
- **Fix / resolution:** Renamed to `multiple` (release notes: "openMultiple + toggleMultiple were renamed to multiple"). Consumers on older Base UI break on upgrade.
- **Link(s):** https://github.com/mui/base-ui/issues/1075 ; https://github.com/mui/base-ui/blob/master/CHANGELOG.md
- **Relevance to sukuna-ui:** sukuna-ui Accordion/Select/Toggle wrappers must use `multiple` (not the old names) and treat any Base UI bump crossing this rename as a major per sukuna's breaking-change table (remove/rename a prop = major / breaking on 0.x).

#### Popover `onOpenChange` behavior/signature changed between versions (Base UI)
- **Category:** Controlled vs uncontrolled state
- **Problem:** `onOpenChange` semantics changed between Base UI releases (when/how it fires and its event details), breaking controlled Popover wrappers on upgrade.
- **Root cause:** API evolution of the popup open/close event model (reason/event-details payload); related work added `preventUnmountOnClose()` / `actionsRef` unmount opt-out for controlled close animations.
- **Fix / resolution:** Tracked in #1744; unmount/close-control documented in **PR #5735**. Treat as a migration-sensitive API.
- **Link(s):** https://github.com/mui/base-ui/issues/1744 ; https://github.com/mui/base-ui/pull/5735
- **Relevance to sukuna-ui:** sukuna-ui Tooltip/Popover/Menu wrappers that are controlled must follow the current `onOpenChange` contract (and use `preventUnmountOnClose()` if they animate close) — re-check on every Base UI bump.

#### z-index chaos: `Dialog.Portal` sets no z-index, Popover/Dropdown use max z-index (Radix)
- **Category:** Portal / positioner / stacking (z-index)
- **Problem:** Opening a Dialog from a Popover/DropdownMenu renders the dropdown *above* the dialog overlay (confirmation dialog appears behind the still-open dropdown list).
- **Root cause:** `Dialog.Portal` sets no z-index, while Popover/DropdownMenu portals historically shipped `z-index: 2147483647`, so the older popups win paint order.
- **Fix / resolution:** **Closed without a documented code fix**; the accepted approach is to render each part in its own `*.Portal` (natural body order) and manage z-index yourself. Widely referenced community issue.
- **Link(s):** https://github.com/radix-ui/primitives/issues/1317 ; https://github.com/radix-ui/primitives/issues/2773
- **Relevance to sukuna-ui:** Confirms the general lesson behind sukuna's fix — a portalled popup's z-index/stacking must be owned deliberately; don't assume portal order alone layers modals + popups correctly.

#### DropdownMenu scroll jumps to top when a parent has `transform` (Radix)
- **Category:** Portal / positioner / stacking (z-index)
- **Problem:** If any ancestor has a CSS `transform`, opening a DropdownMenu jumps the page scroll to the top and the menu renders off-screen (persists even with `modal`).
- **Root cause:** `transform` on an ancestor creates a new containing block/stacking context that breaks the positioning + scroll math; the menu computed its position relative to the transformed parent.
- **Fix / resolution:** **Closed via PR #2762**; workaround is wrapping in `DropdownMenu.Portal` to escape the transformed ancestor.
- **Link(s):** https://github.com/radix-ui/primitives/issues/2331
- **Relevance to sukuna-ui:** Direct analog of the Floating-UI-transform-creates-a-stacking-context problem on Base UI's Positioner; a transformed ancestor (common with Tailwind `transform`/animation utilities) can break sukuna popup positioning — always portal.

#### Clicks inside a Popover nested in a Dialog dismiss the Popover (Radix)
- **Category:** Portal / positioner / stacking (z-index) + focus/dismiss
- **Problem:** Nesting a Popover inside a Dialog makes clicks *inside* the Popover count as "outside" interactions, closing it.
- **Root cause:** Portal/dismissable-layer nesting: the Popover content is portalled outside the Dialog's layer, so the Dialog's outside-click detection treats Popover clicks as outside.
- **Fix / resolution:** **Closed**; workaround is `modal` on the Popover (which then over-blocks outside content). Also commonly caused by mismatched `@radix-ui/react-dismissable-layer`/`react-focus-scope` versions — dedupe with package overrides.
- **Link(s):** https://github.com/radix-ui/primitives/issues/2121
- **Relevance to sukuna-ui:** sukuna-ui composes popups inside Dialog/Drawer; ensure dismissable-layer nesting is coherent (single Base UI version, no duplicate copies) so inner-popup clicks aren't misread as outside dismissals.

#### `useId` hydration mismatch on `id`/`aria-controls`, especially via `Slot`/`asChild` (Radix)
- **Category:** SSR / hydration
- **Problem:** Components generating `id`/`aria-controls` via React `useId` throw hydration errors (server id ≠ client id), frequently when the `Slot` (`asChild`) pattern is involved; also seen with React 19 canary + Next.js App Router.
- **Root cause:** Id generation/order desync across the server↔client boundary (compounded by Slot merging props onto a child and by browser extensions mutating HTML pre-hydration).
- **Fix / resolution:** **Closed** (#3700); related historical fixes for `useId` under React <18 and multiple bundles (#2576, #1684). Recommended: single React copy, matching versions, avoid extension interference.
- **Link(s):** https://github.com/radix-ui/primitives/issues/3700 ; https://github.com/radix-ui/primitives/issues/2576
- **Relevance to sukuna-ui:** sukuna-ui is SSR-mandatory; any wrapper that generates ids for aria wiring must use React `useId` (never `Math.random()`/counters) and keep a single React instance to avoid hydration mismatches.

#### Select scroll jumps to the selected item at list start/end with scroll buttons (Radix)
- **Category:** Focus management / scroll
- **Problem:** With `Select.ScrollUpButton`/`ScrollDownButton` present, reaching the start or end of the list makes the scroll jump back to the selected item; related bugs: adding items after render jumps scroll, and opening a Select in a sticky header scrolls the page up.
- **Root cause:** The `scrollIntoView`/position-tracking logic for the selected item re-fires during scroll-button interaction and on list content changes.
- **Fix / resolution:** Cluster of scroll bugs (#3686 reported Sep 2025; #2440 add-items-after-render; #2369 sticky-header). Some addressed in releases (e.g., shadow-DOM touch-scroll close fix); #3686 among the more recent.
- **Link(s):** https://github.com/radix-ui/primitives/issues/3686 ; https://github.com/radix-ui/primitives/issues/2440 ; https://github.com/radix-ui/primitives/issues/2369
- **Relevance to sukuna-ui:** sukuna-ui Select/Combobox with long lists should watch for scroll-anchoring jank when items load async or scroll buttons are used — add tests for dynamic-list scroll stability.

#### Toast not announced to screen readers because `aria-live="off"` (Radix)
- **Category:** Accessibility
- **Problem:** Toasts weren't announced because the `role="status"` region carried `aria-live="off"`, so AT never detected new toasts.
- **Root cause:** The intended dynamic `aria-live` value (polite for status, assertive for alerts) was effectively overridden to `off` in the rendered output; even the reporter couldn't find the source in the toast source.
- **Fix / resolution:** **Closed** (July 2025); expected behavior is polite/assertive chosen by toast type.
- **Link(s):** https://github.com/radix-ui/primitives/issues/3634
- **Relevance to sukuna-ui:** sukuna-ui Toast must emit a real `aria-live` (`polite`/`assertive`), never `off`; add a test asserting the live region's value so a regression like this is caught.


### Chakra UI, Mantine & Ant Design

Research into real, documented issues and fixes across three mature React component libraries — Chakra UI, Mantine, and Ant Design — with an eye toward what sukuna-ui can learn. The strongest lessons cluster around stacking/z-index of portalled overlays (all three libraries converged on the idea of a monotonic z-index scale, and Ant Design went further with a context-propagated z-index for nested popups), performance of large data widgets (virtualization via rc-virtual-list / useVirtualizedCombobox), SSR/hydration of styles (Ant Design's cssinjs extraction, Chakra/Mantine color-mode flash), and the large breaking migrations that were driven by runtime-CSS pain (Ant Design v4→v5 to CSS-in-JS, Chakra v2→v3 to CSS variables + next-themes, Mantine v6→v7 dropping Emotion for native CSS). Each finding below is a real issue/PR/changelog/doc entry with a link.

#### Chakra's default z-index token scale (dropdown < … < toast < tooltip)  (Chakra)
- **Category:** z-index / portal / stacking
- **Problem:** Overlay components rendered through portals need a predictable, documented stacking order so a tooltip never hides behind a modal, and a modal overlay never covers a toast.
- **Root cause:** Portalled elements escape their parent's stacking context, so raw source order can't determine what's on top; a shared, named scale is needed.
- **Fix / resolution:** Chakra ships a `zIndices` token scale in the default theme: `hide: -1`, `base: 0`, `docked: 10`, `dropdown: 1000`, `sticky: 1100`, `banner: 1200`, `overlay: 1300`, `modal: 1400`, `popover: 1500`, `skipLink: 1600`, `toast: 1700`, `tooltip: 1800`. Monotonic and semantic; overridable via theme.
- **Link(s):** https://next.chakra-ui.com/docs/theming/z-index , https://v1.chakra-ui.com/docs/styled-system/theming/theme
- **Relevance to sukuna-ui:** Direct confirmation of sukuna's approach — Chakra also puts tooltip at the very top and toast just below it; sukuna's ordering (dialog 50 < popover 60 < toast 70 < tooltip 80) matches Chakra's relative order (overlay/modal < popover < toast < tooltip).

#### Community pushback on Chakra's fixed default z-indexes  (Chakra)
- **Category:** z-index / portal / stacking
- **Problem:** Chakra's large default z-index values (1000–1800) collide with app-level or third-party z-indexes, and some users argued components shouldn't ship hard-coded z-indexes at all.
- **Root cause:** Absolute numeric defaults are opinionated; an app with its own high z-index sticky header can end up above a modal overlay, or vice-versa.
- **Fix / resolution:** Maintainers kept the scale but made it fully theme-overridable (the whole point of tokenizing it); discussion documents the trade-off rather than removing defaults.
- **Link(s):** https://github.com/chakra-ui/chakra-ui/issues/801
- **Relevance to sukuna-ui:** Argues for keeping sukuna's scale as overridable tokens (`--sk-*`), and for documenting that app code must stay below the dialog floor — a low, dense scale (50/60/70/80) is easier to coexist with than 1000+.

#### Tooltip/Popover hidden behind Modal because portals carry no z-index  (Chakra)
- **Category:** z-index / portal / stacking
- **Problem:** A Tooltip used inside a Modal body doesn't appear — it renders into a portal with no z-index and ends up behind the modal content.
- **Root cause:** Tooltips are portalled to `body` but weren't assigned a z-index from the scale, so the modal (z 1400) painted over them; overriding tooltip z-index inside a modal was awkward.
- **Fix / resolution:** Chakra assigns portalled overlays their scale token (tooltip 1800 > modal 1400) so tooltips win; users can still override per-instance. Documented across issues #249, #1604 and discussion #5238.
- **Link(s):** https://github.com/chakra-ui/chakra-ui/issues/249 , https://github.com/chakra-ui/chakra-ui/issues/1604 , https://github.com/chakra-ui/chakra-ui/discussions/5238
- **Relevance to sukuna-ui:** Every portalled sukuna overlay must actually receive its scale value on the positioner/content, or the scale is theoretical — this is the concrete failure mode to test (tooltip inside dialog).

#### Ant Design's z-index was "unreasonable": Dropdown above Modal  (Ant Design)
- **Category:** z-index / portal / stacking
- **Problem:** Dropdown (z 1050) sat above Modal (z 1000), so a fixed header raised to cover a dropdown would then cover the modal overlay — no z-index value satisfied both cases.
- **Root cause:** Component z-indexes weren't ordered by semantic layering; dropdown outranked modal, which is backwards for the common "dropdown should sit under the modal mask, but a dropdown opened inside the modal should sit above it" expectation.
- **Fix / resolution:** Triaged as needing repro at the time; the real structural fix came later via the zIndex context system (see next finding), which computes nested z-index relative to the container.
- **Link(s):** https://github.com/ant-design/ant-design/issues/17484
- **Relevance to sukuna-ui:** A single flat scale can't express "same component type, different nesting depth." Worth deciding early whether sukuna needs container-relative bumping for popovers-inside-dialogs.

#### Ant Design zIndexContext for nested popups  (Ant Design)
- **Category:** z-index / portal / stacking
- **Problem:** Popups nested inside other popups (Select inside Modal, Dropdown inside Drawer, image preview inside a nested modal) rendered with wrong stacking because each component used a global base z-index unaware of its container.
- **Root cause:** Each popup computed z-index from a global constant; there was no propagation of "you are inside a container at z N, so start above N."
- **Fix / resolution:** Introduced a `useZIndex` hook + `zIndexContext` provider so containers pass down a base and nested popups add an offset. Landed across a PR series by kiner-tang in v5.7+: #45346 (Modal & Select), #45486 (Dropdown), #45494 (SelectLike), #45498 (Menu), #45512 (RFC container support), plus fixes #45864 / #45979. RFC discussion #45154.
- **Link(s):** https://github.com/ant-design/ant-design/discussions/45154 , https://github.com/ant-design/ant-design/pull/45346 , https://github.com/ant-design/ant-design/pull/45512
- **Relevance to sukuna-ui:** This is the state-of-the-art answer to nested-popup stacking. If sukuna keeps a flat monotonic scale, note this as the escalation path when a popover-in-dialog needs to beat the dialog it lives in.

#### Mantine v5 stopped portalling dropdowns by default; z-index stacking proposal  (Mantine)
- **Category:** z-index / portal / stacking
- **Problem:** After v5, Tooltip/Popover/Select/DatePicker no longer used a Portal by default and Portal dropped its `position`/`zIndex` props, so dropdowns inside modals were clipped or mis-stacked unless users manually set `withinPortal` and z-index.
- **Root cause:** Rendering in-place avoids portal issues but reintroduces overflow clipping inside modals; rendering in a portal fixes clipping but needs an explicit z-index above the modal.
- **Fix / resolution:** Documented `withinPortal` opt-in; community proposal #6554 suggests a `--mantine-current-z-index` CSS variable stack so an opened Popover reads its target's z-index and adds its own — essentially Mantine's take on Ant Design's context approach.
- **Link(s):** https://github.com/orgs/mantinedev/discussions/6554 , https://mantine.dev/core/portal/
- **Relevance to sukuna-ui:** Reinforces choosing "portal + explicit scale z-index" over "render in place." The recurring bug is dropdown-clipped-by-modal; sukuna should default portalled overlays to the scale, not to in-place rendering.

#### Mantine Select dropdown clipped / rendered under Modal  (Mantine)
- **Category:** z-index / portal / stacking
- **Problem:** Select/Menu dropdowns opened inside a Modal were cut off to the modal's box, or rendered underneath the modal entirely; setting a z-index still left them clipped by the modal's overflow.
- **Root cause:** Dropdown rendered inside the modal's DOM subtree (which has overflow + its own stacking context), so no z-index could lift it out of the modal's bounding box.
- **Fix / resolution:** Guidance to enable `withinPortal` so the dropdown escapes the modal's overflow context; long-running issues #448, #468, #3503, #4316 track the friction across versions.
- **Link(s):** https://github.com/mantinedev/mantine/issues/4316 , https://github.com/mantinedev/mantine/issues/3503
- **Relevance to sukuna-ui:** Overflow clipping, not just z-index, breaks in-modal dropdowns — sukuna's Combobox/Select/Dropdown popovers should portal out of the Dialog by default and rely on the scale for ordering.

#### Ant Design Table performance collapses on large datasets  (Ant Design)
- **Category:** Performance with large data
- **Problem:** Tables rendering thousands of rows become slow/unresponsive; checkbox selection and scrolling freeze even with virtualization once dataset + scroll height are large.
- **Root cause:** Rendering every row (and every cell's CSS-in-JS + selection state) produces huge DOM and re-render cost; virtual scroll helps but selection state fan-out still degrades.
- **Fix / resolution:** Shipped a virtual Table (rc-virtual-list) rendering only visible rows, announced on the blog; RFC #41500 proposed a StaticTable for faster perf; issue #50343 documents remaining unresponsiveness with very large scroll Y.
- **Link(s):** https://ant.design/docs/blog/virtual-table/ , https://github.com/ant-design/ant-design/issues/50343 , https://github.com/ant-design/ant-design/discussions/41500
- **Relevance to sukuna-ui:** sukuna's Table should design for virtualization from the start (window only visible rows) and keep row selection cheap (avoid per-row context re-renders), or it will hit the same wall.

#### Mantine Select/Autocomplete needs virtualization for large option lists  (Mantine)
- **Category:** Performance with large data
- **Problem:** Rendering 10k–100k options in a Select/Autocomplete/MultiSelect is slow; users requested built-in virtualization.
- **Root cause:** The built-in components render all filtered options into the DOM; without windowing, large lists thrash.
- **Fix / resolution:** Two-pronged: a `limit` prop caps how many options render at once, and for true windowing the `useVirtualizedCombobox` hook builds a virtualized options list on top of the headless Combobox. Tracked in issue #4300.
- **Link(s):** https://github.com/mantinedev/mantine/issues/4300 , https://mantine.dev/core/combobox/
- **Relevance to sukuna-ui:** sukuna's Combobox should expose a `limit`-style cap as the cheap default and leave room for a virtualized variant, rather than rendering all matches.

#### Ant Design SSR style extraction to avoid style flash / hydration mismatch  (Ant Design)
- **Category:** SSR / hydration
- **Problem:** With CSS-in-JS (v5), server-rendered pages flashed unstyled content and could throw hydration class mismatches because styles were injected only on the client, and injection order diverged under streaming.
- **Root cause:** Runtime CSS-in-JS generates class names/styles at render; without extracting them into the SSR HTML, first paint is unstyled and client/server class order can differ.
- **Fix / resolution:** `@ant-design/cssinjs` exposes `extractStyle` + a cache; `@ant-design/nextjs-registry` (StyleProvider) makes extraction deterministic. The cache checks the hash path before recomputing so server-generated styles are reused on hydration.
- **Link(s):** https://ant.design/docs/blog/extract-ssr/ , https://ant.design/docs/blog/hydrate-cssinjs/ , https://www.npmjs.com/package/@ant-design/cssinjs
- **Relevance to sukuna-ui:** Strong validation of sukuna's "zero runtime styling / SSR mandatory" rule — sukuna avoids this entire class of bug by emitting static Tailwind utilities instead of runtime CSS-in-JS.

#### Ant Design v4→v5: dropped Less, moved to CSS-in-JS + Seed/Algorithm design tokens  (Ant Design)
- **Category:** Notable breaking migration (theming)
- **Problem:** v4's Less-variable theming couldn't express dynamic runtime themes (dark mode, per-component tokens) and required a build-time Less pipeline; maintaining intermediate CSS-variable layers didn't scale.
- **Root cause:** Less variables are static at build time; there was no algorithm deriving spacing/font/line-height from seeds, only color palettes.
- **Fix / resolution:** v5 removed Less, adopted `@ant-design/cssinjs`, and introduced the Seed → Map → Alias design token model with multiple algorithms (default/dark/compact). `@ant-design/compatible` restores v4 look; issue #41884 tracked per-component token migration.
- **Link(s):** https://5x.ant.design/docs/react/migration-v5/ , https://github.com/ant-design/ant-design/issues/33862 , https://github.com/ant-design/ant-design/issues/41884
- **Relevance to sukuna-ui:** A cautionary tale about runtime CSS-in-JS bringing SSR extraction complexity — but also a model for a layered token system (seed → semantic → component), which sukuna mirrors with `--sk-*` tokens and `docs/tokens.md`.

#### Chakra v2→v3: CSS variables, recipes, and next-themes for color mode  (Chakra)
- **Category:** Notable breaking migration (theming / SSR)
- **Problem:** v2's Emotion-runtime styling and built-in color-mode (`useColorMode`, `ColorModeScript`) carried runtime cost and SSR color-mode flash; `styleConfig`/`multiStyleConfig` were verbose.
- **Root cause:** Runtime styling + a bespoke color-mode manager duplicated what CSS variables and `next-themes` do more cheaply and with better SSR behavior.
- **Fix / resolution:** v3 moves toward CSS variables (Panda/Ark-inspired), replaces styleConfig with recipes/slot recipes, and removes `ColorModeProvider`/`useColorMode`/`ColorModeScript` in favor of `next-themes`. Documented in the migration guide and v3 announcement.
- **Link(s):** https://chakra-ui.com/docs/get-started/migration , https://next.chakra-ui.com/blog/announcing-v3
- **Relevance to sukuna-ui:** Validates sukuna's CSS-variable token strategy and its choice to lean on the platform (Tailwind v4 `@theme`) rather than a runtime theme engine; also shows delegating dark-mode to a class/attribute strategy over a custom manager.

#### Chakra color-mode flash (FOUC) under Next.js SSR  (Chakra)
- **Category:** Theming / dark mode (SSR)
- **Problem:** SSR pages flashed the wrong (light) theme for a frame before hydration applied the saved dark preference.
- **Root cause:** The server can't know the user's stored color preference, so it renders a default and corrects on the client — a visible flash.
- **Fix / resolution:** `ColorModeScript` injected before hydration sets the mode synchronously; a cookie-based `colorModeManager` lets the server read the preference for correct first paint. v3 defers this to `next-themes`. Tracked in #1878, #6192, discussion #8098.
- **Link(s):** https://github.com/chakra-ui/chakra-ui/issues/6192 , https://github.com/chakra-ui/chakra-ui/issues/1878 , https://github.com/chakra-ui/chakra-ui/discussions/8098
- **Relevance to sukuna-ui:** If sukuna supports dark mode via a class/attribute, it needs a pre-hydration inline script (or cookie) to set it, or it will flash the same way — a concrete SSR requirement to document.

#### Mantine v6→v7: dropped Emotion for native CSS files  (Mantine)
- **Category:** Theming / SSR / bundle size (breaking migration)
- **Problem:** v6's Emotion runtime added bundle weight (~23kB for Emotion + runtime), inserted `<style>` at runtime, and didn't play well with the Next.js App Router / RSC.
- **Root cause:** CSS-in-JS generates styles at runtime; the App Router (server components) can't run Emotion's client-time insertion cleanly.
- **Fix / resolution:** v7 ships native `.css` files imported per package (`@mantine/core/styles.css`); no styles injected into `<head>` at runtime. A `@mantine/emotion` compat package eases migration (`createStyles`, `sx`).
- **Link(s):** https://mantine.dev/changelog/7-0-0/ , https://mantine.dev/guides/6x-to-7x/
- **Relevance to sukuna-ui:** Three major libraries independently moved away from runtime CSS-in-JS toward static CSS — strong external validation of sukuna's zero-runtime-styling + Tailwind-utility rule and its RSC/SSR compatibility.

#### Ant Design default palette fails WCAG 4.5:1 contrast  (Ant Design)
- **Category:** Accessibility
- **Problem:** Default theme colors (e.g. text/border/placeholder against background) measured ~3:1 rather than the AA-required 4.5:1 for normal text, hurting low-vision users.
- **Root cause:** The palette's "6th color cell" was designed to meet 4.5:1, but many default component states use lighter cells that fall short.
- **Fix / resolution:** Acknowledged in issue #28760; broader ARIA/landmark gaps raised in #22343 and discussion #55332, where maintainers said fixes would largely come via community PRs rather than a dedicated push.
- **Link(s):** https://github.com/ant-design/ant-design/issues/28760 , https://github.com/ant-design/ant-design/discussions/55332 , https://github.com/ant-design/ant-design/issues/22343
- **Relevance to sukuna-ui:** sukuna should validate its `--sk-*` color tokens against 4.5:1 (text) / 3:1 (UI) at token-definition time in `docs/tokens.md`, not rely on "looks fine" — bake contrast into the token spec.

#### Chakra Drawer/Modal focus-trap set tabindex > 0 (axe violation)  (Chakra)
- **Category:** Accessibility
- **Problem:** Running axe DevTools on a Drawer/Modal flagged "Elements should not have tabindex greater than zero" because the focus-trap container used `tabIndex=1`.
- **Root cause:** Positive tabindex values override natural DOM tab order and are a WCAG anti-pattern; the container should use `tabIndex={-1}` (focusable, not in tab order) or `0`.
- **Fix / resolution:** Reported in issue #4225; correct pattern is `tabIndex={-1}` on the dialog container for programmatic focus without disturbing tab order. Related debate on where initial focus lands (#4927).
- **Link(s):** https://github.com/chakra-ui/chakra-ui/issues/4225 , https://github.com/chakra-ui/chakra-ui/issues/4927
- **Relevance to sukuna-ui:** sukuna's Dialog/Drawer focus management should use `tabIndex={-1}` on the container and send initial focus deliberately (first meaningful control, not always the close button) — cover it in the a11y section of each overlay's tests.

#### Chakra tooltip z-index not overridable when inside a modal  (Chakra)
- **Category:** z-index / portal / stacking
- **Problem:** Users couldn't reliably override a Tooltip's z-index when it lived inside a Modal — the portalled tooltip's stacking didn't respond to per-instance overrides as expected.
- **Root cause:** Portal + fixed scale token meant the override had to be applied to the portalled node, not the trigger; the API surface for this was unclear.
- **Fix / resolution:** Discussion #5238 documents applying z-index to the tooltip's portal/content and using the scale (tooltip 1800) so it beats the modal; clarified as an API/usage issue rather than a stacking-scale bug.
- **Link(s):** https://github.com/chakra-ui/chakra-ui/discussions/5238
- **Relevance to sukuna-ui:** When sukuna exposes a z-index override, it must apply to the portalled positioner/content node, and the docs should say so — otherwise users override the wrong element and the scale appears broken.


---

## Part II — First-party audit of sukuna-ui

Measured findings against the current codebase (dark-default, Tailwind v4, Base UI). Contrast ratios are computed (WCAG 2.1 sRGB relative luminance, alpha-composited); performance numbers are real SSR + browser measurements. File:line references point into `src/`.

### Internal audit — Accessibility & contrast

**Summary:** This audit found **1 Critical and 5 High** severity issues, plus 4 Medium and 3 Low. The rigorous WCAG 2.1 contrast pass (Bun script, sRGB relative-luminance, alpha compositing over solid backgrounds) confirms the two worst offenders are systemic tokens: **`text-faint` fails normal-text AA (4.5:1) in *both* themes** on every background (dark 3.48/3.24/2.99; light 3.39/3.57/3.11) yet it is the color for Input/Select/Combobox **placeholders**, Breadcrumbs separators, Pagination ellipsis and inactive Stepper labels — essential text. The **focus ring** (`accent-glow`, a 0.6/0.35-alpha "glow") fails the 3:1 non-text-contrast bar against adjacent surfaces in both themes (dark ~2.6:1, light ~1.7:1), and it is the *sole* focus indicator on Button, Slider, Chip, and all Close buttons. In the **light theme only**, `premium` (3.99/4.20), `premium-dim` (2.68/2.82) and `success` (3.27/3.45) all fail as text (used by Badge/Chip/Alert/Text), and the **Button primary label** (`text` over the crimson gradient) is 3.11:1 dark / 3.73:1 light — below 4.5:1. Finally, **no component honors `prefers-reduced-motion`** (0 matches for `motion-reduce`/`prefers-reduced-motion` across `src/`) despite spinners, skeletons, pulses and transform transitions. The z-index/stacking bug (dropdowns behind dialogs) is already **resolved** in `src/tokens.ts` (monotonic `dialog<popover<toast<tooltip`) — not re-reported.

#### Full contrast results (computed, ratios to 2 dp)

Threshold: 4.5:1 normal text, 3:1 large text / non-text UI.

| FG | BG | Threshold | Dark | Light | Dark | Light |
|---|---|---|---|---|---|---|
| text | bg | 4.5 | 17.57 | 17.50 | PASS | PASS |
| text | surface | 4.5 | 16.33 | 18.43 | PASS | PASS |
| text | surface-2 | 4.5 | 15.08 | 16.03 | PASS | PASS |
| text | well | 4.5 | 18.64 | 14.64 | PASS | PASS |
| text-dim | bg | 4.5 | 6.57 | 6.51 | PASS | PASS |
| text-dim | surface | 4.5 | 6.11 | 6.86 | PASS | PASS |
| text-dim | surface-2 | 4.5 | 5.64 | 5.97 | PASS | PASS |
| **text-faint** | **bg** | 4.5 | **3.48** | **3.39** | **FAIL** | **FAIL** |
| **text-faint** | **surface** | 4.5 | **3.24** | **3.57** | **FAIL** | **FAIL** |
| **text-faint** | **surface-2** | 4.5 | **2.99** | **3.11** | **FAIL** | **FAIL** |
| accent | bg | 4.5 | 5.64 | 4.70 | PASS | PASS |
| accent | surface | 4.5 | 5.25 | 4.95 | PASS | PASS |
| accent (as UI) | bg | 3.0 | 5.64 | 4.70 | PASS | PASS |
| accent (as UI) | surface | 3.0 | 5.25 | 4.95 | PASS | PASS |
| **accent-deep** | **bg** | 4.5 | **2.78** | 8.12 | **FAIL** | PASS |
| **accent-deep** | **surface** | 4.5 | **2.59** | 8.56 | **FAIL** | PASS |
| premium | bg | 4.5 | 14.57 | **3.99** | PASS | **FAIL** |
| premium | surface | 4.5 | 13.55 | **4.20** | PASS | **FAIL** |
| premium-dim | bg | 4.5 | 8.50 | **2.68** | PASS | **FAIL** |
| premium-dim | surface | 4.5 | 7.90 | **2.82** | PASS | **FAIL** |
| success | bg | 4.5 | 9.10 | **3.27** | PASS | **FAIL** |
| success | surface | 4.5 | 8.46 | **3.45** | PASS | **FAIL** |
| success (as UI) | bg | 3.0 | 9.10 | 3.27 | PASS | PASS |

**Button label on accent:** `text` (#F4F1EC / #141413) on `accent` = **3.11** dark / **3.73** light; white on `accent` = 3.51 dark / 4.95 light; white/text on `accent-deep` = 7.11 / 8.56 (the dark end of the gradient is fine, the light end is not).

**Focus ring (`accent-glow`) composited over `bg`, vs adjacent surfaces (3:1 needed):**

| Theme | ring vs bg | ring vs surface | ring vs surface-2 |
|---|---|---|---|
| Dark | **2.61** | **2.43** | **2.24** |
| Light | **1.74** | **1.84** | **1.60** |

All FAIL 3:1.

---

#### text-faint fails normal-text contrast in both themes (essential placeholder/label text)
- **Severity:** Critical
- **Category:** Contrast
- **Where:** token `text-faint` in `src/tokens.ts:34` (`{ dark:'#6C665D', light:'#8C877D' }`). Consumers: `src/components/input/input.styles.tsx:6` (`placeholder:text-text-faint`), `src/components/select/select.styles.tsx:32` (placeholder), `src/components/combobox/combobox.styles.tsx:6` (placeholder), `src/components/breadcrumbs/breadcrumbs.styles.tsx:9` (separator), `src/components/pagination/pagination.styles.tsx:18` (ellipsis), `src/components/stepper/stepper.logic.tsx:51` (inactive step label/border), `src/components/alert/alert.styles.tsx:12` (info left border), `src/components/text/text.styles.tsx:28` (`faint` variant).
- **Problem:** Ratios 3.48/3.24/2.99 (dark) and 3.39/3.57/3.11 (light) — all below 4.5:1. Placeholder text is content users must read; Select/Combobox placeholders also act as the field's visible value before selection. Fails WCAG 1.4.3.
- **Recommendation:** Lighten `text-faint` dark to roughly `#8B857A`+ (≈4.6:1 on surface) and darken light to ≈`#6E6A61` (≈4.6:1 on surface); re-run the script until every `*-faint`/background pair clears 4.5:1. If the muted look must stay for decorative separators only, keep the dim token for those and stop using `text-faint` for placeholders (use `text-dim`, which passes at 5.6–6.9:1).

#### Focus ring color (accent-glow) fails 3:1 non-text contrast in both themes
- **Severity:** High
- **Category:** Focus
- **Where:** token `accent-glow` `src/tokens.ts:29`. Used as `focus-visible:ring-accent-glow` in button (`button.styles.tsx:8`), slider (`slider.styles.tsx:10`), chip (`chip.styles.tsx:7`), dialog close (`dialog.styles.tsx:24`), drawer close (`drawer.styles.tsx:16`), toast close (`toast.styles.tsx`), plus input/select/combobox/switch/checkbox/radio/tabs/accordion/pagination/breadcrumbs.
- **Problem:** Ring composited over bg = 2.61:1 (dark) / 1.74:1 (light) against bg; even worse against surface-2. Fails WCAG 1.4.11 (non-text contrast) and 2.4.11 focus appearance. For Button/Slider/Chip/Close buttons the ring is the *only* focus indicator (no border/color change), so keyboard focus is barely visible — critical for keyboard users. (Inputs also add `focus-visible:border-accent`, which passes at 5.25:1, so those degrade more gracefully.)
- **Recommendation:** Make the focus ring a solid, high-contrast color. Either raise `accent-glow` alpha to ~1.0 (solid `accent`, which gives 5.6:1 dark / 4.7:1 light ≥3:1) for the *ring* while keeping the soft glow only for `box-shadow` decoration, or add a dedicated `--sk-focus-ring` token at ≥3:1 on all surfaces. Keep the `ring-offset` so the ring reads against both the control and the page.

#### Button primary label contrast on the accent gradient
- **Severity:** High
- **Category:** Contrast
- **Where:** `src/components/button/button.styles.tsx:15-16` — `primary: 'bg-gradient-accent text-text ...'`; gradient `src/tokens.ts:36-39` (`#FF3B4E → #B01221` dark).
- **Problem:** `text` label over the light end of the gradient (`accent`) is 3.11:1 (dark) / 3.73:1 (light) — below 4.5:1 for normal text. Button labels are `text-sm`/`md`/`lg` (12/14/16px) bold; 16px bold is *not* "large" (needs ≥18.66px bold), so 4.5:1 applies. Fails WCAG 1.4.3 across the whole primary Button.
- **Recommendation:** Darken the gradient's light stop (e.g. start at `accent-deep`/#B01221 region) so label contrast ≥4.5:1, or use a lighter label. White-on-accent-deep is 7.11:1; a gradient weighted toward the deep end, or a solid `accent-deep` fill for primary, resolves it. Verify with the script after changing the stop.

#### Light-theme premium / premium-dim / success fail as text
- **Severity:** High
- **Category:** Contrast
- **Where:** tokens `premium` (`tokens.ts:30`), `premium-dim` (`:31`), `success` (`:35`). Used as text in `badge.styles.tsx:9-10`, `chip.styles.tsx:13-14`, `alert.styles.tsx:13-14`, `text.styles.tsx:30-31`.
- **Problem:** In light theme, `premium` 3.99/4.20, `premium-dim` 2.68/2.82, `success` 3.27/3.45 on bg/surface — all below 4.5:1. Badge/Chip/Alert render these as small label text. (Dark theme passes comfortably.) Fails WCAG 1.4.3 in light mode.
- **Recommendation:** Darken the light-theme values: `premium` light → ≈`#6F6141`, `premium-dim` light → ≈`#6B5F3F`, `success` light → ≈`#157F48` (target ≥4.5:1 on surface). `success` as a non-text status color (dot/bar) at 3:1 is fine, so only the text usages need the fix.

#### No component respects prefers-reduced-motion
- **Severity:** High
- **Category:** Reduced-motion
- **Where:** Library-wide. 0 matches for `motion-reduce`/`prefers-reduced-motion` in `src/` and in `src/styles/*.css`. Animations/transitions: `spinner` `animate-spin`, `skeleton`/`progress` `animate-pulse` (`progress.styles.tsx:9`), Button `active:scale-[.98]` + shadow transition, Dialog/Drawer/Toast/Menu/Tooltip transform+opacity transitions, Switch/Accordion/Tabs transitions, Slider.
- **Problem:** Users with vestibular sensitivity get continuous spin/pulse and slide/scale motion with no reduced-motion fallback. Fails WCAG 2.3.3 (AAA) and is a strong AA best-practice gap; continuously animating spinners also brush against 2.2.2.
- **Recommendation:** Add a global rule in `theme.css`/`reset.css` under `@media (prefers-reduced-motion: reduce)` that drops non-essential `animation`/`transition` to near-zero, and/or add `motion-reduce:animate-none` / `motion-reduce:transition-none` variants to the animated slots (keep an accessible non-animated loading affordance for Spinner/Progress).

#### accent-deep is unusable as text on dark surfaces (latent)
- **Severity:** Low
- **Category:** Contrast
- **Where:** token `accent-deep` `src/tokens.ts:28`. Currently only consumed inside `gradient-accent`, not as a standalone `text-*` class (grep shows no `text-accent-deep`).
- **Problem:** As text it is 2.78:1 (dark bg) / 2.59:1 (dark surface) — far below 4.5:1. No current violation, but a trap if any future component uses `accent-deep` for text/icons in dark mode.
- **Recommendation:** Document in `docs/tokens.md` that `accent-deep` is a fill/gradient token only, never text on dark surfaces; consider lint/story coverage to catch `text-accent-deep`.

#### Menu item keyboard-highlight indicator is nearly invisible
- **Severity:** Medium
- **Category:** Focus
- **Where:** `src/components/menu/menu.styles.tsx:15` — `data-[highlighted]:bg-line-soft`; `line-soft` = `rgba(255,255,255,0.06)` dark / `rgba(0,0,0,0.06)` light (`tokens.ts:26`).
- **Problem:** Base UI drives menu keyboard navigation via `data-highlighted` (there is no `focus-visible` ring on menu items). A 6%-opacity background change over `surface` is well under 3:1 non-text contrast, so the currently-focused menu item is barely distinguishable — a keyboard-navigation blocker. (Same faint token backs ghost-button hover, less critical there.)
- **Recommendation:** Use a stronger highlight for menu items, e.g. `data-[highlighted]:bg-surface-2` plus a left accent bar or `text-text`/accent treatment, so the active item reads at ≥3:1 against the popup.

#### Icon-only Close buttons lack labels or are undersized
- **Severity:** Medium
- **Category:** ARIA/Semantics + Touch-target
- **Where:** Toast close `src/components/toast/toast.logic.tsx:21` (`aria-label="Close"`, but `size-6` = 24px, `toast.styles.tsx:16`); Drawer close `drawer.styles.tsx:14` (`size-8` = 32px, **no `aria-label`** in styles — verify the logic supplies one); Dialog close is a text button (`dialog.styles.tsx:20`, fine).
- **Problem:** Toast close is 24×24px with a 14px glyph — meets the WCAG 2.2 2.5.8 (AA) 24px *minimum* but is below the comfortable 44px (2.5.5 AAA) and small for touch. Drawer's `Base.Close` needs an explicit `aria-label` for its icon child; if the icon-only variant renders without visible text it would be an unlabeled control.
- **Recommendation:** Bump the Toast close to `size-8` (32px) to match Drawer, and confirm every icon-only `Base.Close`/close control passes an `aria-label` (Toast does; audit Drawer's logic to ensure its close, if icon-only, does too).

#### Avatar image alt and Progress accessible name are not defaulted
- **Severity:** Medium
- **Category:** ARIA/Semantics
- **Where:** `src/components/avatar/avatar.logic.tsx:16` (`alt` optional, passed straight through — `alt={undefined}` emits no `alt` attribute); `src/components/progress/progress.logic.tsx:20-28` (`aria-label` optional, no default, no visible label required).
- **Problem:** An Avatar with `src` and no `alt` produces an `<img>` with no `alt`, so screen readers may announce the filename. A Progress with neither `label` nor `aria-label` is an unlabeled `progressbar`. `aria-valuenow` itself is handled correctly by Base UI when `value` is set.
- **Recommendation:** Default Avatar `alt=""` (treat as decorative when omitted, since a fallback exists) or require it via types like Button does. For Progress, default `aria-label` (e.g. `'Progress'`) when no `label`/`aria-label` is provided, or warn in dev.

#### Accordion heading level is fixed / not configurable
- **Severity:** Low
- **Category:** ARIA/Semantics
- **Where:** `src/components/accordion/accordion.logic.tsx:65` — `Base.Header` with no heading-level control.
- **Problem:** Base UI's `Accordion.Header` renders at a default heading level; if it does not match the surrounding document outline, screen-reader heading navigation is misleading (WCAG 1.3.1). The component exposes no `headingLevel` prop.
- **Recommendation:** Expose a `headingLevel`/`render` passthrough on the accordion header so consumers can set the correct level for their page.

#### Alert error/warning tones announce politely, not assertively
- **Severity:** Low
- **Category:** ARIA/Semantics
- **Where:** `src/components/alert/alert.logic.tsx:13` — `role = 'status'` default for all tones (info/success/warning/error).
- **Problem:** `role="status"` is `aria-live="polite"`. An error Alert (danger tone) arguably warrants `role="alert"` (assertive) so it interrupts. Consumers can override `role`, but the default does not adapt to tone.
- **Recommendation:** Default `role` from tone — `alert` (assertive) for error/danger, `status` (polite) otherwise — while still allowing an explicit override.

---

#### Positive notes / verified-good
- Spinner is correct: `role="status"`, default `aria-label="Loading"`, decorative SVG `aria-hidden` (`spinner.logic.tsx:19-24`).
- Button enforces `aria-label` for icon-only usage at the type level, sets `type="button"` default, `aria-busy` while loading, and disables during load (`button.logic.tsx:22-56`).
- Toast viewport is labelled (`aria-label="Notifications"`) and close has `aria-label="Close"`.
- `text` and `text-dim` pass 4.5:1 on every background in both themes; `accent`/`success` pass the 3:1 UI bar.
- Z-index stacking (dropdowns above dialogs) is resolved via the monotonic `--sk-z-*` scale in `tokens.ts:125-130` — not a current issue.

*Method:* ratios computed with a Bun script in scratchpad (`contrast.ts`, `ring.ts`) using sRGB relative luminance (WCAG 2.1 formula) and alpha compositing of translucent tokens over the relevant solid background before measuring. Not modified: any repo source.


### Internal audit — Performance at scale

**Headline (measured, not estimated):** Nothing in this library windows/virtualizes. `Table` renders every row the consumer passes and `Select`/`Combobox`/`Menu` `.map` every item into the DOM, so cost is strictly O(nodes). Measured on this machine: **a 1,000,000-row × 4-col Table takes 15,365 ms to `renderToStaticMarkup` and emits 305 MB of HTML / 5,000,009 DOM nodes**; at 100k rows it is 1,370 ms SSR and, in a real Chromium tab (browser pane), **2,231 ms of frozen main thread to mount** (500,009 nodes). A `Select`/`Combobox` popup of 100k items is 1,113 ms SSR and **601 ms to open** in-browser with a **3,600,000 px** scroll range; forcing relayout while scrolling that list costs **~238–282 ms per step (~4 fps)**. The practical interactive ceilings are roughly **~2–3k rows** for Table mount and **~10k items** for a popup open (both cross the 100 ms budget there); everything above is jank, and six figures freezes the tab. All benchmarks were run from the scratchpad (React 19.3 `react-dom/server` for SSR, importing the real `Table`; browser-pane Chromium for client), no repo files were modified, and `git status` is clean.

#### Benchmark method
- **SSR:** `bun run` + `react-dom/server` `renderToStaticMarkup`, warm render timed with `performance.now()`, HTML bytes via `Buffer.byteLength`, nodes via opening-tag count. The real `Table` compound was imported from `src/`. `Select`/`Combobox`/`Menu` portal their popup and render nothing while closed, so their **open-popup item DOM was replicated exactly** (same element shape, roles, and class strings from the `.styles.tsx` files) to measure the cost the client pays on open.
- **Client:** a static HTML harness served over `localhost`, loading the library's built `dist/tokens.css`+`theme.css`+`styles.css`, rendering the identical class/DOM structure, opened in the browser-pane Chromium. Mount/open = `innerHTML` + forced layout (`getBoundingClientRect`/`offsetHeight`), warm best-of-3. Scroll cost = set `scrollTop` + forced relayout per step (rAF is throttled while the pane is backgrounded, so a synchronous relayout proxy was used; it represents worst-case per-frame relayout, e.g. on hover/resize/theme change).

#### SSR render cost (react-dom/server renderToStaticMarkup)
| Component / size | Render ms | HTML bytes | DOM nodes |
|---|---:|---:|---:|
| Table 1,000 rows ×4 | 25.5 | 294,372 | 5,009 |
| Table 10,000 rows ×4 | 130.0 | 2,976,372 | 50,009 |
| Table 100,000 rows ×4 | 1,370.1 | 30,156,372 | 500,009 |
| Table 1,000,000 rows ×4 | **15,364.6** | **305,556,372** | **5,000,009** |
| Select popup 1,000 items | 17.8 | 229,930 | 5,001 |
| Select popup 10,000 items | 122.4 | 2,308,930 | 50,001 |
| Select popup 100,000 items | 1,112.7 | 23,188,930 | 500,001 |
| Combobox popup 1,000 items | 3.7 | 51,930 | 1,001 |
| Combobox popup 10,000 items | 31.6 | 528,930 | 10,001 |
| Combobox popup 100,000 items | 227.3 | 5,388,930 | 100,001 |
| Menu popup 1,000 items | 2.0 | 49,927 | 1,001 |
| Menu popup 10,000 items | 22.9 | 508,927 | 10,001 |
| Menu popup 100,000 items | 261.8 | 5,188,927 | 100,001 |

Untenable thresholds: **>16 ms** (one frame) by ~1k Table rows; **>100 ms** by ~10k rows / ~10k Select items; **>1 s** at 100k for Table and Select; **>15 s** at 1M rows. (Select nodes are 5×items because each item wraps a text `<span>` + indicator `<svg>`+`<path>`; Combobox/Menu are 1 node/item.)

#### Client interaction (browser-pane Chromium, real component CSS)
Table mount+layout, warm best-of-3:
| Table rows | Mount ms | Interactive? |
|---|---:|---|
| 100 | 25.4 | yes |
| 1,000 | 48.6 | yes |
| 5,000 | 158.9 | sluggish (>100ms) |
| 10,000 | 310.8 | janky |
| 50,000 | 1,182.1 | frozen |
| 100,000 | 2,231.5 | **frozen (main thread blocked)** |

Select/Combobox popup open (mount+layout), warm best-of-3:
| Popup items | Open ms | <100 ms? |
|---|---:|---|
| 100 | 73.6 | ~ (fixed flex-layout floor) |
| 1,000 | 76.4 | ~ |
| 10,000 | 128.7 | **no** |
| 50,000 | 326.2 | no |
| 100,000 | 601.0 | no |

Scroll of the open 100k-item popup: `scrollHeight` = **3,600,000 px**; forced-relayout scroll **avg 238 ms / worst 282 ms per step (~4 fps)**. Screenshot evidence: harness rendered the real 10k-row Table and a popup whose scrollbar thumb is a 2–3 px sliver, confirming the entire list is in the DOM (no window). **Largest interactive N: ~2–3k Table rows and ~10k popup items stay under ~100 ms; beyond that it degrades, and ≥50k freezes the tab.**

---

#### No virtualization in Table (renders every row)
- **Severity:** Critical
- **Category:** Virtualization
- **Measured:** 100k rows = 1,370 ms SSR / 2,231 ms in-browser mount / 500,009 nodes / 30 MB HTML. 1M rows = 15,365 ms SSR / 305 MB / 5M nodes.
- **Where:** `src/components/table/table.logic.tsx:11-17` (`<table>{children}</table>` — nothing bounds row count); `src/components/table/table.styles.tsx:4` (`wrapper: 'w-full overflow-x-auto'` — no height cap, no `overflow-y`, so all rows are laid out at once).
- **Problem:** The Table is a thin compound wrapper; the consumer maps their whole dataset to `Table.Row`s. There is no windowing, no built-in scroll viewport, no `content-visibility`. Cost scales linearly with rows and the whole render is synchronous, so a large table blocks SSR (TTFB) and freezes the client main thread on mount (2.2 s at 100k, unresponsive to input).
- **Recommendation:** Offer an opt-in virtualized mode — either a `Table.Virtualized` compound backed by `@tanstack/react-virtual` (row measurement + absolute-positioned window; expected ~constant ~5–15 ms mount regardless of N, DOM held to the ~30 visible rows), or a documented `renderRow`/`getRowModel` API. Cheapest interim win with zero API change: set `content-visibility: auto` + a `contain-intrinsic-size` estimate on `Table.Row` via a `@utility` — the browser skips layout/paint of off-screen rows, which alone should cut the 100k mount by well over half. Document a hard guidance ceiling (e.g. "paginate or virtualize beyond ~200 rows").

#### No virtualization in Select / Combobox popups (renders every item)
- **Severity:** Critical
- **Category:** Virtualization
- **Measured:** Select popup 100k = 1,113 ms SSR / 601 ms open in-browser / 3.6M px scroll range / ~238 ms-per-step scroll relayout. Open crosses 100 ms at ~10k items (129 ms).
- **Where:** `src/components/select/select.logic.tsx:103-115` (`<Base.List>{items.map(...)}` renders every option); `src/components/select/select.styles.tsx:17-18` (`popup: 'min-w-40 max-h-96 overflow-y-auto …'`); `src/components/combobox/combobox.logic.tsx:49-56` (`<Base.List>{(item)=>…}` over all items); `src/components/combobox/combobox.styles.tsx:9` (`max-h-72 … overflow-y-auto`).
- **Problem:** `max-h-* + overflow-y-auto` clips the popup visually but the browser still builds and lays out every item node; opening a 10k+ list stalls, and the giant flow makes scrolling expensive. Base UI Autocomplete's built-in filter is also O(n) per keystroke over `items` (see next finding). Passing 10k+ options is a realistic footgun (country/city/SKU pickers) with no guardrail in the API.
- **Recommendation:** Adopt Base UI's virtualization path for these primitives (Base UI `Select`/`Autocomplete` support a virtualized list via `@tanstack/react-virtual`), or add a `virtualized` prop / `maxRenderedItems` with async-search guidance. Expected impact: open time and scroll become ~constant (~tens of ms) and independent of N. Document that unbounded option lists should use server-side search + a capped result window.

#### Combobox does O(n) filtering on every keystroke
- **Severity:** High
- **Category:** Client-perf
- **Where:** `src/components/combobox/combobox.logic.tsx:33-38` (`<Base.Root items={items} …>` — Base UI Autocomplete filters the full `items` array on each input change; there is no `filter`/async override wired up).
- **Measured:** Rendering the filtered result is the SSR/open numbers above (10k items = 129 ms open, 100k = 601 ms). Filtering itself is a full array scan + substring test per keystroke over `items`; combined with re-rendering the matched subset (still unwindowed), each keystroke on a 10k+ list does O(n) work plus a large reconciliation.
- **Problem:** Typeahead on a large suggestion list produces per-keystroke lag proportional to list size; the visible symptom is input latency, not just open latency.
- **Recommendation:** Expose an async/`onFilter` (or `filterFn`) prop so consumers can debounce + fetch server-side and feed a small capped result set, and virtualize the rendered results. Expected impact: keystroke cost becomes O(rendered window) instead of O(items). At minimum, document a recommended max `items` length and that large lists should be server-filtered.

#### Menu uses array-index keys and re-renders all items
- **Severity:** Medium
- **Category:** Re-render
- **Where:** `src/components/menu/menu.logic.tsx:41-51` (`items.map((item, index) => <Base.Item key={index} …>`); the `noArrayIndexKey` lint is suppressed with the rationale "static, ordered list").
- **Measured:** Menu popup 10k items = 22.9 ms SSR / 508,927 bytes; 100k = 261.8 ms. Menus are normally small, so absolute cost is low — the issue is correctness-under-mutation, not raw size.
- **Problem:** Array-index keys are fine only while the list never reorders/inserts/removes. If a consumer builds a dynamic menu (filtered actions, reorder), index keys cause React to reuse the wrong DOM/state (highlight, focus, transitions land on the wrong row). No `React.memo` on items either, so every parent render reconciles all of them.
- **Recommendation:** Key by a stable field. Either derive a key from the item (e.g. a required `id`, or `label` when it is a string) or add an optional `id` to `MenuItemOption` and prefer it. Keep index only as the documented last-resort fallback. Impact: correctness for dynamic menus; negligible perf change at typical menu sizes.

#### `Select.Value` runs `items.find` (O(n)) on every value render
- **Severity:** Low
- **Category:** Re-render
- **Where:** `src/components/select/select.logic.tsx:88-97` (`<Base.Value>{(current) => { const selected = items.find(item => item.value === current); … }}`).
- **Measured:** Linear scan of `items` each time the displayed value renders; negligible below ~10k but a 100k-option Select pays a full-array scan per value render on top of the (already dominant) popup cost.
- **Problem:** For very large option sets the trigger label computation is O(n) and recomputed on each relevant render rather than memoized to a lookup map.
- **Recommendation:** Build a `Map<value, label>` with `useMemo(() => new Map(items.map(i => [i.value, i.label])), [items])` and look up in O(1). Small, safe, and it compounds with virtualization. Impact: removes an O(n) scan from the render path of large Selects.

#### No `React.memo` / memoized rows anywhere (whole list reconciles on any parent render)
- **Severity:** Medium
- **Category:** Re-render
- **Where:** `src/components/table/table.logic.tsx:26-34` (`Row`/`Cell` are plain function components, not memoized); `src/components/select/select.logic.tsx:104`, `src/components/combobox/combobox.logic.tsx:50`, `src/components/menu/menu.logic.tsx:41` (items mapped inline, no memo boundary).
- **Measured:** Reconciliation cost tracks the mount numbers above (e.g. 10k Table rows = ~311 ms of work); any state change in an ancestor that re-renders the list repeats a large share of that.
- **Problem:** Because rows/items are not memoized and are recreated inline, a parent state update (sort toggle, hover state lifted up, unrelated context change) re-renders the entire list rather than the changed rows. This is the steady-state cost (not just first mount) for interactive tables.
- **Recommendation:** This is subsumed by virtualization (windowing caps the reconciled node count). If virtualization is deferred, at minimum document that consumers should memoize row content and lift as little state as possible into the table's parent. A `renderRow` API paired with `React.memo` on the row wrapper would let the library enforce this.

#### Bundle: correctly tree-shaken; not a scale problem (noted for completeness)
- **Severity:** Low
- **Category:** Bundle
- **Where:** `tsup.config.ts` (`bundle: false`, per-file outputs so `'use client'` and tree-shaking work); `.size-limit.json` (Button-only budgets, 3 kB own-code / 14 kB with deps, explicitly asserting Base UI is not pulled in); `package.json` `size` → `size-limit`.
- **Measured:** No per-component runtime scaling; Base UI is only pulled when a stateful component is imported. The size budgets only cover `Button`.
- **Problem:** None at scale — this is architecturally sound. The only gap is coverage: size budgets exist for `Button` alone, so a regression that accidentally makes `Table`/`Select` pull heavy deps wouldn't be caught by `bun run size`.
- **Recommendation:** Add size-limit entries for at least one static component (`Table`) and one Base-UI component (`Select`) so the "static stays tiny / stateful pays for Base UI once" contract is enforced in CI. Impact: guards the good bundle behavior; no runtime change.

#### Cheap CSS win available today: `content-visibility: auto`
- **Severity:** (recommendation, not a defect)
- **Category:** Client-perf
- **Where:** would apply to `table.styles.tsx` `row`, and `select`/`combobox` `item` slots (via a `@utility` in `theme.css`, per the CLAUDE.md "no interpolated classes / add a @utility" rule).
- **Measured:** The mount cost is dominated by layout/paint of off-screen nodes (100k Table mount 2,231 ms; 100k popup open 601 ms). `content-visibility: auto` lets the engine skip layout/paint for off-screen items.
- **Recommendation:** Add a `@utility sk-cv-auto { content-visibility: auto; contain-intrinsic-size: auto <rowHeight>; }` and apply to rows/items. Expected impact: large-list mount/scroll improves substantially (commonly 2–5×) with zero API change and no JS — a stopgap until real windowing ships. Note it does not shrink SSR HTML bytes or node count, so it does not fix the SSR/TTFB or memory findings; only true virtualization does.

---

**Cleanup confirmation:** All scripts/harness/server live only under the scratchpad (`scratchpad/bench/`); no files were added to or modified in the repo, the static server was stopped, and `git status` is clean (`--porcelain` empty, branch `main` up to date).


---

## Method & provenance

- Compiled 2026-09-17 by five parallel agents: three scouting external libraries (MUI; Radix + Base UI; Chakra + Mantine + Ant Design) via web research of primary sources (GitHub issues/PRs, changelogs, official docs), two auditing this repo (accessibility + contrast; performance at scale).
- External findings each cite a real URL and, where available, an issue/PR number and fix version; unverifiable fix versions were flagged as workarounds/tracking rather than asserted.
- Internal contrast ratios were computed with a Bun script (sRGB relative luminance, translucent tokens composited over their solid background). Internal performance was measured with React 19 `react-dom/server` for SSR and a real Chromium tab for client interaction; no repo files were modified during the audit.

# 50 improvements — sukuna-ui backlog

_Compiled 2026-09-17. Candidate improvements across accessibility, performance, API/DX, theming,
testing, SSR, and docs — grounded in this codebase (real components and gaps), beyond what the
`known-issues-and-audit.md` pass already fixed (contrast, focus ring, reduced-motion, z-index,
Tabs/RadioGroup fixes, the no-dep perf stopgap). This is a menu of options, not a commitment._

**Priority:** P1 (high value / low-ish cost) · P2 (worth doing) · P3 (nice to have).
**Effort:** S (hours) · M (a day-ish) · L (multi-day).

**Fastest wins:** #15, #36, #3, #34, #44, #49 (all P1/P2 and S).

---

## Accessibility (10)

1. **Internationalize built-in strings.** `Spinner` `aria-label="Loading"`, `Toast`
   `"Notifications"`/`"Close"`, `Progress` default `"Progress"`, and Pagination's prev/next labels
   are hard-coded English. Add a `labels` prop (or a locale Provider) so non-English apps aren't
   stuck. — P1 / M
2. **Forced-colors / Windows High Contrast Mode.** Translucent `--sk-line` borders and the
   `box-shadow`-based focus ring can disappear under `forced-colors: active`. Add a
   `@media (forced-colors: active)` layer using system colors and `outline` fallbacks. — P1 / M
3. **Alert tone → role.** Default `role="alert"` (assertive) for `danger`/`warning`, `status`
   (polite) otherwise, instead of always `status` (`alert.logic.tsx`). — P2 / S
4. **Accordion `headingLevel` prop.** `Accordion.Header` renders a fixed level; let consumers set
   the correct heading level for their outline (WCAG 1.3.1). — P2 / S
5. **Verify `inert` on modal backgrounds.** Confirm the pinned Base UI version makes the Dialog/
   Drawer background truly non-tabbable (not just `aria-hidden`); add a browser test that Tab can't
   reach background content. — P1 / M
6. **Tooltip WCAG 1.4.13.** Ensure the tooltip is hoverable (doesn't vanish when the pointer moves
   onto it) and Escape-dismissible; add tests for both. — P2 / S
7. **`VisuallyHidden` primitive + `sr-only` utility.** A first-class accessible-label helper reused
   across components instead of ad-hoc spans. — P2 / S
8. **Live-region announcements.** Announce Combobox result counts, Pagination page changes, and
   async loading via a polite live region so screen-reader users hear state changes. — P2 / M
9. **RTL support.** Move physical properties to logical (`start`/`end`), mirror `Drawer` side and
   chevrons under `[dir="rtl"]`, add an RTL Storybook toolbar. — P2 / L
10. **Accessible data tables.** `aria-sort` on sortable headers, optional `<caption>`, `scope="row"`
    for row-header cells, and a documented sortable/selectable pattern. — P2 / M

## Performance (7)

11. **Opt-in virtualization (the deferred real fix).** `Table.Virtualized` + virtualized
    Select/Combobox via `@tanstack/react-virtual` (Base UI already exposes a `virtualized` flag) —
    constant mount/scroll cost at any N, versus today's `content-visibility` paint-only stopgap. — P1 / L
12. **Async `filterFn` for Combobox.** A debounced server-search hook feeding a capped list, so
    keystroke cost is O(rendered) not O(items). — P2 / M
13. **Memoized rows + `renderRow` for Table.** `React.memo` row wrappers so a parent re-render
    doesn't reconcile every row (the steady-state cost for interactive tables). — P2 / M
14. **Per-component CSS.** The precompiled `styles.css` bundles every component's classes; offer
    `sukuna-ui/<component>.css` (or lean on Tailwind `@source`) so non-Tailwind consumers ship only
    what they use. — P2 / L
15. **`"sideEffects"` in package.json.** Mark the CSS files as the only side effects so bundlers can
    drop unused component modules more aggressively. — P1 / S
16. **Size budgets for all 29 components.** `size-limit` currently covers Button/Table/Select;
    extend it so any accidental Base-UI pull-in on a "static" component fails CI. — P2 / M
17. **CSS containment.** `contain: content` on `Card` and portalled popups to isolate their
    layout/paint from the rest of the page. — P3 / S

## API & developer experience (8)

18. **Subpath exports.** Add an `exports` map for `import { Button } from "sukuna-ui/button"` so
    bundlers and consumers can import explicitly. — P2 / M
19. **`render`/`asChild` consistency.** Dialog/Drawer/Toast accept `render`; Button/Chip/Badge don't.
    Standardize one slot-merging/polymorphism prop across all components. — P2 / M
20. **Generic `Select<T>`.** Allow non-string values via `itemToString`/`isItemEqualToValue` instead
    of the string-only v1 API. — P2 / M
21. **Ref forwarding on all compound parts.** `Dialog.Content`, `Table.Row`, etc. should forward
    refs for measurement and third-party integration. — P2 / M
22. **Controlled-state consistency.** Every stateful component exposes `value`+`onChange` and
    `open`+`onOpenChange` with identical naming; document the shared pattern once. — P2 / S
23. **Icon conventions.** A documented icon-slot contract plus an example wiring lucide/heroicons
    (components currently inline their own SVGs). — P3 / S
24. **Polymorphic `Button as="a"`.** Render an `<a>` with button styling for nav CTAs, keeping
    `type`/`disabled` semantics correct. — P2 / S
25. **Component scaffold generator.** `bun run new:component <name>` that stamps the three-file +
    test + stories + doc template, enforcing the file contract from `CLAUDE.md`. — P2 / M

## Forms & validation (4)

26. **`Field` / `FormControl` wrapper.** Compose label + control + description + error with correct
    `id` / `aria-describedby` / `aria-invalid` wiring — `Input`'s `invalid` prop currently has no
    linked error message. — P1 / M
27. **Native form participation.** Ensure Checkbox/Switch/RadioGroup/Select submit `name`/`value` in
    a plain `<form>` (hidden inputs where Base UI needs them), with a test. — P2 / M
28. **Missing form primitives.** `Textarea`, `NumberField`, `PinInput`, and a `FieldError` text
    component are common needs not yet covered. — P2 / L
29. **Shared validation styling.** One source for the invalid ring + helper-text color instead of
    per-component `invalid:` classes. — P3 / S

## Theming & tokens (6)

30. **`createTheme` recipe + docs.** A documented, type-safe way to override `--sk-*` (brand palette,
    radius, fonts) for a whole app, beyond raw CSS-var overrides. — P1 / M
31. **System (auto) color mode.** Support "follow `prefers-color-scheme`" (no `data-theme`) plus a
    copy-paste pre-paint script to avoid the flash on a persisted toggle. — P2 / M
32. **Bundled high-contrast theme.** A `data-theme="hc"` palette meeting AAA (7:1) for users who
    need maximum contrast. — P2 / M
33. **Density modes.** `data-density="compact|comfortable"` scaling control heights/padding via
    tokens, for data-dense apps. — P3 / M
34. **Auto-generated token reference.** A page generated from `tokens.ts` with live swatches and a
    pass/fail AA contrast badge per pair. — P2 / S
35. **Document motion & z-index override story.** Both are already tokens; document how to re-layer
    or slow motion, with the `prefers-reduced-motion` interplay. — P3 / S

## Testing & CI (7)

36. **Automated contrast gate.** Turn the scratchpad WCAG script into a `bun test` that fails if any
    `--sk-*` text/UI pair drops below AA — so the contrast we just fixed can't silently regress. — P1 / S
37. **Visual regression.** Playwright screenshot snapshots (or Chromatic) per story in both themes to
    catch unintended visual diffs (would have caught the invisible Tabs selected state). — P1 / L
38. **Cross-browser E2E.** Add Firefox + WebKit Playwright projects (currently chromium-only) — the
    Select-positioner class of bug is engine-sensitive. — P2 / M
39. **Storybook-level axe.** Run `@storybook/test-runner` + axe across every story in CI, not just
    unit-level checks. — P2 / M
40. **Interaction tests (play functions).** Cover complex flows — Dialog focus trap, Combobox
    typeahead, Menu keyboard nav — as story-driven E2E. — P2 / M
41. **SSR/RSC matrix.** Expand the hydration smoke to assert zero warnings for every client component
    under Next, plus an explicit React 18 pass. — P2 / M
42. **Edge-case regression tests.** Controlled↔uncontrolled transitions, `value={null}` resets,
    disabled interactions — the foot-guns the Base UI audit flagged. — P3 / M

## SSR / RSC & bundle (4)

43. **RSC boundary audit test.** Assert the exact set of files carrying `'use client'` matches
    expectation, so a static component (Text/Badge/Card) can never silently become client. — P1 / M
44. **`exports` + types hardening.** Per-subpath `types` conditions and run `@arethetypeswrong` for
    every entry, not just the root. — P2 / S
45. **Verified zero-JS statics.** Prove Text/Badge/Card/Divider/Table render with no client runtime
    and document them as RSC-first. — P2 / S
46. **Purge the fallback CSS.** The precompiled `styles.css` isn't purged; ship a purged build or
    document `@source`/PurgeCSS for non-Tailwind consumers to shrink it. — P2 / M

## Docs & adoption (4)

47. **Real docs site.** Grow `examples/showcase` into a docs site with per-component API tables
    auto-generated from the exported types, live examples, and copy buttons. — P1 / L
48. **More framework examples.** Remix, Astro, TanStack Start, a Vite-RSC example, and one real-world
    dashboard demo. — P2 / M
49. **CONTRIBUTING + architecture overview.** How the three-file contract, token pipeline, and green
    gates fit together, so others can contribute confidently. — P2 / S
50. **Supply-chain hardening.** OpenSSF Scorecard badge, Dependabot/Renovate for deps, and a
    `SECURITY.md` (provenance is already on). — P3 / S

---

### Suggested first slice (one focused release)

`#15` sideEffects · `#36` contrast CI gate · `#3` Alert role · `#4` Accordion headingLevel · `#34`
token reference · `#44` types hardening · `#26` Field wrapper — small, high-signal, and each closes
a real gap the audit or the showcase surfaced.

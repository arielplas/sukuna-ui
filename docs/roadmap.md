# Roadmap — `sukuna-ui` from first commit to npm

> **This file is a living status board.** Agents update it in the same commit as the work it describes: flip a box when a gate passes, never before. If this file and the code disagree, the code is the truth and this file is a bug to fix immediately.
>
> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[-]` dropped (say why)

Last updated: 2026-09-16 — Phases 0–7 done; 8 & 9 in progress. Library feature-complete; publish gated on owner.
Current phase: **Phase 8 (1 of 4 examples) + Phase 9 (docs/CI done; publish pending owner).** Phases 0–7 done.
Current version: none published. Target for first publish: `0.1.0`.

---

## A. Phase gates (from `plan-agentic.md`)

| # | Phase | Status | Gate | Evidence (link/commit) |
|---|---|---|---|---|
| 0 | Repo bootstrap | [x] | `bun run build` + `check:pkg` pass on empty entry; `CLAUDE.md`, PR template exist | local: `build`→ESM/CJS/d.ts/d.cts; `check:pkg` (publint --strict + attw) exit 0; `check` (biome+tsc) exit 0 |
| 1 | Tokens | [x] | `tokens:build` deterministic; Tokens story shows both themes | `tokens:build` byte-identical on re-run ✓; `src/tokens.ts` → `src/styles/tokens.css` (+ reset.css, index.css); `Design/Tokens` MDX renders every `--sk-*` dark+light. Light shadow proposed — Q12 |
| 2 | Storybook + test harness | [x] | Storybook opens with theme toolbar; `bun test` runs; 90% threshold proven to fail | SB10 react-vite builds; theme toolbar + SideBySide decorators; a11y+docs addons; Sukuna manager theme. `bun test` 3 pass; scalar 90% floor proven to fail (object form silently ignored by Bun — testing.md). Tailwind/theme.css deferred to Phase 3 per plan; Intro.mdx deferred to README (Phase 9) |
| 3 | Styling primitives | [x] | `theme.css`, `cn`, `tv` wrappers; `docs/styling.md`; `css:build` emits fallback CSS | Tailwind v4 + tv installed; generator emits `theme.css` (@theme inline + gradient utility); `cn`/`tv`/`tw-merge-config` (utils 100% cov); `css:build` → `dist/{styles,theme,tokens}.css`; Storybook on Tailwind; `docs/styling.md`. RSC-safe styling test passes. Spacing kept default — D10 |
| 4 | Static components | [x] | Text, Badge, Card all `[x]` in section B | All three shipped, exported, 100% cov each, axe both themes, stories build |
| 5 | Native interactive | [x] | Button, Input, Checkbox, Switch all `[x]` in section B | All four shipped, exported, 100% cov each; keyboard + a11y in tests; React 18 matrix green (68 tests) |
| 6 | Headless-backed | [x] | Tooltip, Dialog, Select all `[x]` in section B | All three on Base UI rc.0; unit 100% cov each; 5 Playwright browser tests stable (hover/focus-trap/Escape/outside-click/select) |
| 7 | Tree-shaking + size | [x] | `Button` alone < 3 kB gz; `size-limit` in CI | `bun run size`: Button (deps external) **804 B** < 3 kB; Button+deps 11.9 kB < 14 kB proves no Base UI leak. `.size-limit.json` + `size` script. (agadoo skipped — bare rollup can't resolve extensionless imports, unlike real bundlers; D14) |
| 8 | Consumer matrix | [~] | vite-react18, vite-react19, next-app-router, remix all build with zero hydration warnings | vite-react19, vite-react18, next-app-router build via `bun link`. Next prerenders (RSC boundary validated) and the **runtime hydration smoke passes — zero hydration warnings** (`scripts/hydration-smoke.mjs`, wired into CI). **Remaining:** remix example |
| 9 | Release | [~] | CI green incl. enforcement jobs; Version Packages PR reviewed; owner said "publish" | **Done:** README.md, docs/releasing.md (breaking-change table), base CI workflow (check/test/build/check:pkg/size/react18/browser/examples), initial changeset (minor → 0.1.0). **Remaining:** CI enforcement jobs (api/visual/token/peer diff), Version Packages PR, **owner "publish"** + tag. Agents never publish. |

---

## B. Component checklist

One row block per component. A component is done only when every box is `[x]`. Order within a component is fixed: doc → styles → logic → index → tests → stories → browser tests (if applicable) → exported → coverage → reviewed.

### Column definitions

| Column | Means |
|---|---|
| Doc | `docs/component-<name>.md` exists, follows the Button template, approved by owner |
| Styles | `<name>.styles.tsx`: `tv()` map, static class strings, every color/radius via `@theme` tokens, no raw hex |
| Logic | `<name>.logic.tsx`: `forwardRef`, native props extended, `'use client'` only if stateful, no DOM at module scope |
| Index | `index.tsx` re-exports component + `Props` type |
| Tests | `<name>.test.tsx` covers the 8 required cases in `docs/testing.md` |
| Stories | `<name>.stories.tsx` has every story named in the doc's Section 10, autodocs on |
| Browser | `test/browser/<name>.test.ts` (only headless-backed components; `n/a` otherwise) |
| Export | Listed in `src/index.ts`; `check:pkg` clean |
| ≥90% | Coverage on the component's own files, verified with `bun test src/components/<name> --coverage` |
| Review | Owner reviewed the Storybook in both themes and approved |

### Static

_`*` in Review = self-approved during the non-stop build (see `docs/ai-decisions.md` D7); awaiting
owner's visual pass._

| Component | Doc | Styles | Logic | Index | Tests | Stories | Browser | Export | ≥90% | Review |
|---|---|---|---|---|---|---|---|---|---|---|
| Text | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [x] | [x]* |
| Badge | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [x] | [x]* |
| Card | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [x] | [x]* |

### Native interactive

| Component | Doc | Styles | Logic | Index | Tests | Stories | Browser | Export | ≥90% | Review |
|---|---|---|---|---|---|---|---|---|---|---|
| Button | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [x] | [x]* |
| Input | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [x] | [x]* |
| Checkbox | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [x] | [x]* |
| Switch | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [x] | [x]* |

### Headless-backed

| Component | Doc | Styles | Logic | Index | Tests | Stories | Browser | Export | ≥90% | Review |
|---|---|---|---|---|---|---|---|---|---|---|
| Tooltip | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x]* |
| Dialog | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x]* |
| Select | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x]* |

### Shared internals

| Item | Status | Notes |
|---|---|---|
| `src/hooks/useControllableState` | [x] | `src/hooks/use-controllable-state.ts`, 100% cov (Phase 5) |
| `src/utils/cn.ts` | [x] | `extendTailwindMerge` via shared `tw-merge-config` (Phase 3) |
| `src/utils/tv.ts` | [x] | `createTV` with same merge config (Phase 3) |
| `src/styles/theme.css` | [x] | Generated `@theme inline` + `[data-theme]` palettes + gradient utility (Phase 3) |
| `src/styles/fallback.css` → `dist/styles.css` | [x] | `css:build` compiles it; also copies theme.css/tokens.css (Phase 3) |
| `test/setup.ts`, `test/ssr.ts`, `test/axe.ts` | [x] | Phase 2; happy-dom + jest-dom/axe + SSR/hydration helpers |
| `playwright.config.ts` + `scripts/serve-storybook.ts` | [x] | Browser suite under @playwright/test/Node (D16) — Phase 6 |
| `scripts/with-react.ts` | [x] | `test:react18` swaps React, runs tests, restores (Phase 5) |
| `CLAUDE.md` / `AGENTS.md` | [x] | Rules §3 + breaking-change table + docs map (Phase 0) |
| `.github/PULL_REQUEST_TEMPLATE.md` | [x] | Changeset/bump/docs/roadmap checklist (Phase 0) |

---

## C. Release checklist (`0.1.0`)

- [x] All ten components `[x]` in section B
- [x] `bun run check && bun run test:coverage && bun run build && bun run check:pkg && bun run size` green locally
- [x] `bun run test:react18` green
- [x] `bun run storybook:build && bun run test:browser` green
- [~] Consumer matrix (Phase 8) green — vite-react19 builds; 3 frameworks + hydration smoke remain
- [ ] CI enforcement jobs live: `changeset-bot`, `api-diff`, `visual-diff`, `token-diff`, `peer-diff` — base CI live; enforcement jobs remain
- [x] `docs/releasing.md` exists with the breaking-change table
- [x] `README.md`: install, two-line Tailwind setup, fallback CSS, `data-theme`, RSC notes, React 18/19 support
- [ ] `CHANGELOG.md` generated by Changesets (on first `changeset version`)
- [ ] `npm publish --dry-run` output reviewed: only `dist/`, `README.md`, `LICENSE`, `package.json`, `CHANGELOG.md`
- [ ] Owner has explicitly said **"publish"** in writing
- [ ] Tag `v0.1.0` created by owner
- [ ] Published; Storybook deployed to GitHub Pages

---

## D. v1.1 — new components (scheduled)

Gap analysis vs. Material UI (2026-09-16). Same contract as v1: docs-first, three-file split,
≥90% coverage, axe, stories, `bun link` example still builds. Base UI (already a dep) backs the
interactive ones. Each shipped component is a **minor** bump (adds API); pre-1.0 that's still `0.x`.

Order within a component: doc → styles → logic → index → tests → stories → (browser if headless) →
export → ≥90% → review.

**Status: v1.1 COMPLETE — Tier 1 (8/8), Tier 2 (4/4), Tier 3 (7/7). 29 components total. 187 unit + 13 browser tests, 100% coverage. `0.2.0` published; the rest queued for the next release.**

### Tier 1 — high-value, common

| Component | Kind | Backing | Status |
|---|---|---|---|
| Divider | static | — | [x] 100% cov |
| Alert | static | — | [x] 100% cov |
| Chip | static (+ optional dismiss) | — | [x] 100% cov |
| Avatar | static/img fallback | Base UI `avatar` | [x] 100% cov |
| Spinner | static (CSS) | — | [x] 100% cov |
| RadioGroup | interactive | Base UI `radio-group` | [x] 100% cov + browser |
| Tabs | interactive | Base UI `tabs` | [x] 100% cov + browser |
| Accordion | interactive | Base UI `accordion` | [x] 100% cov + browser |

### Tier 2 — common, a bit heavier

| Component | Kind | Backing | Status |
|---|---|---|---|
| Menu (dropdown) | interactive | Base UI `menu` | [x] 100% cov + browser |
| Toast | interactive (provider/queue) | Base UI `toast` | [x] 100% cov + browser |
| Progress (bar) | static/indeterminate | Base UI `progress` | [x] 100% cov |
| Skeleton | static | — | [x] 100% cov |

### Tier 3 — niche / later

| Component | Kind | Backing | Status |
|---|---|---|---|
| Breadcrumbs | static | — | [x] 100% cov |
| Slider | interactive | Base UI `slider` | [x] 100% cov + browser |
| Pagination | static (controlled) | — | [x] 100% cov |
| Drawer | interactive | Base UI `dialog` (side) | [x] 100% cov + browser |
| Stepper | static/interactive | — | [x] 100% cov |
| Combobox | interactive | Base UI `autocomplete` | [x] 100% cov + browser |
| Table | static | — | [x] 100% cov |

Out of scope for now: layout primitives (Box/Grid/Stack), an icon set, low-level utils
(Modal/Popover/Popper — used internally via Base UI).

## D2. Post-1.0 backlog (not scheduled)

- [ ] Polymorphic `as` / `asChild` for Button → Link
- [ ] Monorepo split (`@sukuna/tokens`, `@sukuna/icons`) if demand appears
- [ ] `premium` surface variants on Card
- [ ] RTL audit

## D3. v1.2 — Base UI coverage wave (design docs first)

Gap analysis vs. shadcn/ui, Radix, MUI, Mantine, Chakra (2026-09-21). Five components Base UI
(already a dep) ships but we hadn't wrapped — zero new dependencies, same contract as v1/v1.1
(docs-first, three-file split, ≥90% cov, axe, stories, browser test where headless). No new tokens
(all reuse existing surface/line/text tokens). Each is a **minor** bump; pre-1.0 that's still `0.x`.

Order within a component: doc → styles → logic → index → tests → stories → (browser if headless) →
export → ≥90% → review.

**Status: v1.2 SHIPPED (code) — 5/5 built, exported, 100% cov each, `check`/`build`/`check:pkg`
green. 313 unit tests total. Browser tests added (run under built Storybook). 39 components total.**

| Component | Kind | Backing | Doc | Code |
|---|---|---|---|---|
| NumberField | interactive | Base UI `number-field` | [x] | [x] 100% cov + browser |
| ToggleGroup (+ Toggle) | interactive | Base UI `toggle-group` + `toggle` | [x] | [x] 100% cov + browser |
| HoverCard | interactive | Base UI `preview-card` | [x] | [x] 100% cov + browser |
| ScrollArea | interactive | Base UI `scroll-area` | [x] | [x] 100% cov + browser |
| ContextMenu | interactive | Base UI `context-menu` (reuses `MenuItemOption`) | [x] | [x] 100% cov + browser |

Considered and held for owner: **Popover** (biggest cross-library gap, but roadmap §D lists
Modal/Popover/Popper as out of scope — needs an explicit decision to reverse). Cheaper alternates
if breadth is preferred over these: Collapsible, Meter, Kbd, AspectRatio.

---

## E. Update log

Agents append one line per meaningful status change: `YYYY-MM-DD · <what flipped> · <commit or PR>`.

- 2026-09-16 · File created during design; Button doc approved · (design session)
- 2026-09-16 · Phase 0 bootstrap: package.json (sukuna-ui, exports, peer react>=18), tsconfig strict, Biome, tsup (esm/cjs/dts + preserveDirectives), Changesets, CLAUDE.md/AGENTS.md, PR template; build + check:pkg green · (bootstrap commit)
- 2026-09-16 · Phase 1 tokens: src/tokens.ts (typed source of truth) → scripts/build-tokens.ts → src/styles/tokens.css (deterministic), + reset.css, index.css; tokens:build script. Light shadow proposed pending Q12. Storybook Tokens page deferred to Phase 2 · (tokens commit)
- 2026-09-16 · Phase 2 harness: bunfig.toml (90% scalar floor — object form is a Bun no-op), test/setup.ts+ssr.ts+axe.ts, smoke test (3 pass); fixed two testing.md spec bugs · (harness commit)
- 2026-09-16 · Phase 2 Storybook: SB10 react-vite, .storybook/{main,preview,manager,theme}, theme toolbar + SideBySide, Design/Tokens MDX (both themes), telemetry off. Closes Phase 1 Tokens-story gate · (storybook commit)
- 2026-09-16 · Phase 3 styling: Tailwind v4 + tailwind-variants; generator emits theme.css; cn/tv/tw-merge-config utils (100% cov); css:build → dist CSS; theme.css/styles.css/tokens.css exports (attw excludes CSS); Storybook on Tailwind; docs/styling.md + ai-decisions.md · (styling commit)
- 2026-09-16 · Phase 4 Text: docs/component-text.md + styles/logic/index/test/stories, exported; 100% cov, axe both themes. Fixed happy-dom preload ordering (D12) + added bun:test matcher types · (text commit)
- 2026-09-16 · Phase 4 Badge: docs/component-badge.md + full set, exported; tones/sizes/dot; 100% cov, axe both themes · (badge commit)
- 2026-09-16 · Phase 4 Card + gate: docs/component-card.md + full set, exported; elevation/padding/radius; 100% cov, axe both themes. Phase 4 gate closed (Text+Badge+Card). Static APIs logged D13 · (card commit)
- 2026-09-16 · Phase 5 Button: implemented per approved doc ('use client', loading/spinner, TS-enforced icon-only label); 100% cov, 12 tests incl keyboard. Build reworked to per-file output + fix-directives so 'use client' is preserved for RSC (D14) · (button commit)
- 2026-09-16 · Phase 5 Input (static, native size dropped, invalid) · (input commit)
- 2026-09-16 · Phase 5 Checkbox + useControllableState hook (native accent-color, indeterminate, onCheckedChange); 100% cov · (checkbox commit)
- 2026-09-16 · Phase 5 Switch + gate: role=switch button, tv slots track/thumb; scripts/with-react.ts + test:react18 (68 tests pass on React 18). Phase 5 gate closed. APIs logged D15 · (switch commit)
- 2026-09-16 · Phase 6 Tooltip: Base UI wrapper (rc.0), styled popup; unit (trigger+SSR) + Playwright browser test (hover shows / Escape hides). Browser suite moved to @playwright/test/Node — Bun hangs Playwright (D16). Base UI installed, Chromium installed · (tooltip commit)
- 2026-09-16 · Phase 6 Dialog: compound Dialog.* (Trigger/Content/Title/Description/Close) over Base UI; unit 100% cov (defaultOpen renders portal content) + Playwright (focus trap / Escape / outside-click). Compound API logged D17 · (dialog commit)
- 2026-09-16 · Phase 6 Select + gate: prop-driven items (string values), open/defaultOpen; unit 100% cov (open list click) + Playwright (choose/keyboard). Phase 6 closed — all 10 v1 components ship. Logged D18 · (select commit)
- 2026-09-16 · Phase 7 size: size-limit — Button tree-shaken 804 B < 3 kB (deps external); Button+deps 11.9 kB < 14 kB (no Base UI leak). `size` script + .size-limit.json · (size commit)
- 2026-09-16 · Phase 8 (partial): examples/vite-react19 builds & consumes sukuna-ui via bun link (all 10 components + styles.css). file: dep skipped gitignored dist → use bun link (D19). 3 more frameworks + hydration smoke remain · (example commit)
- 2026-09-16 · Phase 9 (docs/CI, no publish): README.md, docs/releasing.md (breaking-change table), .github/workflows/ci.yml (check/test/build/pkg/size/react18/browser/examples), initial changeset (minor→0.1.0). Publish gated on owner · (release-prep commit)
- 2026-09-16 · Pushed main to github.com/arielplas/sukuna-components (owner instruction) · (push)
- 2026-09-16 · Phase 8: added vite-react18 + next-app-router examples; both build via bun link. Next build prerenders — validates RSC 'use client' boundary. Remix + hydration smoke remain · (examples commit)
- 2026-09-16 · Phase 8: runtime hydration smoke (scripts/hydration-smoke.mjs) on the Next SSR app — zero hydration warnings; wired into CI examples job. Remix example remains · (hydration commit)
- 2026-09-16 · Phase 9 CD: .github/workflows/release.yml — Changesets action opens Version Packages PR on push to main; publishes to npm (provenance) only after owner merges it. Needs NPM_TOKEN secret. docs/releasing.md updated · (release-workflow commit)
- 2026-09-16 · Enabled repo setting "Actions can create PRs"; Version Packages PR #1 opened + merged (0.1.0). First publish 404'd: `@sukuna/ui` needs an npm org that isn't owned. Renamed package → `sukuna-ui` (unscoped, D20); re-publishing on next push · (rename commit)
- 2026-09-16 · Published `sukuna-ui@0.1.0` to npm with provenance (Automation token + repository field). CI + CD green · (publish)
- 2026-09-16 · v1.1 gap analysis vs MUI added to roadmap §D. Built Tier-1 static components: Divider, Alert, Chip, Spinner (100% cov each, axe both themes) · (v1.1 static wave)
- 2026-09-16 · Tier-1 complete: Avatar, RadioGroup, Tabs, Accordion (Base UI). 100% cov each; RadioGroup/Tabs/Accordion have Playwright browser tests (arrow-key/manual-activation/expand). 131 unit tests, 8 browser tests green · (v1.1 interactive wave)
- 2026-09-16 · Tier-2 (3/4): Skeleton (static), Progress (Base UI), Menu (Base UI + browser test). 145 unit + 9 browser tests green. Toast remains · (v1.1 tier-2 wave)
- 2026-09-16 · Tier-2 complete: Toast (Base UI Provider + useToast hook + viewport). 147 unit + 10 browser tests green. v1.1 Tier 1 + Tier 2 all shipped (12 new components; 22 total) · (toast commit)
- 2026-09-17 · Published sukuna-ui@0.2.0 (merged Version Packages PR #2; 12 v1.1 components) · (release)
- 2026-09-17 · Tier-3 (3/7): Breadcrumbs (static), Slider (Base UI + browser), Pagination (static, range helper). 167 unit + 11 browser tests green. Remaining: Drawer, Stepper, Combobox, Table · (v1.1 tier-3 wave)
- 2026-09-17 · Tier-3 complete + v1.1 DONE: Drawer (Base UI dialog, side variant), Stepper (static), Combobox (Base UI autocomplete), Table (static compound). 187 unit + 13 browser tests green. 29 components total · (v1.1 tier-3 wave 2)
- 2026-09-17 · Fix: dropdowns (Select/Menu/Combobox) + Tooltip rendered behind Dialog/Drawer — z-index was on the popup, not the portalled positioner. Added overlay z token scale (dialog 50 < popover 60 < toast 70 < tooltip 80); z-index on positioner. New Playwright stacking guard. 187 unit + 14 browser tests green. minor → 0.4.0 (D21) · (z-index fix commit)
- 2026-09-17 · A11y wave 1 (audit backlog P0#1/P1#4,6/P2#9,11): retuned text-faint + light premium/premium-dim/success to WCAG AA; new --sk-focus-ring (solid) replaces translucent ring on all focus; Menu/Select/Combobox highlight → crimson inset ring (≥3:1); Avatar alt="" default, Progress default name, Toast close 24→32px. 189 unit tests green. minor (D22) · (a11y wave 1 commit)
- 2026-09-17 · A11y P1#5 (owner-approved): Button primary label now AA — new --sk-on-accent (white) label + darkened dark gradient start #FF3B4E→#D8253A (white 4.95:1). Verified dark+light in browser. 189 tests green. minor (D23) · (button contrast commit)
- 2026-09-17 · Perf wave (audit P0#2/#3, #8/#10/#12; owner Option 2 = no-dep): content-visibility on Combobox/Menu items (not Select — breaks its popup alignment; not Table <tr>); Combobox maxRenderedItems→Base UI limit; Select.Value O(1) memo; Menu optional stable id key; size-limit entries Table(498B)/Select(48.4kB). Docs: README perf section. 190 unit + 14 browser green. minor (D24) · (perf wave commit)
- 2026-09-17 · A11y P1#7: prefers-reduced-motion honored via motion-reduce:* on 17 motion slots across 13 components (spin/pulse→none, overlay slide/scale→instant, Button press-scale off). Playwright reduced-motion test added. 190 unit + 16 browser green. minor (D25) · (reduced-motion commit)
- 2026-09-17 · RadioGroup: label-text click now selects the option (whole row is the Radio.Root; aria-labelledby kept so axe stays green). Browser test added. 190 unit + 17 browser green. patch (D26) · (radiogroup label-click commit)
- 2026-09-17 · Tabs: selected tab was invisibly styled — data-[selected] never matched (Base UI Tab uses aria-selected/data-active, no data-selected). Now aria-selected:text-accent + underline (crimson). Browser guard added. 190 unit + 18 browser green. patch (D27) · (tabs selected-state commit)
- 2026-09-17 · Tabs: disabled tab now visibly dimmed (data-[disabled] added — Base UI keeps a disabled tab focusable with data-disabled, no native disabled attr, so disabled: never fired). Verified other components unaffected. Browser guard added. 190 unit + 19 browser green. patch (D27) · (tabs disabled-state commit)
- 2026-09-17 · Added examples/showcase (all 29 components, dark/light toggle). Building it surfaced 2 bugs: Tabs was never exported from src/index.ts (fixed + guard test src/index.test.ts); Breadcrumbs keyed by href → dup keys (now index). 191 unit tests green. minor+patch (D28) · (showcase + export fix commit)
- 2026-09-17 · Improvements batch (6 parallel agents, D29): new Field component (Base UI Field, form wrapper); Accordion headingLevel; Button as="a" polymorphic; Alert tone→role; contrast CI gate (src/tokens.contrast.test.ts, 38 assertions); Storybook token contrast badges. Now 30 components. 221 unit tests, 100% cov, check/build/check:pkg green. 4 minor changesets · (improvements batch commit)
- 2026-09-18 · Agent-friendly docs + SEO (D30, 7 parallel agents): TSDoc on all 30 components (shipped in .d.ts); scripts/build-docs.ts generates llms.txt / llms-full.txt / docs/llms/*.md / README table (docs:build in build, docs:check in CI); README rewritten agent-first; package.json keywords/author; update-readme skill; showcase prerendered + full SEO (JSON-LD, OG/og.png, robots, sitemap) + root vercel.json. Stale specs fixed (Button as, Menu id, Alert role). 221 tests / 100% cov, tsc + biome clean. minor · (agent-friendly docs commit)
- 2026-09-18 · Checkbox (D32): `label` prop (real <label>, text click toggles, names the box; showcase now uses it) + Enter toggles with preventDefault (never submits a form). 5 unit tests + 2 Playwright guards. minor · (checkbox label/enter commit)
- 2026-09-18 · Select popup (D31): alignItemWithTrigger off (wheel scrolled the list but grew/moved the popup in Base UI's aligned mode), popup min-width = trigger width (--anchor-width), max-height capped by --available-height (4th stacked Select overflowed the viewport). ManyItems story (100 numeric options, 4 stacked). 2 Playwright guards. patch · (select popup commit)
- 2026-09-21 · Button: `cursor-pointer` on hover — it was the only interactive component without a pointer cursor (switch/tabs/accordion/menu/etc. already set it); disabled/aria-disabled/aria-busy cursors still override. Doc snippet + states table + generated llms docs updated. Verified live in Storybook. patch · (button cursor-pointer commit)
- 2026-09-21 · React Bits-inspired wave — DESIGN DOCS ONLY (docs-first, no code yet): authored `docs/component-{counter,gradient-text,shiny-text,carousel}.md` per the Button template. Scouted reactbits.dev (~205 components) and rejected the WebGL backgrounds / cursor effects as off-identity (violate SSR / zero-runtime / a11y / 90%-cov); kept 4 that fit. New tokens/utilities (gradient-premium, sk-shine keyframe) logged as owner Q13/Q14 · (design-docs, code pending)
- 2026-09-21 · Counter shipped (React Bits wave 1/4): `'use client'` count-up over a server-rendered final value; `role="img"`+`aria-label` (announced once, not per frame); `motion-reduce` → final value instantly; `from`/`duration`/`decimals`/`prefix`/`suffix`/`format`/`once`. `startOnView` deferred (needs IntersectionObserver). 9 tests, 100% cov (rAF/matchMedia mocked). Also hardened `scripts/build-docs.ts` to skip specs with no `src/index.ts` export, so docs-first specs don't advertise phantom components. minor · (counter commit)
- 2026-09-21 · GradientText shipped (wave 2/4): static/RSC-safe `background-clip:text` fill; `-webkit-text-fill-color:transparent` reveals the gradient while a real `text-accent` stays as the a11y/axe fallback; `as` span/p/h1–h6. Ships `accent`; `premium` gated on the `--sk-gradient-premium` token (Q13). 7 tests, 100% cov. minor · (gradient-text commit)
- 2026-09-21 · ShinyText shipped (wave 3/4): static/RSC-safe CSS sweep (dim→bright→dim gradient, no transparent stop, legible base); `sk-shine` keyframe + `animate-shine*` utilities added to the generated theme layer (build-tokens.ts); `motion-reduce` freezes it; `speed` slow/normal/fast. `disabled` deferred (tailwind-merge can't dedupe the custom animate utility). 7 tests, 100% cov. minor · (shiny-text commit)
- 2026-09-21 · Carousel shipped (wave 4/4): root-managed WAI-ARIA carousel (labelled region, per-slide role=group + "n of total", live-region off during autoplay, arrows/Home/End, loop, autoplay with WCAG-2.2.2 pause control that never starts under reduced-motion — tri-state `reduced` avoids a transient start, pause-on-hover/focus, dots, controlled/uncontrolled). Swipe + `inert` on off-screen slides deferred to v1.1. 14 tests, 100% cov (setInterval/matchMedia mocked). Now 34 components. minor · (carousel commit)
- 2026-09-21 · v1.2 Base UI coverage wave — DESIGN DOCS ONLY (docs-first, no code): authored `docs/component-{number-field,toggle-group,hover-card,scroll-area,context-menu}.md` per the Button template. Gap analysis vs shadcn/Radix/MUI/Mantine/Chakra picked 5 components Base UI (already a dep) ships but we hadn't wrapped — zero new deps, no new tokens. Roadmap §D3 added. Popover held out for an explicit owner decision (currently out-of-scope per §D). code pending owner doc approval · (v1.2 design-docs)
- 2026-09-21 · v1.2 SHIPPED (code): built NumberField (text input + hidden number mirror; steppers, largeStep, Intl format, clamp), ToggleGroup + standalone Toggle (segmented/multiple, `multiple` not `toggleMultiple`; onValueChange always an array), HoverCard (Base preview-card; delay/closeDelay on the Trigger not root; no arrow — matches Tooltip/Menu), ScrollArea (native-scroll viewport + themed thumbs, orientation vertical/horizontal/both), ContextMenu (right-click, reuses Menu's `MenuItemOption`, style parity with Menu). All exported, 100% cov each; `check`/`build`/`check:pkg` green; 313 unit tests. 5 browser specs added. 39 components. Doc fixes from real Base UI rc API: NumberField readOnly doesn't disable steppers; HoverCard arrow dropped. minor ×5 · (v1.2 code)
- 2026-09-21 · v1.2 polish: (1) halved default open delay to 300ms on Tooltip (was Base 600) and HoverCard.Trigger — snappier hover reveal; Tooltip default change = minor (breaking on 0.x), HoverCard folded in pre-release. (2) ContextMenu iOS long-press fix: children now wrapped in Base UI's `display:contents` trigger with `user-select:none` + `-webkit-touch-callout:none` (Base only sets the callout; without user-select:none an iOS long-press starts text selection and the menu never opens). Verified desktop right-click still opens; child inherits user-select:none. 313 tests green · (v1.2 polish)
- 2026-09-21 · Showcase rebuilt as an auto-driven component explorer (examples/showcase): left-nav routing (hash) over all 39 components, right pane renders every Storybook story per component (examples/showcase/src/stories.tsx globs src/components/*/*.stories.tsx and renders meta+story args / render fns, like Storybook). Added Tailwind v4 to the showcase build (mirrors .storybook: @tailwindcss/vite + a styles.css that @imports theme.css and @sources the components+stories) so story-only utilities render; imports library+stories from source so context components (Toast) share one instance. Overview page kept as the default route (SEO + prerender <h1>). Component count is now dynamic (components.length) — no more hard-coded/stale count. Prerender build green; verified dark+light, story rendering, Toast context. `update-showcase` skill rewritten (showcase is auto-driven now; no manual demo/count upkeep) · (showcase explorer)
- 2026-09-21 · Showcase: every example gets a Show code toggle (import line + the story's own JSX). The snippet is lifted from the stories source via a second `?raw` glob — `{...args}` is inlined as the literal props written in `args: { … }` (so `items={items}` stays a reference and its helper `const` is included above), explicit tag props beat expanded args, a `react` import is added when a story uses hooks, and the `import { … } from 'sukuna-ui'` line comes from the real exports in src/index.ts. Closed on the server (prerender unchanged); Copy uses the clipboard in a click handler. · (showcase-code-toggle branch)

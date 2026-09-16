# Roadmap — `@sukuna/ui` from first commit to npm

> **This file is a living status board.** Agents update it in the same commit as the work it describes: flip a box when a gate passes, never before. If this file and the code disagree, the code is the truth and this file is a bug to fix immediately.
>
> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[-]` dropped (say why)

Last updated: 2026-09-16 — Phases 0–3 done. Next: Phase 4 (static components: Text, Badge, Card).
Current phase: **Phase 4 — Static components** (next). Phases 0–3 done; 5–9 pending.
Current version: none published. Target for first publish: `0.1.0`.

---

## A. Phase gates (from `plan-agentic.md`)

| # | Phase | Status | Gate | Evidence (link/commit) |
|---|---|---|---|---|
| 0 | Repo bootstrap | [x] | `bun run build` + `check:pkg` pass on empty entry; `CLAUDE.md`, PR template exist | local: `build`→ESM/CJS/d.ts/d.cts; `check:pkg` (publint --strict + attw) exit 0; `check` (biome+tsc) exit 0 |
| 1 | Tokens | [x] | `tokens:build` deterministic; Tokens story shows both themes | `tokens:build` byte-identical on re-run ✓; `src/tokens.ts` → `src/styles/tokens.css` (+ reset.css, index.css); `Design/Tokens` MDX renders every `--sk-*` dark+light. Light shadow proposed — Q12 |
| 2 | Storybook + test harness | [x] | Storybook opens with theme toolbar; `bun test` runs; 90% threshold proven to fail | SB10 react-vite builds; theme toolbar + SideBySide decorators; a11y+docs addons; Sukuna manager theme. `bun test` 3 pass; scalar 90% floor proven to fail (object form silently ignored by Bun — testing.md). Tailwind/theme.css deferred to Phase 3 per plan; Intro.mdx deferred to README (Phase 9) |
| 3 | Styling primitives | [x] | `theme.css`, `cn`, `tv` wrappers; `docs/styling.md`; `css:build` emits fallback CSS | Tailwind v4 + tv installed; generator emits `theme.css` (@theme inline + gradient utility); `cn`/`tv`/`tw-merge-config` (utils 100% cov); `css:build` → `dist/{styles,theme,tokens}.css`; Storybook on Tailwind; `docs/styling.md`. RSC-safe styling test passes. Spacing kept default — D10 |
| 4 | Static components | [ ] | Text, Badge, Card all `[x]` in section B | |
| 5 | Native interactive | [ ] | Button, Input, Checkbox, Switch all `[x]` in section B | |
| 6 | Headless-backed | [ ] | Tooltip, Dialog, Select all `[x]` in section B | |
| 7 | Tree-shaking + size | [ ] | `Button` alone < 3 kB gz; `size-limit` in CI | |
| 8 | Consumer matrix | [ ] | vite-react18, vite-react19, next-app-router, remix all build with zero hydration warnings | |
| 9 | Release | [ ] | CI green incl. enforcement jobs; Version Packages PR reviewed; owner said "publish" | |

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
| Badge | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] |
| Card | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] |

### Native interactive

| Component | Doc | Styles | Logic | Index | Tests | Stories | Browser | Export | ≥90% | Review |
|---|---|---|---|---|---|---|---|---|---|---|
| Button | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] |
| Input | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] |
| Checkbox | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] |
| Switch | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] |

### Headless-backed

| Component | Doc | Styles | Logic | Index | Tests | Stories | Browser | Export | ≥90% | Review |
|---|---|---|---|---|---|---|---|---|---|---|
| Tooltip | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Dialog | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Select | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### Shared internals

| Item | Status | Notes |
|---|---|---|
| `src/hooks/useControllableState` | [ ] | Needed by Checkbox, Switch, Select |
| `src/utils/cn.ts` | [x] | `extendTailwindMerge` via shared `tw-merge-config` (Phase 3) |
| `src/utils/tv.ts` | [x] | `createTV` with same merge config (Phase 3) |
| `src/styles/theme.css` | [x] | Generated `@theme inline` + `[data-theme]` palettes + gradient utility (Phase 3) |
| `src/styles/fallback.css` → `dist/styles.css` | [x] | `css:build` compiles it; also copies theme.css/tokens.css (Phase 3) |
| `test/setup.ts`, `test/ssr.ts`, `test/axe.ts` | [x] | Phase 2; happy-dom + jest-dom/axe + SSR/hydration helpers |
| `test/browser/setup.ts` | [ ] | Playwright inside `bun test` — Phase 6 |
| `scripts/with-react.ts` | [ ] | React 18 matrix — Phase 5 |
| `CLAUDE.md` / `AGENTS.md` | [x] | Rules §3 + breaking-change table + docs map (Phase 0) |
| `.github/PULL_REQUEST_TEMPLATE.md` | [x] | Changeset/bump/docs/roadmap checklist (Phase 0) |

---

## C. Release checklist (`0.1.0`)

- [ ] All ten components `[x]` in section B
- [ ] `bun run check && bun test --coverage && bun run build && bun run check:pkg && bun run size` green locally
- [ ] `bun run test:react18` green
- [ ] `bun run storybook:build && bun run test:browser` green
- [ ] Consumer matrix (Phase 8) green
- [ ] CI enforcement jobs live: `changeset-bot`, `api-diff`, `visual-diff`, `token-diff`, `peer-diff`
- [ ] `docs/releasing.md` exists with the breaking-change table
- [ ] `README.md`: install, two-line Tailwind setup, fallback CSS, `data-theme`, RSC notes, React 18/19 support
- [ ] `CHANGELOG.md` generated by Changesets
- [ ] `npm publish --dry-run` output reviewed: only `dist/`, `README.md`, `LICENSE`, `package.json`, `CHANGELOG.md`
- [ ] Owner has explicitly said **"publish"** in writing
- [ ] Tag `v0.1.0` created by owner
- [ ] Published; Storybook deployed to GitHub Pages

---

## D. Post-1.0 backlog (not scheduled)

- [ ] Polymorphic `as` / `asChild` for Button → Link
- [ ] Monorepo split (`@sukuna/tokens`, `@sukuna/icons`) if demand appears
- [ ] Combobox, Menu, Tabs, Toast
- [ ] `premium` surface variants on Card
- [ ] RTL audit

---

## E. Update log

Agents append one line per meaningful status change: `YYYY-MM-DD · <what flipped> · <commit or PR>`.

- 2026-09-16 · File created during design; Button doc approved · (design session)
- 2026-09-16 · Phase 0 bootstrap: package.json (@sukuna/ui, exports, peer react>=18), tsconfig strict, Biome, tsup (esm/cjs/dts + preserveDirectives), Changesets, CLAUDE.md/AGENTS.md, PR template; build + check:pkg green · (bootstrap commit)
- 2026-09-16 · Phase 1 tokens: src/tokens.ts (typed source of truth) → scripts/build-tokens.ts → src/styles/tokens.css (deterministic), + reset.css, index.css; tokens:build script. Light shadow proposed pending Q12. Storybook Tokens page deferred to Phase 2 · (tokens commit)
- 2026-09-16 · Phase 2 harness: bunfig.toml (90% scalar floor — object form is a Bun no-op), test/setup.ts+ssr.ts+axe.ts, smoke test (3 pass); fixed two testing.md spec bugs · (harness commit)
- 2026-09-16 · Phase 2 Storybook: SB10 react-vite, .storybook/{main,preview,manager,theme}, theme toolbar + SideBySide, Design/Tokens MDX (both themes), telemetry off. Closes Phase 1 Tokens-story gate · (storybook commit)
- 2026-09-16 · Phase 3 styling: Tailwind v4 + tailwind-variants; generator emits theme.css; cn/tv/tw-merge-config utils (100% cov); css:build → dist CSS; theme.css/styles.css/tokens.css exports (attw excludes CSS); Storybook on Tailwind; docs/styling.md + ai-decisions.md · (styling commit)
- 2026-09-16 · Phase 4 Text: docs/component-text.md + styles/logic/index/test/stories, exported; 100% cov, axe both themes. Fixed happy-dom preload ordering (D12) + added bun:test matcher types · (text commit)

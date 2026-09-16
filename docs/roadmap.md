# Roadmap — `@sukuna/ui` from first commit to npm

> **This file is a living status board.** Agents update it in the same commit as the work it describes: flip a box when a gate passes, never before. If this file and the code disagree, the code is the truth and this file is a bug to fix immediately.
>
> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[-]` dropped (say why)

Last updated: 2026-09-16 — Phase 0 (Repo bootstrap) complete.
Current phase: **Phase 1 — Tokens** (next). Phase 0 done; 2–9 pending.
Current version: none published. Target for first publish: `0.1.0`.

---

## A. Phase gates (from `plan-agentic.md`)

| # | Phase | Status | Gate | Evidence (link/commit) |
|---|---|---|---|---|
| 0 | Repo bootstrap | [x] | `bun run build` + `check:pkg` pass on empty entry; `CLAUDE.md`, PR template exist | local: `build`→ESM/CJS/d.ts/d.cts; `check:pkg` (publint --strict + attw) exit 0; `check` (biome+tsc) exit 0 |
| 1 | Tokens | [ ] | `tokens:build` deterministic; Tokens story shows both themes | |
| 2 | Storybook + test harness | [ ] | Storybook opens with theme toolbar; `bun test` runs; 90% threshold proven to fail | |
| 3 | Styling primitives | [ ] | `theme.css`, `cn`, `tv` wrappers; `docs/styling.md`; `css:build` emits fallback CSS | |
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

| Component | Doc | Styles | Logic | Index | Tests | Stories | Browser | Export | ≥90% | Review |
|---|---|---|---|---|---|---|---|---|---|---|
| Text | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] |
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
| `src/utils/cn.ts` | [ ] | `extendTailwindMerge` with custom theme keys |
| `src/utils/tv.ts` | [ ] | `tailwind-variants` with same merge config |
| `src/styles/theme.css` | [ ] | `@theme inline` + `[data-theme]` palettes, generated from `src/tokens.ts` |
| `src/styles/fallback.css` → `dist/styles.css` | [ ] | Precompiled path for non-Tailwind consumers |
| `test/setup.ts`, `test/ssr.ts`, `test/axe.ts` | [ ] | |
| `test/browser/setup.ts` | [ ] | Playwright inside `bun test` |
| `scripts/with-react.ts` | [ ] | React 18 matrix |
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

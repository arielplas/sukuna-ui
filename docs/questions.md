# Design Q&A log

Questions asked by the project owner during the design phase, with the answers given. Append to this file as new questions come up.

---

## Q1. Show me the trade-offs between different styling approaches (Tailwind, Panda, etc.) for a published, SSR-capable library.

**Answer.** For a public npm package the deciding factors are: does it work with zero consumer config, does it SSR without a runtime, and can tokens be overridden.

| Approach | Runtime | SSR / RSC | Consumer must do | Verdict |
|---|---|---|---|---|
| Plain CSS + custom properties + `cva` | 0 | ✅ | Import one CSS file | Safest, was the initial recommendation |
| Vanilla Extract | 0 | ✅ | Import one CSS file | Typed tokens; files must be `*.css.ts` |
| Tailwind v4 + `tailwind-variants` | 0 | ✅ | Have Tailwind, add `@import` + `@source`; or use precompiled fallback | **Chosen** |
| Panda CSS | 0 | ✅ | Panda in their build if we ship recipes | Poor library story |
| StyleX | 0 | ✅ | Compiler plugin in their build | Poor library story |
| Linaria / Pigment | 0 | ✅ | Import one CSS file | Viable, small ecosystem |
| styled-components / Emotion | JS runtime | ⚠️ style registry, forces `'use client'`, hydration risk | Per-framework setup | Rejected |

Full table with the "fits `.styles.tsx`" and "runtime override" columns is in `plan-agentic.md` §1.

---

## Q2. Which behavior base for interactive components? Explain this a little more.

**Answer.** A Button is easy: native `<button>` gives focus, keyboard, and screen-reader semantics for free. Dialog, Tooltip, Select, Combobox, Menu are not: focus trapping, arrow-key navigation, `aria-*` wiring, portals, click-outside, escape, typeahead, scroll lock, iOS Safari quirks.

- **Hand-rolled**: write all of that yourself. Full control, zero deps, months of edge cases you own.
- **Headless library** (Base UI, React Aria, Radix): behavior with no styles; you only write `.styles.tsx`. This is how shadcn/ui works. Cost: a dependency and an API shaped by theirs.
- **Hybrid** (recommended, adopted as default): native for Button/Input/Checkbox/Switch/Badge/Card/Text; headless for Dialog/Tooltip/Select. Maps cleanly to the `logic.tsx` / `styles.tsx` split.

Default base: Base UI. Radix is in maintenance; React Aria is the fallback.

---

## Q3. Single package or monorepo — what do you mean?

**Answer.** A **monorepo** splits the project into several npm packages (`@sukuna/tokens`, `@sukuna/ui`, `@sukuna/icons`) in one repo using Bun workspaces. A **single package** is one `@sukuna/ui` that ships everything.

Monorepo pays off when someone wants tokens without React, or icons get heavy. For v1 with ten components it is only extra config. Decision: single package, with the split noted as a later migration path.

---

## Q4. Why do props extend the native element (`ComponentPropsWithoutRef<'button'>`) and add only what native lacks?

**Answer.** Extending the native element means `onClick`, `type`, `disabled`, `form`, `aria-*`, `data-*`, `id`, `tabIndex` all work with correct types without declaring them one by one. Consumers can do anything they could with a raw `<button>`, so "your Button doesn't support X" never happens. We add only what native lacks (`variant`, `size`, `loading`). `WithoutRef` because the ref is typed separately by `forwardRef`. Same rule for every component: Input → `'input'`, Card → `'div'`, etc.

---

## Q5. Let's use Tailwind. (Decision, not a question, but it changed the answers above.)

**Consequences.** Tailwind consumers add two lines to their CSS (`@import "@sukuna/ui/theme.css"` and `@source "../node_modules/@sukuna/ui/dist"`). Non-Tailwind consumers import a precompiled `styles.css` (second-class: not purged, override only via `--sk-*` vars). `.styles.tsx` uses `tv()` from `tailwind-variants`; `cn` uses `tailwind-merge`. Theming stays `data-theme` via `@theme inline` so no `dark:` variant is needed. Details in `plan-agentic.md` §1 and `tokens.md`.

---

## Q6. Thoughts on how to handle versioning?

**Answer.** Changesets + semver, plus three things semver leaves open for a UI library.

**What counts as breaking:**

| Change | Bump |
|---|---|
| Removing/renaming a prop, variant, export, or CSS entry (`theme.css`, `styles.css`) | major |
| Changing a default value of a prop | major |
| Visual change that alters layout (height, padding, token value) | major, or minor with a note if it is a fix toward the design spec |
| Renaming a `--sk-*` token | major |
| Adding a prop, variant, component, or token | minor |
| Bug fix with no API or layout change, a11y fix | patch |
| Raising minimum React or Tailwind peer version | major |
| Internal Base UI bump with no API change | patch |

**Pre-1.0:** stay on `0.x` until all ten v1 components ship and are used in one real app. On `0.x`, minor = breaking, patch = everything else. `1.0.0` means the props API and token names are stable.

**Channels:** `latest` from `main` via the Changesets GitHub Action (Version Packages PR; merge publishes, still gated on explicit owner approval). `next` for pre-releases during breaking work (`bunx changeset pre enter next`). Every PR needs a changeset (empty allowed for docs/CI).

**Also:** deprecation window of one minor (`@deprecated` JSDoc + dev-only console warning) before removal in the next major; visual regression in CI (Storybook + Chromatic or Playwright screenshots) to catch patches that are really majors.

---

## Q7. This versioning works — how do we make sure our agents follow it?

**Answer.** Don't rely on agents reading the doc; make the wrong bump fail mechanically. Three layers:

1. **Context the agent can't miss.** `CLAUDE.md` (and `AGENTS.md`) at repo root with the core rules and the breaking-change table, linking to `docs/`.
2. **CI that classifies independently of the agent.**
   - API surface diff (`api-extractor` or committed `.d.ts` snapshot): removed/renamed export or prop + non-major changeset → fail.
   - Visual regression (Chromatic / Playwright): pixel diff + `patch` changeset → fail.
   - Token diff script: removed/renamed `--sk-*` in `dist/theme.css` + non-major → fail.
   - Peer-range diff: `peerDependencies` changed + non-major → fail.
   - `changeset-bot` requires a changeset on every PR (`no-release` label for empty).
   - `publint`, `attw`, `size-limit`.
3. **Human gates.** Agents open PRs, never push to `main`; the "Version Packages" PR is reviewed by the owner; `npm publish` runs only from an owner-created tag. PR template asks the agent to state the bump and why.

---

## Q8. Add `component.test.tsx` — any libraries you recommend?

**Answer.** The file was already in the contract; the spec now lives in `docs/testing.md`. Stack for the unit layer, all under `bun test`: `@happy-dom/global-registrator` (DOM), `@testing-library/react` + `user-event` + `jest-dom` (render, real interactions, matchers), `axe-core` + `jest-axe` (a11y), `react-dom/server` + `hydrateRoot` (SSR + hydration checks). Browser-only behavior (focus traps, portals) stays in Storybook `play` tests with Playwright. Avoid Enzyme and HTML snapshot tests; assert roles/attributes/behavior, not class strings.

---

## Q9. Make sure we add tests and have at least 90% coverage.

**Answer.** Enforced, not aspirational: `coverageThreshold = { line = 0.9, function = 0.9, statement = 0.9 }` in `bunfig.toml` makes `bun test` fail below the floor, locally and in CI. Measured on logic, styles, hooks, and utils; stories, barrel files, tokens, and test helpers are excluded so the number stays honest. Per-component floor of 90% on its own files before merge. Coverage may never be raised by excluding component code. Details in `docs/testing.md` § Coverage policy; every phase gate in `plan-agentic.md` now includes it.

---

## Q10. "wdym?" on the `danger` question → resolved: forget about danger.

**Answer given.** Sukuna has one red (crimson, the primary action). A `danger` button sharing it would look identical to `primary` on the same screen; alternatives were an outline red, a second red token, or dropping it. **Decision: drop `danger` from v1.** Also decided in the same message: no `premium` Button variant; light palette approved.

---

## Q11. Collapse to one test runner → `bun test` only.

**Decision.** `bun test` is the single runner. Storybook's vitest addon is dropped; stories are fixtures. Real-browser behavior (Dialog focus trap, Select typeahead, Tooltip positioning) is still tested, but as `bun test` files in `test/browser/` that use Playwright's library API against `storybook-static`. Visual regression is Chromatic on the Storybook build. Coverage is measured on the unit suite only. Details in `docs/testing.md`.

---

## Q12. (Agent → owner) Light-mode `--sk-shadow-card` value?

**Context.** `docs/tokens.md` gives the dark card shadow exactly
(`0 30px 60px -24px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.06)`) but describes light only
as "softer" — no value. Phase 1 needs a concrete light value.

**Proposed (in use, pending approval).** `0 20px 40px -24px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.06)`
— same geometry, shallower spread, a dark hairline instead of a white one. Implemented in
`src/tokens.ts` (`shadows.card.light`) and generated into `src/styles/tokens.css`; a
`// see Q12` marker points here. Tune or replace on review; changing it pre-1.0 is a patch.

**Status:** waiting on owner.

---

## Decisions recorded so far

| Topic | Decision |
|---|---|
| Design source | Pomo Design System (Sukuna language) as base |
| Package name | `@sukuna/ui` |
| v1 components | Text, Badge, Card, Button, Input, Checkbox, Switch, Tooltip, Dialog, Select |
| Docs language | English |
| Package layout | Single package |
| Theming | `data-theme="dark"` (default) / `"light"` via CSS vars |
| Consumer target | Any React 18+ app (Vite, Remix, Next) |
| Styling engine | Tailwind v4 + `tailwind-variants` |
| Dev environment | Storybook 10 (`docs/storybook.md`) |
| Versioning | Changesets + semver, `0.x` until v1 components ship, `latest`/`next` channels, breaking-change table in Q6 |
| Testing | Single runner `bun test`: Testing Library + jest-axe + SSR helpers for unit; Playwright library inside `bun test` for browser (Q8, Q11, `docs/testing.md`) |
| Coverage | ≥ 90% lines/functions/statements, enforced by `bunfig.toml` threshold and CI (Q9) |
| Button variants | `primary`, `secondary`, `ghost` only; no `premium`, no `danger` (Q10) |
| Light palette | Approved as proposed in `tokens.md` (Q10) |
| Status tracking | `docs/roadmap.md` living board; agents update it in the same commit as the work (rule 9) |
| Versioning enforcement | CLAUDE.md + CI classifiers (API diff, visual, token, peer) + human-only merge/publish (Q7) |

## Questions still waiting on the owner

| # | Question | Status |
|---|---|---|
| Q12 | Light-mode `--sk-shadow-card` value — approve the proposed softer shadow or supply one? | Proposed value in use; awaiting approval. Non-blocking (patch to change pre-1.0). |

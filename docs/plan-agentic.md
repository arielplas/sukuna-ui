# @sukuna/ui — Agentic Development Plan

> Audience: an AI coding agent (Claude Code) executing phases autonomously.
> Every phase has a **Done when** gate. Do not start the next phase until the gate passes.
> Never `git push` unless the human explicitly says so.

---

## 0. Project constants

| Key | Value |
|---|---|
| Package name | `@sukuna/ui` |
| Runtime / PM / tests | Bun (never Node scripts, never npm/pnpm) |
| Language | TypeScript, `strict: true` |
| UI | React, peer range `>=18` (must work on 18 and 19) |
| Consumer targets | Vite, Remix, Next.js (Pages + App Router), any React 18+ SSR or CSR app |
| SSR | Mandatory. Zero runtime styling. No `window`/`document` at module scope. |
| Theming | `data-theme="dark"` (default, brand) and `data-theme="light"` via CSS custom properties |
| Design source | Sukuna design system (see `docs/tokens.md`) |
| Docs location | `docs/*` only. One `docs/component-<name>.md` per component. Q&A log in `docs/questions.md`. Status board in `docs/roadmap.md`. |
| Component layout | `src/components/<name>/{<name>.styles.tsx, <name>.logic.tsx, index.tsx}` |
| Publishing | npm, public, ESM + CJS + `.d.ts`, `sideEffects` only for CSS |

### Component file contract

```
src/components/button/
├── button.styles.tsx   # class-name / variant map ONLY. No hooks, no state, no DOM.
├── button.logic.tsx    # hook(s) + the React component. Imports from .styles. Owns behavior + a11y.
├── button.test.tsx     # bun test; must cover the 8 points in docs/testing.md
├── button.stories.tsx  # Storybook
└── index.tsx           # export { Button } from './button.logic'; export type { ButtonProps }
```

Rules:
- `*.styles.tsx` is pure: exports a variant function and class-name constants. Importable on the server.
- `*.logic.tsx` starts with `'use client'` only if it uses hooks/state/event handlers. Static components (Text, Badge, Card) must NOT carry the directive so they work inside React Server Components.
- Components use `React.forwardRef` (React 18) — do not rely on React 19 `ref`-as-prop.
- Export every component with the user's signature:
  ```tsx
  import React, { FC } from 'react'
  export const Button: FC<ButtonProps> = (props) => { ... }
  ```
  (wrapped in `forwardRef` where a ref is meaningful).
- Props extend the native element: `ComponentPropsWithoutRef<'button'>` + only what native lacks.
- Styling is Tailwind v4 utilities composed with `tailwind-variants` in `*.styles.tsx`. No custom class names, no per-component CSS files. Colors/spacing/radius come from the `@theme` tokens in `src/styles/theme.css`, never raw hex in a utility.

---

## 1. Styling engine — decision record (OPEN, human decides)

The library must SSR and must be zero-config for consumers. Ranked by fit:

| # | Option | Runtime | SSR/RSC | Consumer setup | Token override at runtime | Fits `.styles.tsx` | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Plain CSS + custom properties + `cva` | 0 | ✅ server-safe | `import '@sukuna/ui/styles.css'` | ✅ redefine `--sk-*` under any selector | ✅ `cva()` map | Was the recommendation; not chosen |
| 2 | Vanilla Extract | 0 (extracted at lib build) | ✅ | import CSS once | ✅ via `createTheme` contract | ⚠️ files must be `*.css.ts` | Strong alternative; typed tokens |
| 3 | **Tailwind v4 + `tailwind-variants`** | 0 | ✅ | Consumer needs Tailwind + `@source` pointing at `node_modules/@sukuna/ui` | Via `@theme` + `--sk-*` vars | ✅ | **CHOSEN** (human decision, 2026-09-16) |
| 4 | Panda CSS | 0 | ✅ | Recipes require Panda in consumer build; precompiled loses overrides | ⚠️ | ✅ | Poor library story |
| 5 | StyleX | 0 | ✅ | Babel/SWC plugin in consumer build | ⚠️ | ✅ | Poor library story |
| 6 | Linaria / Pigment | 0 | ✅ | import CSS once | ⚠️ limited | ✅ | Viable, smaller ecosystem |
| 7 | styled-components / Emotion | JS runtime | ⚠️ needs style registry, forces `'use client'` everywhere, hydration risk | Registry per framework | ✅ | ❌ Reject |

Decision criteria (in priority order): (a) consumer installs and it works with one CSS import, (b) light/dark and brand overrides via CSS vars, (c) works in RSC without `'use client'` on static components, (d) matches the `.styles.tsx` convention.

**Decision: Option 3, Tailwind v4 + `tailwind-variants`.** Consequences the agent must honor:

- **Tailwind consumers (primary path).** Their global CSS adds:
  ```css
  @import "tailwindcss";
  @import "@sukuna/ui/theme.css";                 /* @theme tokens + data-theme palettes */
  @source "../node_modules/@sukuna/ui/dist";      /* so their build emits our utilities */
  ```
  We ship **no compiled component CSS** on this path; their Tailwind generates exactly the classes used.
- **Non-Tailwind consumers (fallback path).** We also publish `@sukuna/ui/styles.css`: Tailwind run over our own `src/` at build time, with `theme.css` inlined. Not purged, tokens overridable only via `--sk-*` vars. Documented as supported but second-class.
- **Prefix.** None. Tailwind v4 prefixes are set by the consumer's `@import`, so a library prefix would break their build. Collision risk is with consumer utilities only, which is fine because both sides mean the same thing.
- **Tokens.** `src/styles/theme.css` declares `@theme { --color-surface: var(--sk-surface); ... }` and the `[data-theme]` blocks that set `--sk-*`. Utilities are therefore `bg-surface`, `text-accent`, `rounded-lg` (mapped to `--sk-radius-lg`), and switch with `data-theme` at runtime without Tailwind's `dark:` variant.
- **`cn`.** `tailwind-merge` + `clsx`; extend `twMerge` with the custom theme keys so `bg-surface` vs `bg-surface-2` merge correctly.
- **Dependencies.** `tailwind-variants`, `tailwind-merge`, `clsx` → `dependencies`. `tailwindcss` → `peerDependencies` (`>=4`, optional via `peerDependenciesMeta`) and `devDependencies`.
- **Class strings must be static.** Tailwind scans source text; never build class names by interpolation (`bg-${color}`), always enumerate them in `tv()` variants.

### Interactive-behavior base — decision record (OPEN)

| Option | Cost | Benefit |
|---|---|---|
| Hand-rolled | Own every a11y edge case (focus trap, roving tabindex, typeahead, iOS Safari) | Zero deps, smallest bundle |
| Headless (Base UI / React Aria / Radix) | Peer dep, API shaped by theirs, bundle weight | Battle-tested a11y, ship Dialog/Select/Tooltip in days |
| **Hybrid** (recommended) | Two mental models | Native for Button/Input/Checkbox/Switch/Badge/Card/Text; headless for Dialog/Tooltip/Select |

Default assumption: Hybrid with **Base UI** (`@base-ui-components/react`). Radix is in maintenance; React Aria is the fallback if Base UI's API is unstable at build time — verify current status before Phase 6.

---

## 2. Phases

### Phase 0 — Repo bootstrap
Deliverables:
- `bun init`, `package.json` with `"type": "module"`, `"name": "@sukuna/ui"`, `"files": ["dist"]`, `"sideEffects": ["**/*.css"]`
- `peerDependencies`: `react >=18`, `react-dom >=18`. Same in `devDependencies` pinned to 19 for local dev. Add a `bun run test:react18` script that swaps to 18 (see Phase 8).
- `exports` map:
  ```json
  {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./styles.css": "./dist/styles.css",
    "./tokens.css": "./dist/tokens.css",
    "./package.json": "./package.json"
  }
  ```
- `tsconfig.json`: `jsx: react-jsx`, `moduleResolution: bundler`, `strict`, `declaration`, `noUncheckedIndexedAccess`.
- Biome for lint + format. Husky-free: use `bun run check` in CI only.
- Build: `tsup` via `bunx tsup` (Bun's bundler does not emit `.d.ts`). Config: `entry: ['src/index.ts']`, `format: ['esm','cjs']`, `dts: true`, `external: ['react','react-dom']`, `treeshake: true`, `banner` that preserves `'use client'` directives (tsup `esbuildOptions` → `banner` per entry, or `preserveDirectives` plugin — verify).
- `publint` + `@arethetypeswrong/cli` as `bun run check:pkg`.
- `.changeset/` initialized.
- `docs/` folder with this file, `plan-human.md`, `tokens.md`, `questions.md`, `roadmap.md`.
- `CLAUDE.md` and `AGENTS.md` at repo root: the operating rules from §3, the breaking-change table from `docs/questions.md` Q6, and links to every `docs/*` file. Keep them under 150 lines; they are read every session.
- `.github/PULL_REQUEST_TEMPLATE.md` with a checklist: changeset added, bump level and one-line justification, docs updated, `roadmap.md` boxes flipped + update log line, `questions.md` updated if the human asked anything.

**Done when:** `bun run build` produces `dist/` with ESM, CJS, `.d.ts`; `bun run check:pkg` passes with zero errors on an empty `src/index.ts`.

### Phase 1 — Tokens
Deliverables:
- `src/styles/tokens.css` defining `--sk-*` custom properties under `:root, [data-theme="dark"]` (dark is default) and `[data-theme="light"]`.
- Token groups: color (semantic, not raw), typography (font families, size scale, weights, letter-spacing), spacing scale, radius scale, shadow, motion (durations, easings), z-index.
- Values come from `docs/tokens.md`. Light palette is **proposed**; flag for human approval.
- `src/styles/reset.css` — minimal, scoped to `.sk-*` where possible (no global resets that fight the consumer).
- `src/styles/index.css` imports tokens + reset + every component CSS (appended per component in later phases).
- `src/tokens.ts` — the same values as a typed TS object (`as const`) for consumers who need them in JS. Generate `tokens.css` FROM `tokens.ts` with a Bun script so there is one source of truth.

**Done when:** `bun run tokens:build` regenerates `tokens.css` deterministically; a Storybook "Tokens" page renders every swatch in both themes.

### Phase 2 — Storybook + test harness
- Storybook 10 per `docs/storybook.md` (React + Vite builder, theme toolbar, a11y + docs addons, Sukuna-themed manager). Stories are fixtures; no test addon.
- Single runner `bun test` per `docs/testing.md`: happy-dom preload, Testing Library (`react`, `user-event`, `jest-dom`), `jest-axe`, shared `test/ssr.ts` and `test/axe.ts` helpers, `test:react18` script, and the `test/browser/` suite (Playwright library inside `bun test`, run against `storybook-static`).

**Done when:** `bun run storybook` starts; `bun test` runs a passing placeholder SSR test and the 90% `coverageThreshold` in `bunfig.toml` is active (verify by adding an uncovered function and watching the run fail).

### Phase 3 — Styling primitives
- Install `tailwindcss@4`, `@tailwindcss/vite` (Storybook only), `tailwind-variants`, `tailwind-merge`, `clsx`.
- `src/styles/theme.css`: `@theme` block mapping Tailwind namespaces to `--sk-*` (colors, fontFamily, fontSize, spacing, radius, shadow, ease, duration) + the `[data-theme]` palettes generated from `src/tokens.ts`.
- `src/utils/cn.ts`: `extendTailwindMerge` with the custom color/radius keys, then `twMerge(clsx(...))`.
- `src/utils/tv.ts`: re-export `tv` from `tailwind-variants` with `twMergeConfig` set to the same extension.
- Build step `bun run css:build`: runs `@tailwindcss/cli -i src/styles/fallback.css -o dist/styles.css` where `fallback.css` is `@import "tailwindcss"; @import "./theme.css"; @source "../components";`. Copy `theme.css` to `dist/theme.css` unchanged.
- Add `"./theme.css"` and `"./styles.css"` to the `exports` map (replace the `tokens.css` entry).
- `src/utils/create-variants.ts` — thin wrapper so every `.styles.tsx` looks identical.
- Document the pattern in `docs/styling.md` with the trade-off table from Section 1 copied in.

**Done when:** `docs/styling.md` exists; a dummy `.styles.tsx` compiles and is importable in an RSC test.

### Phase 4 — Static components (no client directive)
Order: **Text → Badge → Card**.
For each: write `docs/component-<name>.md` FIRST (API, variants, a11y, states), then styles → logic → index → tests → stories.

**Done when (per component):** doc approved by human, SSR test passes, axe passes, ≥ 90% line/function/statement coverage on the component's own files, story renders both themes, exported from `src/index.ts`.

### Phase 5 — Native interactive components
Order: **Button → Input → Checkbox → Switch**.
Same loop as Phase 4. These carry `'use client'` only when they hold state (Button `loading`, Switch controlled/uncontrolled). Uncontrolled + controlled support via a shared `useControllableState` hook in `src/hooks/`.

**Done when:** all four exported; keyboard and screen-reader behavior verified in tests; ≥ 90% coverage per component; React 18 and 19 both pass.

### Phase 6 — Headless-backed components
Order: **Tooltip → Dialog → Select**.
- Install chosen headless base as a **dependency** (not peer) unless its own docs require peer.
- `.logic.tsx` composes the headless primitives; `.styles.tsx` styles their rendered parts (use `data-*` state attributes the primitive exposes).
- Portals: must render into `document.body` on client only; SSR renders nothing for the floating part.

**Done when:** each passes SSR smoke test, axe, and a `test/browser/<name>.test.ts` covering focus-trap/escape/outside-click; ≥ 90% coverage on `logic.tsx`/`styles.tsx` (use `renderHook` for branches the DOM can't reach); bundle-size diff recorded in the component doc.

### Phase 7 — Public API, tree-shaking, size budget
- `src/index.ts` re-exports; verify a Vite consumer importing only `Button` does not pull Dialog (use `bunx agadoo` or a size-limit check).
- Add `bun run size` with per-export budget.

**Done when:** importing `Button` alone yields < 3 kB gzipped JS (excluding React).

### Phase 8 — Consumer matrix
Create `examples/` (not published): `vite-react18`, `vite-react19`, `nextjs-app-router`, `remix`. Each installs `@sukuna/ui` via `bun link`, renders every component, and has a Playwright smoke test that asserts no hydration warnings in console.

**Done when:** all four examples build and pass.

### Phase 9 — Release
- Versioning per `docs/questions.md` Q6: Changesets + semver, `0.x` until all v1 components ship, breaking-change classification table, `latest` + `next` channels, one-minor deprecation window. Copy the table into `docs/releasing.md` and require a changeset on every PR (`changeset-bot`).
- Visual regression via Chromatic on the Storybook build; a diff blocks merge until acknowledged in the changeset.
- CI: lint, typecheck, `test:coverage` (fails below 90%, uploads lcov, PR comment with delta), build, `storybook:build`, `test:browser`, `check:pkg`, size, examples.
- **Version-bump enforcement jobs** (see `docs/questions.md` Q7), each reads the PR's changeset level and fails on mismatch:
  - `api-diff`: `api-extractor` report committed at `etc/ui.api.md`; any removal/rename requires `major`.
  - `visual-diff`: Chromatic or Playwright screenshots; any diff requires ≥ `minor` and an acknowledgment in the changeset body.
  - `token-diff`: Bun script diffs `--sk-*` names in `dist/theme.css` vs the last published version; removal/rename requires `major`.
  - `peer-diff`: `peerDependencies` change requires `major`.
  - `changeset-bot`: no changeset → blocked, unless label `no-release`.
- Branch protection: `main` requires PR + green CI + owner review. Agents never push to `main`. Publish runs only on an owner-created tag.
- Changesets release workflow; `npm publish --provenance --access public` via `bunx changeset publish`.
- `README.md` with install, CSS import, theming, RSC notes.
- **Do not push or publish without an explicit human instruction.**

**Done when:** `0.1.0` tag exists locally and the human has said "publish".

---

## 3. Agent operating rules

1. Read `docs/plan-human.md`, this file, and `docs/roadmap.md` at the start of every session. `roadmap.md` tells you where the project actually is; start from its first unchecked box, not from the top of this plan.
2. Before implementing a component, its `docs/component-<name>.md` must exist and follow the template in `docs/component-button.md`.
3. Never introduce a runtime CSS-in-JS dependency. Never write a `.css` file per component; if a style can't be expressed with utilities, add a `@utility` to `theme.css` and use it.
3a. Never interpolate class names. Every utility string must appear literally in source.
4. Never reference `window`, `document`, `navigator`, or `localStorage` outside `useEffect`/event handlers.
5. Every PR-sized unit of work ends with: `bun run check && bun test --coverage && bun run build && bun run check:pkg`. Coverage below 90% on any metric is a failed unit of work; fix it before moving on, never by excluding component code from coverage.
6. When a decision marked OPEN in Section 1 is still unresolved, use the default assumption and leave a `// DECISION(open): ...` comment at the touch point.
7. Ask the human, do not guess, when a design token is missing from `docs/tokens.md`.
8. Classify every change with the breaking-change table in `docs/questions.md` Q6 before writing the changeset, and state the reasoning in the PR template. If CI's `api-diff`/`visual-diff`/`token-diff` disagrees with your classification, CI is right: raise the bump or fix the regression, never edit the check.
9. **Keep `docs/roadmap.md` current in the same commit as the work.** When a gate passes, flip its box and add the evidence link; when a component column is completed, flip it; append one line to the update log. Never flip a box ahead of the evidence. A PR that changes component code or passes a gate without touching `roadmap.md` is incomplete; the PR template asks for it.
10. **Log every question the human asks** in `docs/questions.md`, in the same session it is asked: the question as worded, the answer given, and any decision it produced. Update the "Decisions recorded so far" and "Questions still waiting on the owner" tables in that file whenever either changes. Questions the agent asks the human go in the "waiting" table until answered.

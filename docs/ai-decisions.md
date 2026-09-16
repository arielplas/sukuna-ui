# AI decisions log

Decisions the AI agent made on its own while building `@sukuna/ui`, because the plan left
them open, a spec was wrong, or a value was missing. Each entry: what was decided, why, and
how to reverse it. Owner-made decisions live in `docs/questions.md`; this file is only the
agent's own calls. Newest first.

> If you disagree with any entry, say so — most are cheap to change (noted per entry).

---

## D12 — happy-dom registration split into its own preload

- **Decision:** Two preloads in `bunfig.toml`: `test/register-dom.ts` (registers happy-dom) then
  `test/setup.ts` (imports Testing Library, registers matchers). Was one `setup.ts`.
- **Why:** `@testing-library/dom` binds `screen` to `document.body` at import/eval time. ES imports
  hoist above the module body, so `GlobalRegistrator.register()` in the same file ran *after* the
  Testing Library import — `screen` bound before `document` existed and every `screen.*` query threw
  "a global document has to be available". `render` (attaches at call time) hid the bug until the
  first `screen` test. Separate preloads evaluate fully in order, so registration completes first.
- **Reverse:** n/a (correctness fix).

## D11 — `attw` excludes the CSS entrypoints

- **Decision:** `check:pkg` runs `attw --pack . --exclude-entrypoints theme.css styles.css tokens.css`.
- **Why:** `@sukuna/ui/theme.css` / `styles.css` / `tokens.css` are stylesheets with no type
  declarations, so attw's "resolves to types or JS" check fails on them (NoResolution). Excluding
  the CSS-only entrypoints is correct — they aren't importable JS. publint still validates the
  files exist.
- **Reverse:** n/a — CSS exports never have types.

## D10 — Tailwind spacing namespace NOT remapped to `--sk-space`

- **Decision:** The `@theme inline` mapping maps colors, font family/size, leading, tracking,
  radius, shadow, duration, ease — but **not** spacing. Tailwind's default numeric spacing scale
  stays (`h-10`, `px-5`, `gap-2`).
- **Why:** The Button doc (the concrete contract) sizes with `h-8/h-10/h-12` (= 32/40/48px) and
  `px-3/px-5/px-6`, i.e. Tailwind defaults, which already hit the Sukuna pixel targets. Remapping
  `--spacing` to the 1–8 token scale would break those utilities. `--sk-space-*` remain available
  as raw CSS vars. The plan listed "spacing" in the mapping generically; the component contract wins.
- **Reverse:** Add a spacing block to the `@theme` mapping in `scripts/build-tokens.ts` and update
  component size utilities. Would be a visual/major change.

## D9 — `create-variants.ts` folded into `tv.ts`

- **Decision:** No separate `src/utils/create-variants.ts`. `src/utils/tv.ts` is the single
  variant wrapper (exports `tv` + `VariantProps`), which is exactly what `docs/component-button.md`
  imports (`from '../../utils/tv'`).
- **Why:** The plan listed both `tv.ts` and `create-variants.ts`, but the Button contract only uses
  `tv.ts`. Two files doing the same thing invites drift. `tw-merge-config.ts` holds the shared merge
  config used by both `tv` and `cn`.
- **Reverse:** Add `create-variants.ts` re-exporting from `tv.ts` if a distinct helper is wanted.

## D8 — Fallback and Storybook CSS both use `@source "../components"`

- **Decision:** `fallback.css` (→ `dist/styles.css`) and `storybook.css` both do
  `@import "tailwindcss"; @import "./theme.css"; @source "../components";`.
- **Why:** Both need Tailwind to emit the utilities the components actually use. `@source` points
  the scanner at the component source. Until components exist (Phase 4+), `dist/styles.css` is just
  the Tailwind base + theme layer, growing as components land.
- **Reverse:** n/a.

---

## D7 — Component docs are self-approved during the non-stop build

- **Decision:** Per the owner's "build non-stop" instruction (2026-09-16), each
  `docs/component-<name>.md` is written first (docs-first rule intact) and self-approved by the
  agent instead of blocking for owner sign-off. Design choices inside each doc are logged here.
- **Why:** Owner explicitly asked for a continuous build and for agent decisions to be recorded
  here rather than gated.
- **Reverse:** Owner reviews any component doc/Storybook and requests changes; treated as a
  normal patch/minor per the breaking-change table.

## D6 — Storybook loads raw tokens until Phase 3

- **Decision:** In Phase 2, `.storybook/preview.tsx` imports `src/styles/index.css` (tokens +
  reset). Tailwind (`@tailwindcss/vite`) and `theme.css` are added in Phase 3 as the plan
  sequences them.
- **Why:** `theme.css` (the `@theme` mapping) doesn't exist until Phase 3; wiring Tailwind
  earlier would reference a missing file.
- **Reverse:** n/a — Phase 3 switches preview to the Tailwind-aware `storybook.css`.

## D5 — Storybook telemetry disabled

- **Decision:** `core.disableTelemetry: true` in `.storybook/main.ts`.
- **Why:** Privacy-preserving default; avoids build/dev phoning home. No downside for this repo.
- **Reverse:** Remove the flag.

## D4 — `Intro.mdx` deferred to the README (Phase 9)

- **Decision:** Only `Tokens.mdx` ships in Phase 2; `Intro.mdx` (which `docs/storybook.md` says
  "mirrors README") is written in Phase 9 when the README exists.
- **Why:** Avoid duplicating a not-yet-written README.
- **Reverse:** Add `src/stories/Intro.mdx` earlier if desired.

## D3 — Coverage floor uses the scalar `coverageThreshold`, not the object form

- **Decision:** `bunfig.toml` uses `coverageThreshold = 0.9` (scalar).
- **Why:** Bun 1.3.12 **silently ignores** the per-metric object form
  `{ line, function, statement }` that `docs/testing.md` originally specified — it parses but
  never fails the run (verified: funcs 100% / lines 50% passed with the object form, failed with
  the scalar). The scalar form checks both functions and lines. A silently-disabled gate is worse
  than none. Documented in `bunfig.toml` and `docs/testing.md`.
- **Reverse:** If Bun fixes the object form, switch back for per-metric granularity.

## D2 — `jest-axe` matcher must be spread in `test/setup.ts`

- **Decision:** `expect.extend({ ...jestDom, ...toHaveNoViolations })`.
- **Why:** `jest-axe` exports `toHaveNoViolations` as `{ toHaveNoViolations: fn }`. The plan's
  snippet nested it, which Bun rejects as "not a valid matcher". Corrected in code + doc.
- **Reverse:** n/a (bug fix).

## D1 — `exports` for CSS deferred; `@types/bun` added; `engines.node` set

- **Decision:** The Phase 0 `exports` map ships only `.` and `./package.json`; `./styles.css`
  and `./theme.css` are added in Phases 1/3 when those files exist. Added `@types/bun` (dts build
  needs it) and `engines.node: ">=18"` (publint suggestion).
- **Why:** publint errors on `exports` pointing at non-existent files, which would fail the
  Phase 0 gate. The later phases add the CSS exports anyway.
- **Reverse:** n/a — follows the plan's own later phases.

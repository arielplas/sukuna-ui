# AI decisions log

Decisions the AI agent made on its own while building `sukuna-ui`, because the plan left
them open, a spec was wrong, or a value was missing. Each entry: what was decided, why, and
how to reverse it. Owner-made decisions live in `docs/questions.md`; this file is only the
agent's own calls. Newest first.

> If you disagree with any entry, say so — most are cheap to change (noted per entry).

---

## D21 — Overlay z-index scale; z-index moves to the positioner

- **Decision:** Overlay stacking is a monotonic `--sk-*` token scale — `dialog: 50` < `popover: 60`
  < `toast: 70` < `tooltip: 80` — and dropdown/tooltip components set their z-index on the Base UI
  **positioner**, not the inner popup. Added tokens `--sk-z-popover`, `--sk-z-toast`; moved
  `--sk-z-tooltip` from `40` → `80`. Dialog/Drawer/Toast now use `z-[var(--sk-z-*)]` instead of a
  literal `z-50`.
- **Why:** a Select/Menu/Combobox opened *inside* a Dialog rendered **behind** it. The `z-50` sat on
  `Base.Popup`, but the element portalled to `<body>` is `Base.Positioner`, which Floating UI gives
  a `transform` → its own stacking context, so the popup's z-index was trapped and `auto` (0) won at
  the body level, losing to the dialog's `z-50`. On a plain page nothing else has a positive
  z-index, so it only broke against a modal. Fix: z-index on the positioner, and a scale where
  popovers/tooltips sit above the dialog layer. Guarded by a Playwright test
  (`test/browser/dialog.test.ts`) that opens a Select inside a Dialog and asserts both the stacking
  order and that the option is clickable (not obscured).
- **Bump:** minor (adds tokens; pre-1.0 minor). `--sk-z-tooltip`'s value change is a stacking fix,
  not a layout change.
- **Reverse:** re-layer by overriding any `--sk-z-*`; the positioner is the correct anchor, don't
  move it back.

## D20 — Package renamed `@sukuna/ui` → `sukuna-ui` (unscoped)

- **Decision:** The npm package is **`sukuna-ui`** (unscoped), not `@sukuna/ui`. Owner's choice
  (2026-09-16) after the first publish 404'd.
- **Why:** Publishing `@sukuna/ui` needs an npm **org `sukuna`** that the account owns; it doesn't
  exist, so npm returned `E404 PUT @sukuna/ui`. The unscoped name `sukuna-ui` was free and needs no
  org. The design language stays "Sukuna" and tokens stay `--sk-*` — only the package specifier
  changed (all imports/docs updated).
- **Token note:** an unscoped publish needs `NPM_TOKEN` to allow it — a granular token must have
  **read/write on _all packages_** (a token restricted to the `@sukuna` scope will NOT publish an
  unscoped package), or use a classic **Automation** token.
- **Reverse:** to use a scope later, create the npm org and rename back (major-ish, pre-1.0 fine).

## D19 — Examples consume the library via `bun link`, not `file:`

- **Decision:** `examples/*` depend on `sukuna-ui` via `bun link` (`"sukuna-ui": "link:sukuna-ui"`),
  matching the plan.
- **Why:** a `file:../..` dependency copies the package honoring `.gitignore`, which **excludes the
  gitignored `dist/`** — so `sukuna-ui/styles.css` (and the JS) won't resolve. `bun link` symlinks
  the real repo directory, exposing the freshly built `dist/`. CI must `bun run build` then
  `bun link` before building examples.
- **Reverse:** publish a real version and depend on it once released.

## D18 — Select is prop-driven with string values (v1)

- **Decision:** Select takes an `items: {value: string; label; disabled?}[]` array with **string**
  values (single-select), plus `value`/`defaultValue`/`onValueChange` and `open`/`defaultOpen`/
  `onOpenChange`. Not compound; not arbitrary value types; not multiple-select. The `Value` renders
  the selected label or the placeholder via a render function.
- **Why:** covers the common case with the simplest API and avoids Base UI's `Value`/`Multiple`
  generics leaking to consumers. `open`/`defaultOpen` added so the open list is testable in
  happy-dom (and it's a useful control).
- **Reverse:** non-string values and multiple-select are additive (minor) post-1.0.
- **Icons inlined** (not sub-components) so their element creation is covered even while the popup
  is closed.

## D17 — Dialog is a compound component (`Dialog.*`)

- **Decision:** Dialog ships as `Dialog` (root) + `Dialog.Trigger/Content/Title/Description/Close`
  rather than a single prop-driven component. Wraps Base UI dialog parts and applies slot styles.
- **Why:** dialogs vary in content structure; a compound API composes naturally and lets Base UI
  wire `aria-labelledby`/`describedby` from the Title/Description parts. `Dialog.Close` accepts Base
  UI's `render` prop for a custom button.
- **Reverse:** additive.

## D16 — Browser tests run under `@playwright/test` (Node), not `bun test`

- **Decision:** The real-browser suite (`test/browser/*.test.ts`) runs under `@playwright/test` via
  Node (`playwright.config.ts`, served by `scripts/serve-storybook.ts`), not Playwright's library
  API inside `bun test` as `docs/questions.md` Q11 planned. `test:browser` = `storybook:build` then
  `playwright test`. Unit suite stays on `bun test src`.
- **Why:** Playwright's browser transport **hangs under Bun** on this platform (verified: full
  Chromium launches fine under Node, `chromium.launch()` never resolves under Bun — Bun's stdio-pipe
  handling for Playwright's driver). It's not a config issue. The unit-vs-e2e runner split is the
  conventional setup and keeps the browser gate actually executable.
- **Trade-off:** two test tools instead of one (Q11's "single runner" holds for the unit suite,
  which is what coverage measures). Browser specs use `@playwright/test`'s `test`/`expect`.
- **Reverse:** move back into `bun test` if/when Bun supports Playwright's transport.

## D15 — Native interactive component APIs (Input, Checkbox, Switch)

- **Input:** variant `size` (sm/md/lg) shadows and drops the native numeric `size` attribute
  (`Omit<…, 'size'>`); `invalid` sets `aria-invalid` + crimson border (Sukuna's one red, Q10); full
  width by default; no icon slots in v1 (plain `<input>`).
- **Checkbox:** native `<input type="checkbox">` tinted with `accent-color: var(--sk-accent)`
  (`accent-accent`) rather than fully custom `appearance-none` art — accessible, keyboard +
  indeterminate come from the platform, minimal CSS. Boolean API `onCheckedChange(checked)` +
  `indeterminate` (set as the DOM property via a merged ref callback, no `useEffect`).
- **Switch:** a `<button role="switch" aria-checked>` with a `tv()`-slots track + sliding thumb
  (thumb moves via `group-aria-checked:translate-x-*`), NOT a checkbox — so the thumb is fully
  custom while switch semantics/keyboard stay native to the button.
- Controlled/uncontrolled for Checkbox and Switch go through the shared `useControllableState`.
- **Why:** accessible-by-default, smallest CSS, consistent with the "extend native, add what's
  missing" rule. Custom checkbox art can come post-1.0.
- **Reverse:** custom `appearance-none` checkbox art, icon slots, etc. are additive (minor).

## D14 — Build emits per-file output (`bundle: false`) + `fix-directives` for `'use client'`

- **Decision:** tsup runs with `bundle: false`, transpiling each `src/` file to its own `dist/`
  output (mirroring structure), then `scripts/fix-directives.ts` re-adds `'use client'`/`'use server'`
  banners to the exact outputs whose source declared one. `build` = tokens → tsup → fix-directives → css.
- **Why:** RSC support requires each client component's `'use client'` to sit atop ITS OWN output
  file. Bundling everything into one `index.js` (the original single-entry config) merged client +
  server code and dropped the directive, which would force every consumer client-side and break RSC.
  `esbuild-plugin-preserve-directives` did not preserve directives in this tsup/esbuild version
  (verified: dropped in both bundled and unbundled modes), so it was removed. Per-file output also
  gives natural tree-shaking (Phase 7). esbuild keeps the directive in ESM output on its own; the
  script covers the CJS output and fails loudly if a client source produces no output.
- **Trade-off:** `dist/` has many small files and internal relative imports are **extensionless**.
  `check:pkg` (publint + attw, all resolution modes) passes, and the target consumers are bundlers
  (Vite/Next/Remix) that resolve extensionless fine. Revisit if native-Node-ESM consumers appear.
- **Reverse:** Return to a bundled single entry only if RSC support is dropped.

## D13 — Static component APIs (Text, Badge, Card) designed by the agent

The plan only named these three as "static"; the agent designed each API (self-approved per D7).

- **Text:** polymorphic over a fixed `as` allowlist of intrinsic tags (default `p`) rather than
  `asChild`; variants font/size/weight/tone/align/leading/tracking/truncate/numeric; native `color`
  omitted in favor of `tone`.
- **Badge:** `tone` (neutral/accent/success/premium) × `size` (sm/md), fixed pill radius, optional
  decorative `dot` in `currentColor`. No `count` helper.
- **Card:** `elevation` (flat/raised/sunken) × `padding` (none/sm/md/lg) × `radius` (md/lg). **No**
  clickable/`interactive` Card and **no** `Card.Header/Body/Footer` sub-components in v1 — wrap in a
  Button/Link for clicks; compose content with Text + layout utilities.
- **Why:** Smallest APIs that cover real use, consistent with the Button doc's "extend the native
  element, add only what's missing" and "a clickable X is a Link" rules.
- **Reverse:** Adding props/variants/sub-components later is a minor bump; changing defaults is major.

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
- **Why:** `sukuna-ui/theme.css` / `styles.css` / `tokens.css` are stylesheets with no type
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

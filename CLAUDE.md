# sukuna-ui — operating rules

Read this every session, then `docs/plan-human.md`, `docs/plan-agentic.md`, and
`docs/roadmap.md`. **Start from the first unchecked box in `docs/roadmap.md`**, not the top
of the plan. If the roadmap and the code disagree, the code is the truth — fix the roadmap.

## Non-negotiables

1. **Bun only.** `bun` for install/run/test. Never `npm`/`pnpm`/`yarn`, never Node scripts.
2. **Never `git push` and never publish without an explicit human "push"/"publish".** Agents
   open PRs; humans merge to `main` and create release tags.
3. **SSR is mandatory.** Zero runtime styling. No `window`/`document`/`navigator`/`localStorage`
   outside `useEffect` or event handlers.
4. **Docs first.** A component's `docs/component-<name>.md` must exist and follow the
   `docs/component-button.md` template before its code is written.
5. **Three files per component** in `src/components/<name>/`:
   `<name>.styles.tsx` (pure variant/class map, server-safe, no hooks/DOM),
   `<name>.logic.tsx` (`forwardRef` component + hooks + a11y; `'use client'` **only** if stateful),
   `index.tsx` (re-exports component + `Props` type). Plus `<name>.test.tsx`, `<name>.stories.tsx`.
6. **Props extend the native element** (`ComponentPropsWithoutRef<'button'>`) and add only what
   native lacks. Ref typed via `forwardRef`.
7. **Tailwind v4 + `tailwind-variants`.** No runtime CSS-in-JS, no per-component `.css`. If a style
   can't be a utility, add a `@utility` to `theme.css`. **Never interpolate class names**
   (`bg-${x}`) — every utility string must appear literally in source.
8. Colors/spacing/radius come from `@theme` tokens (`--sk-*`), never raw hex in a utility. Ask the
   human if a token is missing from `docs/tokens.md`; don't invent one.

## Every unit of work ends green

```
bun run check && bun run test:coverage && bun run build && bun run check:pkg
```

(`test:coverage` = `bun test src --coverage`; the unit suite lives under `src/`. Real-browser
tests are `bun run test:browser`, run against a built Storybook — not part of coverage.)

Coverage floor is **90%** on lines, functions, and statements (enforced by `bunfig.toml`), per
component's own files. Never raise coverage by excluding component code. If a branch is
unreachable from the public API, delete the branch.

## Roadmap & questions discipline

- Keep `docs/roadmap.md` current **in the same PR as the work**: flip boxes only when the gate
  passes (never ahead of evidence), append one update-log line.
- Log every question the owner asks in `docs/questions.md` the same session — question as worded,
  answer, and any decision. Keep its decision/waiting tables current.

## Breaking-change table (from `docs/questions.md` Q6)

| Change | Bump |
|---|---|
| Remove/rename a prop, variant, export, or CSS entry (`theme.css`/`styles.css`) | major |
| Change a prop's default value | major |
| Visual change that alters layout (height, padding, token value) | major (minor + note if it's a fix toward the spec) |
| Rename a `--sk-*` token | major |
| Add a prop, variant, component, or token | minor |
| Bug fix with no API/layout change; a11y fix | patch |
| Raise minimum React or Tailwind peer version | major |
| Internal headless-lib bump, no API change | patch |

**Pre-1.0:** stay on `0.x` until all ten v1 components ship in a real app. On `0.x`,
minor = breaking, patch = everything else. Classify with this table *before* writing the
changeset. If CI's `api-diff`/`visual-diff`/`token-diff`/`peer-diff` disagrees, CI is right.

When an OPEN decision in `docs/plan-agentic.md` §1 is unresolved, use the default assumption and
leave a `// DECISION(open): ...` comment at the touch point.

## Docs map

- `docs/plan-human.md` — plain-English overview and what the owner signs off on.
- `docs/plan-agentic.md` — phases, gates, file contract, agent rules (§3).
- `docs/roadmap.md` — **living** status board (phase gates + per-component checklist).
- `docs/questions.md` — Q&A log + recorded decisions + open questions.
- `docs/tokens.md` — Sukuna → `--sk-*` token values, dark + light.
- `docs/styling.md` — Tailwind v4 + `tailwind-variants` engine, the `.styles.tsx` pattern, CSS files.
- `docs/releasing.md` — Changesets flow, breaking-change table, CI gates, owner-only publish.
- `docs/ai-decisions.md` — decisions the agent made on its own (open items, spec fixes, missing values).
- `docs/testing.md` — `bun test` harness, coverage policy, required cases.
- `docs/storybook.md` — Storybook 10 setup and story conventions.
- `docs/component-button.md` — the component-doc template (every component copies its sections).

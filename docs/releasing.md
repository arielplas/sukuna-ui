# Releasing — `@sukuna/ui`

Changesets + semver, with the extra rules a UI library needs. **Agents never push to `main`,
never publish; a human merges the Version Packages PR and creates the release tag.**

## Breaking-change table (source: `docs/questions.md` Q6)

| Change | Bump |
|---|---|
| Remove/rename a prop, variant, export, or CSS entry (`theme.css`/`styles.css`) | major |
| Change a prop's default value | major |
| Visual change that alters layout (height, padding, token value) | major (minor + note if it's a fix toward the spec) |
| Rename a `--sk-*` token | major |
| Add a prop, variant, component, or token | minor |
| Bug fix with no API/layout change; a11y fix | patch |
| Raise minimum React or Tailwind peer version | major |
| Internal headless-lib (Base UI) bump, no API change | patch |

**Pre-1.0:** stay on `0.x` until all ten v1 components ship and are used in one real app. On `0.x`,
**minor = breaking, patch = everything else**. `1.0.0` means the props API and token names are stable.

## Every PR

1. `bun run changeset` — pick the bump using the table above; write a one-line reason. Docs/CI-only
   PRs may use an empty changeset or the `no-release` label.
2. Classify **before** writing the changeset. If a CI classifier disagrees, CI is right — raise the
   bump or fix the regression; never edit the check.

## Channels

- `latest` from `main` via the Changesets GitHub Action: merging opens/updates a **Version Packages**
  PR; merging that PR publishes — still gated on explicit owner approval.
- `next` for pre-releases during breaking work: `bunx changeset pre enter next` … `bunx changeset pre exit`.
- Deprecation window: one minor with a `@deprecated` JSDoc + dev-only console warning before removal
  in the next major.

## CI gates (`.github/workflows/ci.yml`)

Runs on every PR: `check` (Biome + tsc), `test:coverage` (fails < 90%), `build`, `check:pkg`
(publint + attw), `size`, `storybook:build` + `test:browser`, and the enforcement jobs:

- **api-diff** — commit an `api-extractor`/`.d.ts` snapshot at `etc/`; any removal/rename requires `major`.
- **visual-diff** — Chromatic (or Playwright screenshots); any diff requires ≥ `minor` + an ack in the changeset.
- **token-diff** — a Bun script diffs `--sk-*` names in `dist/theme.css` vs the last published version; removal/rename requires `major`.
- **peer-diff** — a `peerDependencies` change requires `major`.
- **changeset-bot** — no changeset → blocked, unless the `no-release` label is set.

> These enforcement jobs are specified here and in `docs/plan-agentic.md` Phase 9; wiring them into
> the workflow is tracked as remaining Phase 9 work (see `docs/roadmap.md`). The base CI (check,
> test, build, check:pkg, size, storybook, browser) is live.

## Publish (owner only)

1. Ensure the release checklist in `docs/roadmap.md` § C is all `[x]`.
2. Merge the Version Packages PR.
3. On an owner-created tag, CI runs `bunx changeset publish` → `npm publish --provenance --access public`.
4. Deploy `storybook-static` to GitHub Pages.

**Nothing publishes without an explicit human "publish" and an owner-created tag.**

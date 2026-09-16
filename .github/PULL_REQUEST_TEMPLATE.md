<!-- See CLAUDE.md for the operating rules. Every box must be honestly checked. -->

## What & why

<!-- One paragraph. What changed and the reason. -->

## Version bump

Classify with the breaking-change table in `docs/questions.md` Q6.

- [ ] Changeset added (`bun run changeset`), or `no-release` label applied for docs/CI-only PRs
- **Bump level:** `major` / `minor` / `patch`
- **One-line justification:** <!-- e.g. "adds `tone` prop → minor"; "renames `--sk-accent` → major" -->

Pre-1.0 reminder: on `0.x`, minor = breaking, patch = everything else.

## Checklist

- [ ] `bun run check && bun test --coverage && bun run build && bun run check:pkg` all green locally
- [ ] Coverage ≥ 90% (lines/functions/statements) on every touched component's own files
- [ ] Docs updated (`docs/component-<name>.md` and any affected `docs/*`)
- [ ] `docs/roadmap.md` boxes flipped for what this PR completed, **in this same PR**
- [ ] `docs/roadmap.md` update-log line appended
- [ ] `docs/questions.md` updated if the owner asked anything or a decision was made
- [ ] No runtime CSS-in-JS added; no per-component `.css` file; no interpolated class names
- [ ] No `window`/`document`/`navigator`/`localStorage` outside `useEffect`/event handlers

## CI classifiers

If `api-diff` / `visual-diff` / `token-diff` / `peer-diff` disagree with the bump above,
CI is right — raise the bump or fix the regression. Never edit the check.

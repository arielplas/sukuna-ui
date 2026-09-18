---
name: update-readme
description: >-
  Keep the README and all agent-facing docs in sync with the code after changes. Use it whenever a
  component was added/removed/renamed, a component's docs/component-<name>.md changed, the version
  bumped, or someone asks to "update the README", "refresh the docs", "regenerate llms.txt", or
  "make sure the README is up to date". It runs the deterministic docs generator, verifies the
  generated README table / component count / llms.txt / llms-full.txt / docs/llms/*.md and the
  showcase copies, checks for stale facts (version, counts, links), and reports exactly what changed.
---

# Keep README + agent docs current

The README's component table and count, `llms.txt`, `llms-full.txt`, `docs/llms/<name>.md` and the
showcase's `public/llms*` are **generated** from `docs/component-*.md` + `src/index.ts` +
`package.json` by `scripts/build-docs.ts`. Never hand-edit those generated blocks — regenerate them.

## Steps

1. **Regenerate**
   ```bash
   bun run docs:build
   ```
   Then look at what moved: `git status --short` and `git diff --stat -- README.md llms.txt llms-full.txt docs/llms examples/showcase/public`.

2. **Verify nothing is missing from the source of truth.** Every directory in `src/components/`
   must have a `docs/component-<name>.md` (docs-first rule) *and* be exported from `src/index.ts`
   — otherwise it silently won't appear in the README/llms. Check:
   ```bash
   for d in src/components/*/; do n=$(basename "$d"); [ -f "docs/component-$n.md" ] || echo "MISSING DOC: $n"; grep -q "components/$n'" src/index.ts || echo "NOT EXPORTED: $n"; done
   ```
   If something is missing, write the doc (copy the section structure of `docs/component-button.md`)
   and/or add the export, then re-run step 1.

3. **Check stale hand-written facts** in `README.md` outside the generated blocks: the component
   count appears via `<!-- count -->N<!-- /count -->` (generated — do not touch), but also scan for
   hard-coded numbers/versions in prose, badge URLs (`sukuna-ui` package name), the setup snippets
   (`theme.css` / `styles.css` / `@source` path), and the "For AI agents" URLs (`/llms.txt`,
   `/llms-full.txt`). Fix anything that no longer matches `package.json` or the code.

4. **Confirm it's in sync (this is what CI runs):**
   ```bash
   bun run docs:check
   ```
   It regenerates and fails if any generated file differs from what's committed — including
   brand-new, still-untracked pages (it uses `git status --porcelain`, not just `git diff`, so a
   missing `docs/llms/<new-component>.md` is caught too).

5. **Report** a short summary: components added/removed, the new count, files regenerated, and any
   stale facts you corrected. Do not commit unless asked; if asked, commit the generated files
   together with the change that caused them.

## Notes

- The deployed docs URL is `SITE_URL` (default `https://sukuna-ui.vercel.app`) in
  `scripts/build-docs.ts`; override with the env var when a custom domain exists.
- `bun run build` also runs `docs:build`, so a normal build keeps everything current.
- Source-level TSDoc (see `docs/tsdoc.md`) is separate from these generated files; if a component's
  props changed, make sure its TSDoc and its `docs/component-<name>.md` API section both reflect it.

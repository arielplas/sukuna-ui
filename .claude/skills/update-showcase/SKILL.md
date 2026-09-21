---
name: update-showcase
description: >-
  Verify the examples/showcase explorer (the live demo site) still reflects the component set after a
  change. Use it whenever a component is added, removed, or renamed, or when someone asks to "update
  the showcase", "update the landing page / examples page", "add it to the demo", or "the demo site is
  out of date". The showcase is now AUTO-DRIVEN: examples/showcase/src/stories.tsx reads every
  src/components/<name>/<name>.stories.tsx via import.meta.glob, so a component appears automatically
  once it has stories — there is usually nothing to hand-edit. This skill confirms that, and covers
  the few cases that still need attention (missing/renamed stories, build, styling).
---

# Keep the showcase (landing / examples page) current

The demo site in `examples/showcase/` is a **component explorer**: a left nav of every component and,
on the right, all of that component's Storybook examples. It is generated at build time from the
stories — `examples/showcase/src/stories.tsx` globs `../../../src/components/*/*.stories.tsx`, and
`App.tsx` renders each story the way Storybook does (merge `meta.args` + story `args`, prefer an
explicit `render`). The component count in the copy is `components.length` (never hand-typed).

So **adding a component needs no showcase edit** — writing its `*.stories.tsx` (already required by
the component contract) makes it show up in the sidebar and detail view. This skill is mostly a
verification pass.

Key files: `stories.tsx` (registry + `renderStory`), `App.tsx` (explorer UI), `src/styles.css`
(Tailwind entry that `@source`s the library components + stories so every story utility is emitted).
The explorer imports the library and stories **from source** (`../../../src`) so it shares one module
instance with the stories — important for context components like Toast.

## Steps

1. **Confirm the component is discoverable.** Every component needs a story file, or it won't appear:
   ```bash
   for d in src/components/*/; do n=$(basename "$d"); [ -f "$d$n.stories.tsx" ] || echo "NO STORIES (won't show in showcase): $n"; done
   ```
   If one is missing stories, write them (see `docs/component-<name>.md` §10 for the story list and
   `docs/storybook.md` for conventions). That fixes both Storybook and the showcase at once.

2. **Sanity-check the story shape** for anything new/renamed. The explorer renders each named export;
   it works when a story is either `{ args }` (rendered as `<Component {...meta.args, ...args} />`) or
   `{ render }`. If a `render` relies on a **Storybook decorator** (e.g. a wrapping provider from
   `.storybook/preview.tsx`), it won't have that in the showcase — make the story self-contained, or
   the explorer wraps the whole app in `ToastProvider` (add a similar wrapper in `App.tsx` only if a
   new context component needs one).

3. **Run the showcase to see it.** From the repo root, build the library first (the app links it):
   ```bash
   bun run build                              # library dist/ (add NODE_OPTIONS=--max-old-space-size=8192 if the DTS step OOMs)
   cd examples/showcase && bun install        # only if node_modules is missing
   bun run dev                                # explorer at http://localhost:5173  (or: preview_start name "showcase")
   ```
   Click the new component in the left nav; every story should render in both themes (header toggle).
   Watch the browser console for a story that failed (each is wrapped in an error boundary that logs).

4. **Verify the production build + prerender still work** (this is what deploys):
   ```bash
   cd examples/showcase && NODE_OPTIONS=--max-old-space-size=8192 bun run build
   ```
   It must end with `[prerender] ok …`. The prerender renders the Overview page and asserts an `<h1>`
   is present; keep the Overview intact.

5. **Missing utility styles?** If a story looks unstyled, the class isn't being generated. `styles.css`
   `@source`s `../../../src/components` (which includes the stories) and `.` (the app). Add a
   `@source` only if a demo pulls classes from somewhere else.

6. **Report** what you checked: component appears / stories render / build ok. Do not commit unless
   asked; if asked, commit with the change that added the component.

## Notes

- Companion to `update-readme` (regenerates README/llms docs). A new component usually needs its
  stories (→ this skill, auto), its docs (→ update-readme), and nothing hand-written in the showcase.
- The old version of this skill described hand-editing demos and a hard-coded count into `App.tsx`.
  That is no longer how it works — the explorer is generated from stories. Don't reintroduce manual
  demo blocks or a literal component count.
- The explorer bundles all components from source, so it's a large JS bundle; that's expected for a
  dev/demo site. Code-split later if it matters.

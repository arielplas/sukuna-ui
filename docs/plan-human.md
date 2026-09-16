# @sukuna/ui — The Plain-English Plan

## What we're building

A React component library called **`@sukuna/ui`**, published publicly on npm, that looks like the Sukuna design system: near-black, crimson for action, bone for premium, Archivo headlines. Dark is the identity; light is a mode.

Anyone should be able to run `bun add @sukuna/ui`, import one CSS file, and use `<Button>` in Vite, Remix, or Next.js, with server-side rendering just working.

## What "done" looks like for v1

Ten components, each documented, tested, accessible, and rendered in Storybook in both themes:

| Tier | Components | Why this tier |
|---|---|---|
| Static | Text, Badge, Card | No interaction. Work inside React Server Components. |
| Native interactive | Button, Input, Checkbox, Switch | The browser already knows how these behave; we style and extend. |
| Headless-backed | Tooltip, Dialog, Select | Complex keyboard/focus behavior. We borrow a headless library for the hard parts and style the result. |

## The six rules that shape everything

1. **Every component is split in three files.** `button.styles.tsx` (how it looks), `button.logic.tsx` (how it behaves), `index.tsx` (what we export). Looks and behavior never live in the same file.
2. **Zero-runtime styling with Tailwind.** Components are styled with Tailwind v4 utilities mapped to `--sk-*` tokens. Tailwind users add two lines to their CSS and get purged, themeable styles; everyone else imports a precompiled `styles.css` that just works. No styled-components, no Emotion.
3. **Themes via `data-theme`.** `<html data-theme="dark">` (default) or `"light"`. Nothing else to configure.
4. **We don't ship React.** It's a peer dependency (`>=18`). Two copies of React = broken hooks.
5. **Tests are not optional.** One runner, `bun test`, for everything: unit tests in a simulated DOM and, for the complex components, real-browser tests that drive the Storybook build with Playwright. The repo fails below 90% coverage on lines, functions, and statements; CI blocks the merge.
6. **Docs first.** Every component gets a `docs/component-<name>.md` before any code. That doc is the contract.

## Order of work

1. **Bootstrap** — repo, Bun, TypeScript, tsup build, Biome, Changesets. Output: an empty package that builds and passes `publint`.
2. **Tokens** — turn the Sukuna palette into `--sk-*` CSS variables, dark + light. Generate CSS from one TypeScript source.
3. **Harness** — Storybook with a theme toggle; `bun test` as the only runner, with SSR, hydration, and axe checks.
4. **Styling primitives** — pick the engine (see below), set up the shared variant helper.
5. **Static components** — Text, Badge, Card.
6. **Native interactive** — Button, Input, Checkbox, Switch.
7. **Headless-backed** — Tooltip, Dialog, Select.
8. **Tree-shaking and size** — importing `Button` alone should stay under ~3 kB.
9. **Consumer matrix** — example apps on Vite (React 18 and 19), Next.js App Router, Remix. All must render with no hydration warnings.
10. **Release** — CI, changesets, `npm publish`. Only when you say so.

## Decisions still open (yours to make)

### Styling engine — decided: Tailwind

| Option | Consumer experience | Our experience | Recommendation |
|---|---|---|---|
| CSS + variables + `cva` | Import one CSS file. Override tokens with CSS. Works everywhere. | Write CSS by hand, variants typed via `cva`. | Was the default |
| Vanilla Extract | Same as above. | Tokens are TypeScript-typed; files must be named `.css.ts`. | Good upgrade if you want typed tokens |
| **Tailwind v4** | Two lines of CSS if they use Tailwind. Precompiled fallback CSS if they don't. | Fast to write, variants typed via `tailwind-variants`. | ✅ **Chosen** |
| Panda / StyleX | Must add a compiler plugin to their build. | Nice DX. | ❌ Adoption killer for a library |
| styled-components / Emotion | Must set up a style registry per framework; SSR is fragile. | Familiar. | ❌ No |

### Behavior base for Tooltip / Dialog / Select

- **Hand-rolled:** we write focus traps, arrow-key nav, escape handling, portals, iOS quirks ourselves. Full control, months of edge cases.
- **Headless library:** Base UI, React Aria, or Radix give the behavior with no styles; we only write the `.styles` file. This is what shadcn/ui does.
- **Recommendation:** hybrid. Native for the simple seven, headless (Base UI) for the complex three.

### Light theme

Sukuna only defines dark. `docs/tokens.md` proposes a light palette derived from the same hues. Needs your eye.

## Where to look for status

`docs/roadmap.md` is the live board: phase gates, a per-component checklist (doc, styles, logic, tests, stories, coverage, your review), and the release checklist. Agents must update it in the same commit as the work, so if a box is checked, it happened.

## What you'll be asked to sign off on

- Each `component-<name>.md` before its code is written.
- The light-theme palette.
- The two open decisions above.
- The `publish` command. It never runs without you.

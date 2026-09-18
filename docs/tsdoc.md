# TSDoc convention — source-level docs for humans, IDEs and AI agents

Every component's public surface is documented **in the source** so the published `.d.ts`, editor
hover, and any AI agent reading `node_modules/sukuna-ui` get the full story without opening a
separate doc site. This is the second half of the docs-first rule: `docs/component-<name>.md` is
the *authoring spec* (written before the code); the TSDoc is the *consumer reference* (shipped with
the code). Both are required; neither replaces the other.

## Rules

1. **Component doc block** directly above the exported component (function or `forwardRef`). For
   compound components document the root *and* each exported sub-part (one line each is fine),
   with one `@example` showing the full composition.

   ```ts
   /**
    * One clear sentence of purpose. Optionally a second on when to use it (and what to use instead).
    *
    * @remarks
    * - SSR/RSC: static (no 'use client') or a client component, and why.
    * - Accessibility: role(s), required labelling (e.g. `aria-label` when there's no visible text),
    *   keyboard behaviour, live-region/announcement notes.
    * - Variants: every style prop with its values and the default, e.g.
    *   `variant`: 'primary' (default) | 'secondary' | 'ghost'.
    * - Behaviour: controlled vs uncontrolled, important constraints and gotchas.
    *
    * @example
    * ```tsx
    * import { X } from 'sukuna-ui'
    *
    * <X prop="value">…</X>
    * ```
    */
   ```

2. **Every field of every exported `*Props` interface** (and item/option types such as
   `SelectOption`, `MenuItemOption`, `TabItem`) gets a `/** … */`: one plain sentence, plus
   `@default <value>` whenever the implementation applies a default. Callbacks say *when* they fire
   and *what* they receive. Flag accessibility-critical props.

3. **Style variants** (`variant`, `size`, `tone`…) live in `*.styles.tsx` as `tailwind-variants`
   definitions; when a Props interface only `extends` the derived `*StyleProps`, document the
   variants and defaults in the component `@remarks` rather than restructuring the types.

4. **`@example` blocks are complete and copy-pasteable**: include the import from `'sukuna-ui'`,
   realistic props/`items`, an `aria-label` where one is required, and — for compound components —
   the whole composition. Add a second example for a notably different mode (controlled, disabled,
   `as="a"`, error state) when it earns its place.

5. **Style**: lines ≤ 100 chars (biome), single quotes in examples, no sentence repeated between
   the component block and a prop. Comments never change behaviour — a TSDoc-only change must leave
   the full gate identical (tests, coverage, `check`, `build`).

## Why

- The `.d.ts` in the published package now carries usage, defaults, a11y notes and examples, so
  IDE hover and agents reading types are self-sufficient.
- `docs/llms/*.md`, `llms.txt` and the README component table are **generated** from the specs by
  `scripts/build-docs.ts` (`bun run docs:build`); `bun run docs:check` fails CI if they drift.

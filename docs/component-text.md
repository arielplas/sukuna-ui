# Component: Text

> Follows the `docs/component-button.md` section template. Static component — no `'use client'`.

## 1. Purpose

The typographic primitive. Renders body copy, labels, eyebrows, and headings against the Sukuna
type scale, weights, tones, and tracking. One component so type stays consistent; `as` picks the
semantic element.

## 2. Files

```
src/components/text/
├── text.styles.tsx   # tv() variant map → Tailwind utilities. Pure. Server-safe.
├── text.logic.tsx    # forwardRef; NO 'use client' (static, RSC-safe).
├── text.test.tsx
├── text.stories.tsx
└── index.tsx         # export { Text } ; export type { TextProps }
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type TextElement =
  | 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface TextProps extends Omit<ComponentPropsWithoutRef<'p'>, 'color'> {
  as?: TextElement          // default 'p'
  font?: 'sans' | 'display' // default 'sans'; 'display' = Archivo, for headlines
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'   // default 'md'
  weight?: 'regular' | 'semibold' | 'bold' | 'black'        // default 'regular'
  tone?: 'default' | 'dim' | 'faint' | 'accent' | 'success' | 'premium' // default 'default'
  align?: 'start' | 'center' | 'end'
  leading?: 'tight' | 'normal'      // default 'normal'
  tracking?: 'tight' | 'normal' | 'eyebrow'   // default 'normal'; 'eyebrow' also uppercases
  truncate?: boolean        // single-line ellipsis
  numeric?: boolean         // tabular-nums for aligned figures
}
```

`color` is omitted from the native props so it can't fight `tone`. `as` is a fixed allowlist of
intrinsic tags (not `asChild` polymorphism, which stays out of v1) — SSR-safe and enough for text.

## 4. Variants → tokens

| Variant | Values → utility |
|---|---|
| font | sans → `font-sans` · display → `font-display` |
| size | xs/sm/md/lg/xl/2xl/3xl → `text-xs … text-3xl` (`--sk-text-*`) |
| weight | regular/semibold/bold/black → `font-normal/semibold/bold/black` (400/600/700/900) |
| tone | default `text-text` · dim `text-text-dim` · faint `text-text-faint` · accent `text-accent` · success `text-success` · premium `text-premium` |
| align | start/center/end → `text-start/center/end` |
| leading | tight `leading-tight` · normal `leading-normal` |
| tracking | tight/normal/eyebrow → `tracking-*`; eyebrow adds `uppercase` |
| truncate | true → `truncate` |
| numeric | true → `tabular-nums` |

## 5. States

Static; no interactive states. It inherits nothing that changes on hover/focus.

## 6. Logic (`text.logic.tsx`)

- No `'use client'` — pure render, RSC-safe.
- `forwardRef<HTMLElement, TextProps>`; `const Component = as ?? 'p'`.
- Destructure every variant prop out of `rest` so none leak to the DOM; spread the remaining
  native props onto `Component`.
- `className` merges last via `textStyles`.

## 7. Styles (`text.styles.tsx`)

`tv()` with the variants above; `defaultVariants: { font:'sans', size:'md', weight:'regular', tone:'default', leading:'normal', tracking:'normal' }`. All values resolve through `@theme` tokens.

## 8. Accessibility checklist

- [ ] Use real heading tags (`as="h2"`) for headings — never size alone to fake hierarchy.
- [ ] `tone="faint"` is for placeholder/disabled/decorative text; don't use it for essential body
      copy (it can fall below 4.5:1).
- [ ] `default`/`dim` tones meet 4.5:1 on `--sk-bg`/`--sk-surface` in both themes.
- [ ] `eyebrow` conveys style, not meaning; don't rely on uppercase to carry information.
- [ ] `label` usage associates with a control via `htmlFor`.

## 9. Tests

- Renders each `size` × `tone` on the server (`renderServer`) without throwing.
- Renders as each `as` element (`h1`, `span`, `label`, …); default is `p`.
- Hydrates cleanly for default props.
- `truncate` and `numeric` add their utilities; variant props never leak to the DOM.
- Forwards `ref` to the rendered element.
- Native props pass through (`id`, `data-*`, `aria-*`, `htmlFor` on label).
- Consumer `className` wins over a conflicting utility.
- axe: zero violations in both themes.

## 10. Stories

`Playground`, `Sizes`, `Weights`, `Tones`, `Alignment`, `Tracking`, `Truncate`, `Numeric`,
`AsElements`, `Headline`. Rendered under both themes via the toolbar.

## 11. Decisions

- `as` allowlist instead of `asChild`: chosen for a text primitive; heavier polymorphism stays
  post-1.0 (see `docs/ai-decisions.md`).
- `color` native prop omitted in favor of `tone`.

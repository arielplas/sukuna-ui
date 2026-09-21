# Component: GradientText

> Follows the `docs/component-button.md` section template. **Static** component — no `'use client'`,
> pure CSS, RSC-safe. Zero JavaScript.

## 1. Purpose

Fills text with a gradient (via `background-clip: text`) for wordmarks, hero headings, and accent
phrases. Pure CSS — server-rendered, no runtime, no hooks. The gradient is a **preset** that resolves
through `--sk-*` tokens, so it stays on-brand and theme-aware in both light and dark.

## 2. Files

```
src/components/gradient-text/
├── gradient-text.styles.tsx   # tv() variant map → Tailwind utilities. Pure. Server-safe.
├── gradient-text.logic.tsx    # forwardRef; NO 'use client' (static, RSC-safe).
├── gradient-text.test.tsx
├── gradient-text.stories.tsx
└── index.tsx                  # export { GradientText } ; export type { GradientTextProps }
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type GradientTextElement =
  | 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface GradientTextOwnProps {
  as?: GradientTextElement          // default 'span'
  gradient?: 'accent' | 'premium'   // default 'accent' — preset only (see §11)
  children: ReactNode
}

export type GradientTextProps =
  GradientTextOwnProps & Omit<ComponentPropsWithoutRef<'span'>, 'color'>
```

Deliberately **not** in v1: a raw `from`/`via`/`to` color prop or arbitrary hex — that would force
interpolated class names (violates rule #7) or raw hex in a utility (violates rule #8). Custom
gradients are the documented escape hatch: pass your own `className` with a project utility. `color`
is omitted so it can't fight the clipped fill.

## 4. Variants → tokens

| Variant | Fill | Utility |
|---|---|---|
| accent | `--sk-gradient-accent` | `bg-gradient-accent` (exists) |
| premium | `--sk-gradient-premium` | `bg-gradient-premium` (**new — owner approval needed**) |

The clip mechanism is shared by both: `bg-clip-text text-transparent` plus the gradient utility, with
a solid `color` fallback (see §8). `--sk-gradient-premium` (e.g. `linear-gradient(135deg,
var(--sk-premium), var(--sk-premium-dim))`) is **not yet in `docs/tokens.md`** — logged as an owner
question; do not ship `premium` until the token + `@utility bg-gradient-premium` are approved and
emitted by `scripts/build-tokens.ts`.

## 5. States

Static — no interactive states, no animation, so no reduced-motion concern. Selectable, copyable real
text.

## 6. Logic (`gradient-text.logic.tsx`)

- No `'use client'` — pure render, RSC-safe.
- `forwardRef<HTMLElement, GradientTextProps>`; `const Component = as ?? 'span'`.
- Destructure `as`/`gradient` out of `rest` so they don't leak to the DOM; spread remaining native
  props onto `Component`.
- `className` merges last via `gradientTextStyles`.
- Children render as-is (real text nodes — never rasterized).

## 7. Styles (`gradient-text.styles.tsx`)

```ts
import { tv, type VariantProps } from '../../utils/tv'

export const gradientTextStyles = tv({
  // `text-accent` is the solid fallback color if background-clip:text is unsupported.
  base: 'inline-block bg-clip-text text-transparent [-webkit-background-clip:text] [color:transparent]',
  variants: {
    gradient: {
      accent: 'bg-gradient-accent text-accent',
      premium: 'bg-gradient-premium text-premium',
    },
  },
  defaultVariants: { gradient: 'accent' },
})
export type GradientTextStyleProps = VariantProps<typeof gradientTextStyles>
```

`bg-gradient-accent` is the existing `@utility` in `theme.css`; `bg-gradient-premium` must be added
there via the token generator. The `text-accent`/`text-premium` classes provide a legible solid color
where `-webkit-background-clip: text` isn't honored.

## 8. Accessibility checklist

- [ ] Renders real, selectable text (not an image) — screen readers and search engines read it.
- [ ] Solid `color` fallback (`text-accent`/`text-premium`) so text stays visible if
      `background-clip: text` is unsupported (never invisible transparent text).
- [ ] Use real heading tags (`as="h1"`) for headings — the gradient is style, not structure.
- [ ] **Contrast:** clipped gradient text can dip below AA. Reserve GradientText for **large display
      text** (≥ 24px / bold, so the 3:1 large-text floor applies) and ensure the gradient's lightest
      stop clears 3:1 on the surface. Do not use it for body copy — documented in TSDoc `@remarks`.
- [ ] `-webkit-background-clip: text` prefix included for WebKit/Blink.

## 9. Tests

- Server render (`renderServer`) of each `gradient` × representative `as` without throwing.
- Renders as each `as` element; default is `span`.
- Applies `bg-clip-text` + `text-transparent` + the gradient utility; carries the solid fallback
  color class.
- `children` appear as real text (`textContent` matches).
- `as`/`gradient` never leak to the DOM; native props (`id`, `data-*`, `aria-*`) pass through.
- Forwards `ref`; consumer `className` wins over a conflicting utility.
- axe: zero violations in both themes.

## 10. Stories

`Playground`, `Accent`, `Premium` (gated on token approval), `Headline` (`as="h1"`, large),
`AsElements`, `InParagraph` (accent phrase inside body). Both themes via the toolbar.

## 11. Decisions

- **Preset gradients only** — no raw-hex/`from`-`via`-`to` prop, to honor rule #7 (no interpolated
  class names) and rule #8 (no raw hex in utilities). Custom gradients go through a consumer
  `className`. `// DECISION(open)` recorded at the touch point.
- New token `--sk-gradient-premium` + `@utility bg-gradient-premium` are **owner questions** (logged
  in `docs/questions.md`); `premium` variant ships only once approved.
- Solid `color` fallback is mandatory (accessibility), not optional.

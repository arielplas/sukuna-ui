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
  gradient?: 'accent'               // default 'accent' — preset only (see §11); 'premium' pending Q13
  children: ReactNode
}

export type GradientTextProps =
  GradientTextOwnProps & Omit<ComponentPropsWithoutRef<'span'>, 'color'>
```

Deliberately **not** in v1: a raw `from`/`via`/`to` color prop or arbitrary hex — that would force
interpolated class names (violates rule #7) or raw hex in a utility (violates rule #8). Custom
gradients are the documented escape hatch: pass `style={{ backgroundImage: 'linear-gradient(...)' }}`
(inline style reliably overrides the `bg-gradient-accent` utility; a `className` gradient may not,
since tailwind-merge doesn't dedupe the custom utility). `color` is omitted so it can't fight the
clipped fill.

## 4. Variants → tokens

| Variant | Fill | Utility | Status |
|---|---|---|---|
| accent | `--sk-gradient-accent` | `bg-gradient-accent` | **shipped** |
| premium | `--sk-gradient-premium` | `bg-gradient-premium` | pending owner (Q13) |

The clip mechanism: `bg-clip-text` + `-webkit-background-clip:text` + `-webkit-text-fill-color:transparent`
reveals the gradient, while a real `color` (`text-accent`) stays as the fallback (see §8). `premium`
is **not shipped** — `--sk-gradient-premium` (e.g. `linear-gradient(135deg, var(--sk-premium),
var(--sk-premium-dim))`) is not yet in `docs/tokens.md`; it's added as an additive `minor` once the
token + `@utility bg-gradient-premium` are approved (Q13) and emitted by `scripts/build-tokens.ts`.

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
  base: 'inline-block bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
  variants: {
    gradient: {
      accent: 'bg-gradient-accent text-accent',
      // premium: 'bg-gradient-premium text-premium',  // add when Q13 lands
    },
  },
  defaultVariants: { gradient: 'accent' },
})
export type GradientTextStyleProps = VariantProps<typeof gradientTextStyles>
```

`bg-gradient-accent` is the existing `@utility` in `theme.css`. `-webkit-text-fill-color:transparent`
reveals the gradient while `text-accent` stays as the real `color` — the accessible fallback and what
contrast tooling reads (better than `color: transparent`, which would be invisible where clip is
unsupported).

## 8. Accessibility checklist

- [ ] Renders real, selectable text (not an image) — screen readers and search engines read it.
- [ ] Real `color` (`text-accent`) via `-webkit-text-fill-color: transparent` (not `color:
      transparent`), so text stays visible if `background-clip: text` is unsupported and contrast
      tooling has a real color to read.
- [ ] Use real heading tags (`as="h1"`) for headings — the gradient is style, not structure.
- [ ] **Contrast:** clipped gradient text can dip below AA. Reserve GradientText for **large display
      text** (≥ 24px / bold, so the 3:1 large-text floor applies) and ensure the gradient's lightest
      stop clears 3:1 on the surface. Do not use it for body copy — documented in TSDoc `@remarks`.
- [ ] `-webkit-background-clip: text` prefix included for WebKit/Blink.

## 9. Tests

- Server render (`renderServer`) of each `gradient` × representative `as` without throwing.
- Renders as each `as` element; default is `span`.
- Applies `bg-clip-text` + the gradient utility + the `text-accent` fallback color class.
- `children` appear as real text (`textContent` matches).
- `as`/`gradient` never leak to the DOM; native props (`id`, `data-*`, `aria-*`) pass through.
- Forwards `ref`; consumer `className` wins over a conflicting utility.
- axe: zero violations in both themes.

## 10. Stories

`Playground`, `Headline` (`as="h1"`, large), `InParagraph` (accent phrase inside body). Both themes
via the toolbar. (`Premium` story added when Q13 lands.)

## 11. Decisions

- **Preset gradients only** — no raw-hex/`from`-`via`-`to` prop, to honor rule #7 (no interpolated
  class names) and rule #8 (no raw hex in utilities). Custom gradients go through
  `style={{ backgroundImage }}` (inline style reliably overrides the utility). `// DECISION(open)`
  recorded at the touch point.
- **v1 ships `accent` only.** New token `--sk-gradient-premium` + `@utility bg-gradient-premium` are
  **owner questions** (Q13); the `premium` variant is added (additive minor) once approved.
- **`-webkit-text-fill-color: transparent` + real `text-accent`** rather than `color: transparent` —
  keeps a legible fallback and a real color for contrast tooling (accessibility), not optional.

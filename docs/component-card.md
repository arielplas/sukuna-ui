# Component: Card

> Follows the `docs/component-button.md` section template. Static component — no `'use client'`.

## 1. Purpose

A surface container that groups related content on an elevation. Pure layout/skin — not
interactive. A clickable card is a Button or Link wrapping a Card, not a Card with an `onClick`.

## 2. Files

```
src/components/card/
├── card.styles.tsx
├── card.logic.tsx   # forwardRef; NO 'use client'.
├── card.test.tsx
├── card.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  elevation?: 'flat' | 'raised' | 'sunken'   // default 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'       // default 'md'
  radius?: 'md' | 'lg'                         // default 'lg'
  tone?: 'default' | 'premium'                 // default 'default' — bone/gold surface treatment
  interactive?: boolean                        // hover lift + focus-within ring (affordance only)
  glow?: boolean                               // crimson accent-glow halo on hover
}
```

Extends `<div>`; adds only `elevation`, `padding`, `radius`, `tone`, `interactive`, `glow`.

## 4. Variants → tokens

| elevation | utilities |
|---|---|
| flat | `bg-surface border border-line` |
| raised | `bg-surface border border-line shadow-card` |
| sunken | `bg-well border border-line` |

| padding | utility | | radius | utility |
|---|---|---|---|---|
| none | — | | md | `rounded-md` |
| sm | `p-4` | | lg | `rounded-lg` |
| md | `p-6` | | | |
| lg | `p-8` | | | |

| tone | utilities |
|---|---|
| default | — (unchanged) |
| premium | `border-premium-dim` + `bg-[color-mix(in_oklab,var(--sk-premium)_6%,var(--sk-surface))]` — a 6% premium tint mixed into the surface token, no raw hex |

| flag | utilities |
|---|---|
| interactive | `transition-[transform,box-shadow,border-color] duration-fast ease-sukuna` · `hover:-translate-y-0.5 hover:border-text-faint` · `focus-within:ring-2 focus-within:ring-focus-ring` (+ offset) · `motion-reduce:*` off |
| glow | `hover:shadow-[0_0_22px_4px_var(--sk-accent-glow)]` (the Button-primary halo) + `transition-shadow` |

`tone` is declared after `elevation` so its border/background win the merge. Base: `block text-text`.

## 5. States

| State | Behavior |
|---|---|
| default | static (`raised` is a resting elevation, not a hover effect) |
| hover (`interactive`) | lifts 2px, border brightens to `text-faint`; with `glow`, the accent halo appears |
| focus-within (`interactive`) | solid `--sk-focus-ring` ring when the wrapping/inner Link or Button is focused |
| prefers-reduced-motion | transitions and the lift are disabled; the ring and halo still apply |

## 6. Logic (`card.logic.tsx`)

- No `'use client'`.
- `forwardRef<HTMLDivElement, CardProps>`.
- Destructure `elevation`, `padding`, `radius`, `tone`, `interactive`, `glow`, `className` out;
  spread the rest onto `<div>`.

## 7. Styles (`card.styles.tsx`)

`tv()` with the variants above; `defaultVariants: { elevation: 'flat', padding: 'md', radius: 'lg',
tone: 'default' }`. `interactive` and `glow` are boolean variants with no default.

## 8. Accessibility checklist

- [ ] A Card is a generic container — no implicit role. Give it a landmark/role only when its
      content warrants one (`role="group"` + `aria-label`, `<section>` via wrapping, etc.).
- [ ] Not focusable and has no click handler; clickable surfaces wrap (or contain) a Button/Link.
      `interactive` is affordance only — it never adds `role`/`tabIndex` — and its ring uses
      `focus-within` so the real control's focus lights the card.
- [ ] `sunken`/`flat`/`premium` surfaces keep text contrast ≥ 4.5:1 in both themes (the premium
      tint is 6%, so `text-text` contrast is effectively unchanged).
- [ ] Hover-only effects (`lift`, `glow`) carry no information; keyboard users get the ring.

## 9. Tests

- Renders every `elevation` × `padding` on the server without throwing.
- Applies `radius`; `raised` includes `shadow-card`.
- Variant props never leak to the DOM.
- Forwards `ref` to the `<div>`.
- Native props pass through; renders children.
- Consumer `className` wins over a conflicting utility.
- Hydrates cleanly; axe passes in both themes.

## 10. Stories

`Playground`, `Elevations`, `Padding`, `Radius`, `Tones`, `Interactive` (cards wrapped in links),
`Composed` (Text + Badge inside). Both themes.

## 11. Decisions

- Still no clickable Card and no `onClick` affordance (wrap in Button/Link) — see
  `docs/ai-decisions.md`. `interactive` (added post-0.8.0) is the visual affordance for that
  pattern, not a replacement for it.
- `tone: 'premium'` is the "premium is a surface treatment" ruling from Q10 made concrete.
  `// DECISION(open)`: shipped as border **and** a 6% tint; the owner may prefer border-only or
  tint-only (a patch either way).
- No `Card.Header`/`Body`/`Footer` sub-components in v1; compose with `Text` and layout utilities.

# Component: Avatar

> Follows the `docs/component-button.md` template. Headless-backed (Base UI `avatar`). The wrapper
> holds no state, so it carries **no `'use client'`** (it renders Base UI's parts, which manage
> image-load state themselves).

## 1. Purpose

A user/entity image with a graceful fallback (initials or icon) while loading or on error.

## 2. Files

```
src/components/avatar/
├── avatar.styles.tsx   # tv() slots: root, image, fallback.
├── avatar.logic.tsx    # composes Base UI parts; no 'use client'.
├── avatar.test.tsx
├── avatar.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface AvatarProps extends ComponentPropsWithoutRef<'span'> {
  src?: string
  alt?: string
  fallback?: ReactNode   // initials or an icon, shown while loading / on error / when no src
  size?: 'sm' | 'md' | 'lg'   // default 'md'
}
```

## 4. Variants → tokens

root: `relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface-2 text-text-dim select-none`; size sm `size-8 text-xs` / md `size-10 text-sm` / lg `size-12 text-md`. image: `size-full object-cover`. fallback: `font-semibold`.

## 5. States

image loaded (image shown) · loading/error/no src (fallback shown).

## 6. Logic (`avatar.logic.tsx`)

- No `'use client'`. Composes `Avatar.Root` → `Avatar.Image` (only when `src`) → `Avatar.Fallback`.

## 7. Styles (`avatar.styles.tsx`)

`tv()` with `slots` + `size`; `defaultVariants: { size: 'md' }`.

## 8. Accessibility checklist

- [ ] Provide `alt` for a meaningful image; empty `alt` for decorative.
- [ ] Fallback initials are visible text; contrast ≥ 4.5:1 on `--sk-surface-2`.

## 9. Tests

Renders fallback; with `src` renders an `<img>`; size class; className merges; SSR renders the
fallback; axe both themes.

## 10. Stories

`WithImage`, `Fallback`, `Sizes`, `Group`.

## 11. Decisions

- Wrapper is not `forwardRef` (matches the other headless-backed wrappers).

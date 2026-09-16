# Component: Alert

> Follows the `docs/component-button.md` template. Static component — no `'use client'`.

## 1. Purpose

An inline message that draws attention to information, success, a caution, or an error.

## 2. Files

```
src/components/alert/
├── alert.styles.tsx   # tv() slots: root, icon, title, body.
├── alert.logic.tsx    # forwardRef; NO 'use client'.
├── alert.test.tsx
├── alert.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface AlertProps extends ComponentPropsWithoutRef<'div'> {
  tone?: 'info' | 'success' | 'warning' | 'danger'   // default 'info'
  title?: ReactNode
  icon?: ReactNode
  // role defaults to 'status'; pass role="alert" for urgent/assertive messages.
}
```

## 4. Variants → tokens

Base root: `w-full rounded-md border border-line border-l-4 bg-surface-2 p-4 flex gap-3`.
Left border + icon color by tone: info `text-faint`, success `success`, warning `premium`,
danger `accent` (Sukuna's one red). title `font-display font-bold text-text`; body `text-sm text-text-dim`.

## 5. States

Static; no interactive states. (No built-in dismiss in v1 — see Decisions.)

## 6. Logic (`alert.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLDivElement>`. `role` defaults to `status`.
- Renders optional `icon`, optional `title`, then `children` as the body.

## 7. Styles (`alert.styles.tsx`)

`tv()` with `slots` + a `tone` variant; `defaultVariants: { tone: 'info' }`.

## 8. Accessibility checklist

- [ ] `role="status"` (polite) by default; `role="alert"` (assertive) for time-sensitive errors.
- [ ] Tone is reinforced by the title/text, never color alone.
- [ ] Icon is decorative; the message text carries the meaning.

## 9. Tests

Renders role + tone border; title + body; icon slot present/absent; ref; className merges; SSR;
axe both themes.

## 10. Stories

`Info`, `Success`, `Warning`, `Danger`, `WithIcon`, `TitleOnly`.

## 11. Decisions

- No built-in dismiss/close button in v1 (would need `'use client'` state) — compose a Button or
  wrap in your own dismiss logic. Can add later.

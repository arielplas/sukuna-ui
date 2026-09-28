# Component: Textarea

> Follows the `docs/component-button.md` template. **Server component** (no `'use client'`) — a
> styled native `<textarea>`, the multi-line sibling of `Input`.

## 1. Purpose

Multi-line free text: comments, descriptions, messages. Same surface, border, focus ring and
`invalid` treatment as `Input`, so forms look uniform, and it drops into `Field.Control` the same
way. Optional content-based auto-grow uses the CSS `field-sizing: content` property — no JS.

## 2. Files

```
src/components/textarea/
├── textarea.styles.tsx   # tv() base + size/resize/autoResize/invalid variants. Pure.
├── textarea.logic.tsx    # forwardRef <textarea>. No hooks, no directive.
├── textarea.test.tsx
├── textarea.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  size?: 'sm' | 'md' | 'lg'                  // default 'md' — text size + padding, like Input
  invalid?: boolean                           // crimson border + aria-invalid
  resize?: 'none' | 'vertical' | 'both'       // default 'vertical'
  autoResize?: boolean                        // default false — grows with content (field-sizing)
}
```

`rows` stays native (default 3 via the attribute). `ref` → `HTMLTextAreaElement`.
Deliberately **not** in v1: a character counter (compose with `Field.Description`), JS auto-grow
for browsers without `field-sizing` (they keep a fixed, resizable box — graceful fallback).

## 4. Variants → tokens

Base mirrors Input: `w-full bg-surface-2 text-text border border-line placeholder:text-text-faint`,
`focus-visible:ring-2 ring-focus-ring border-accent`, `disabled:opacity-45`.

| Size | Padding | Font | Radius | Min height |
|---|---|---|---|---|
| sm | `px-3 py-1.5` | `text-sm` | `rounded-sm` | 64px |
| md | `px-3 py-2` | `text-md` | `rounded-md` | 80px |
| lg | `px-4 py-3` | `text-lg` | `rounded-lg` | 96px |

resize: `resize-none` / `resize-y` / `resize`. autoResize: `[field-sizing:content]` (+ a
`max-h-80` cap so it never eats the page). invalid: `border-accent`. No new tokens.

## 5. States

default · hover (none — text fields don't lift) · focus-visible (ring + crimson border) · invalid ·
disabled · readOnly (native). Reduced motion: only a color transition, no motion.

## 6. Logic (`textarea.logic.tsx`)

- **No `'use client'`** — no hooks, no DOM; guarded by the RSC-boundary test.
- `forwardRef<HTMLTextAreaElement, TextareaProps>`; default `rows={3}`.
- `aria-invalid` set only when `invalid` (never `"false"` noise).
- `className` merged last through `tv()`.

## 7. Styles (`textarea.styles.tsx`)

`tv()` with `size`, `resize`, `autoResize`, `invalid` variants; defaults `size: 'md'`,
`resize: 'vertical'`. Every class literal (no interpolation).

## 8. Accessibility checklist

- [ ] Native `<textarea>`; name from `<label htmlFor>`, `Field.Label` or `aria-label`.
- [ ] `invalid` → `aria-invalid="true"`; pair with `Field.Error` for the message.
- [ ] Focus ring ≥3:1 both themes; text/placeholder contrast per tokens.

## 9. Tests

Renders a textbox with `rows=3`; each size renders on the server; `invalid` sets `aria-invalid`;
`resize`/`autoResize` classes apply; forwards ref; `className` merges; typing fires `onChange`;
hydrates cleanly; axe both themes.

## 10. Stories

`Playground`, `Sizes`, `AutoResize`, `Invalid`, `Disabled`, `InField`. Both themes.

## 11. Decisions

- Server component (like Input) — it owns no state.
- Auto-grow via CSS `field-sizing: content` rather than a resize observer: zero JS, SSR-safe; the
  fallback in older browsers is simply today's fixed box.

# Component: AlertDialog

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `alert-dialog`). A modal that interrupts to confirm a consequential action. Compound.

## 1. Purpose

Ask the user to confirm something that is hard to undo ("Delete project?", "Discard changes?").
It differs from `Dialog` in the ways that matter for safety: it is `role="alertdialog"`, it does
**not** close on an outside click (the user must pick an answer), and it offers explicit
`Cancel` / `Action` parts. Everything else (focus trap, scroll lock, `Escape`, focus return) comes
from Base UI and matches Dialog.

## 2. Files

```
src/components/alert-dialog/
├── alert-dialog.styles.tsx   # tv() slots: backdrop, popup, title, description, footer, cancel.
├── alert-dialog.logic.tsx    # 'use client'; compound AlertDialog + sub-parts.
├── alert-dialog.test.tsx
├── alert-dialog.stories.tsx
└── index.tsx
test/browser/alert-dialog.test.ts  # Playwright: outside click does NOT close; Escape + Cancel do
```

## 3. API

```ts
import type { ReactNode } from 'react'

export interface AlertDialogProps {
  children: ReactNode          // Trigger + Content
  open?: boolean
  defaultOpen?: boolean        // default false
  onOpenChange?: (open: boolean) => void
}
```

Compound: `AlertDialog` (state) · `AlertDialog.Trigger` (wraps one element, like `Dialog.Trigger`)
· `AlertDialog.Content` (backdrop + centered popup; `div` props) · `AlertDialog.Title` (`h2`,
required for a name) · `AlertDialog.Description` (`p`, the consequence) · `AlertDialog.Footer`
(right-aligned action row) · `AlertDialog.Cancel` (ghost button that closes) ·
`AlertDialog.Action` (a **primary Button** that runs `onClick` and then closes).

`Action` accepts every `Button` prop except `as` (it must stay a `<button>`), including `loading`.
Deliberately **not** in v1: a `danger` look (Q10 — one red; the primary crimson already marks the
consequential action), `closeOnOutsideClick` (an alert dialog must never allow it).

## 4. Variants → tokens

No visual variants. Backdrop/popup reuse Dialog's recipe (`bg-black/60 backdrop-blur-sm`;
`max-w-md rounded-lg border border-line bg-surface p-6 shadow-card`), `z-[var(--sk-z-dialog)]`.
`Action` uses `buttonStyles({ variant: 'primary' })`; `Cancel` is `buttonStyles({ variant:
'ghost' })` so both line up at 40px. Footer: `mt-6 flex justify-end gap-2`.

No new tokens.

## 5. States

closed (server renders only the trigger) · open (backdrop fade + popup scale) · closing. Outside
press: **ignored**. `Escape` and `Cancel` close without acting; `Action` runs its `onClick` and closes.
Initial focus lands on `Cancel` when present (the safe choice) — Base UI's default is the first
focusable, and `Cancel` comes first in the footer. Reduced motion: transitions off.

**Motion (v1.3, `docs/motion.md`):** the popup scale-in (95→100%) now actually animates (`transition-[opacity,scale]`). Reduced motion: instant.

## 6. Logic (`alert-dialog.logic.tsx`)

- `'use client'`. `Base.Root` → `Trigger render={child}` → `Portal` → `Backdrop` + `Popup`.
- `Cancel` = `Base.Close` with ghost button classes. `Action` = `Base.Close render={<button>}`
  with primary classes; the consumer `onClick` runs first — call `event.preventDefault()` inside
  it to keep the dialog open (e.g. while an async delete is in flight with `loading`).
- No `useEffect`, no DOM access.

## 7. Styles (`alert-dialog.styles.tsx`)

`tv()` `slots`: `backdrop`, `popup`, `title`, `description`, `footer`. Button looks are imported
from `button.styles` (single source of truth for the 40px control height).

## 8. Accessibility checklist

- [ ] Popup is `role="alertdialog"` with `aria-modal`, `aria-labelledby` → Title,
      `aria-describedby` → Description.
- [ ] Focus trapped while open; returns to the trigger on close.
- [ ] Outside click never dismisses; `Escape` does.
- [ ] Both buttons are native `<button>`s with visible focus rings.
- [ ] Contrast ≥4.5:1 both themes; `prefers-reduced-motion` honored.

## 9. Tests

**Unit:** trigger renders; closed renders nothing; `defaultOpen` renders an `alertdialog` with
title/description; `Action` calls `onClick` and closes; `Action` + `preventDefault` stays open;
`Cancel` closes without calling the action; `className` merges; server renders trigger only; axe
both themes. **Browser:** outside click keeps it open; `Escape` closes; focus returns to trigger.

## 10. Stories

`Default` (delete confirm), `AsyncAction` (`loading` + `preventDefault` until done). Both themes.

## 11. Decisions

- Separate component rather than `Dialog role="alertdialog"` — Base UI ships a dedicated part that
  already blocks outside-press dismissal; a prop would invite misuse.
- Confirm button is the **primary** Button (Q10: no `danger`). Revisit if `--sk-danger` is approved.
- `Action` closes by default; `preventDefault()` in its `onClick` opts out (Base UI Close semantics).

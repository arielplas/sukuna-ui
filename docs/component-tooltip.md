# Component: Tooltip

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI),
> portals. Static parts render nothing on the server (tooltip starts closed).

## 1. Purpose

A hover/focus tooltip for supplementary text. Behavior (delay, positioning, dismiss, a11y wiring)
comes from Base UI (`@base-ui-components/react/tooltip`); we style the popup.

## 2. Files

```
src/components/tooltip/
├── tooltip.styles.tsx   # tv() popup classes. Pure.
├── tooltip.logic.tsx    # 'use client'; composes Base UI parts.
├── tooltip.test.tsx     # unit: trigger render + SSR (popup absent)
├── tooltip.stories.tsx
└── index.tsx
test/browser/tooltip.test.ts  # Playwright: hover shows, Escape/leave hides
```

## 3. API

```ts
import type { ReactElement, ReactNode } from 'react'

export interface TooltipProps {
  children: ReactElement          // the trigger (an element; Base UI merges trigger props onto it)
  content: ReactNode              // tooltip body
  side?: 'top' | 'right' | 'bottom' | 'left'   // default 'top'
  align?: 'start' | 'center' | 'end'           // default 'center'
  sideOffset?: number             // default 8
  delay?: number                  // open delay ms
  open?: boolean                  // controlled
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}
```

A composition wrapper (not `forwardRef`): the ref belongs on the trigger element you pass as
`children`.

## 4. Variants → tokens

Popup: `z-40 max-w-xs rounded-md border border-line bg-surface-2 text-text px-2.5 py-1.5 text-sm shadow-card select-none` + enter/exit transition via Base UI `data-[starting-style]`/`data-[ending-style]`. `z-40` = `--sk-z-tooltip`.

## 5. States

closed (nothing rendered) · open (popup, positioned by Base UI) · enter/leave transitions.

## 6. Logic (`tooltip.logic.tsx`)

- `'use client'`.
- Composes `Tooltip.Root` → `Trigger render={children}` → `Portal` → `Positioner side/align/sideOffset`
  → `Popup`. Portal renders into `document.body` on the client only; SSR renders nothing for the
  popup (closed by default).

## 7. Styles (`tooltip.styles.tsx`)

`tv()` with a single base (no variants); `side` handled by the Positioner, not classes.

## 8. Accessibility checklist

- [ ] Popup wired as the trigger's description by Base UI; content is supplementary, not essential.
- [ ] Opens on hover AND keyboard focus; dismiss on Escape / blur (Base UI).
- [ ] Not a replacement for a label; don't put interactive content inside a tooltip.

## 9. Tests

**Unit:** trigger renders; SSR renders the trigger and NOT the popup; passing props doesn't throw.
**Browser (`test/browser/tooltip.test.ts`):** hovering the trigger shows the content; Escape hides it.

## 10. Stories

`Default`, `Sides`, `WithDelay`. Story ids are part of the browser-test contract.

## 11. Decisions

- No visual arrow in v1 (Base UI `Tooltip.Arrow` omitted) — simpler; can add later. See
  `docs/ai-decisions.md`.
- Wrapper is not `forwardRef` (ref goes on the trigger child).

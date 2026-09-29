# Component: Popover

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `popover`). A click-opened floating panel anchored to a trigger. Compound.

## 1. Purpose

Show a small, interactive panel next to the element that opened it — filters, quick settings, a
share box, a date picker later. Opens on **click** (not hover) and holds real controls, which is
what separates it from `Tooltip` (hover, text only) and `HoverCard` (hover, preview only). Unlike
`Dialog` it is non-modal by default: the page stays interactive and scrollable. Positioning,
flipping, focus management, outside-press and `Escape` dismiss come from Base UI Popover.

## 2. Files

```
packages/ui/src/components/popover/
├── popover.styles.tsx   # tv() slots: positioner, popup, title, description, close.
├── popover.logic.tsx    # 'use client'; compound Popover + sub-parts.
├── popover.test.tsx
├── popover.stories.tsx
└── index.tsx            # export { Popover }; export type { PopoverProps, PopoverContentProps }
test/browser/popover.test.ts  # Playwright: click opens, Escape + outside click close, focus returns
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'

export interface PopoverProps {
  children: ReactNode                 // Trigger + Content
  open?: boolean
  defaultOpen?: boolean               // default false
  onOpenChange?: (open: boolean) => void
  modal?: boolean | 'trap-focus'      // default false — page stays interactive
}

export interface PopoverContentProps extends ComponentPropsWithoutRef<'div'> {
  side?: 'top' | 'right' | 'bottom' | 'left'   // default 'bottom'
  align?: 'start' | 'center' | 'end'           // default 'center'
  sideOffset?: number                          // default 8
}
```

Compound: `Popover` (state) · `Popover.Trigger` (wraps **one** element, e.g. a `Button`; Base UI
merges `onClick`/`aria-expanded`/`aria-haspopup`/ref onto it — same contract as `Dialog.Trigger`) ·
`Popover.Content` (portal + positioner + popup) · `Popover.Title` (`h2`, names the popup) ·
`Popover.Description` (`p`) · `Popover.Close` (ghost `button`; Base UI `render` to swap it).

Deliberately **not** in v1: an arrow (Tooltip/Menu/HoverCard have none), `openOnHover` (that is
`HoverCard`), a backdrop, anchoring to a non-trigger element.

## 4. Variants → tokens

No visual variants. popup: `w-72 max-w-[calc(100vw-2rem)] rounded-md border border-line bg-surface
p-4 text-sm text-text shadow-card`, fade + scale from `var(--transform-origin)` via
`data-[starting-style]`/`data-[ending-style]`. positioner: `z-[var(--sk-z-popover)]` (60 — above a
Dialog at 50, so a Popover inside a Dialog renders on top). title/description/close mirror Dialog.

No new tokens — `--sk-surface`, `--sk-line`, `--sk-shadow-card`, `--sk-focus-ring`, `--sk-z-popover`.

## 5. States

closed (server renders only the trigger) · open (fades/scales in) · closing. `Escape`, outside press
and `Popover.Close` close it; focus returns to the trigger. Reduced motion: transitions off.

**Motion (v1.3, `docs/motion.md`):** directional entrance — fade + scale 95→100% + a 4px slide from the trigger side (`data-side`). Reduced motion: instant.

## 6. Logic (`popover.logic.tsx`)

- `'use client'`. `Base.Root` (open/defaultOpen/onOpenChange/modal) → `Trigger render={child}` →
  `Portal` → `Positioner` (side/align/sideOffset) → `Popup` → children.
- Not `forwardRef` on the root (no element); the trigger's ref goes on the child element.
- No `useEffect`, no DOM access.

## 7. Styles (`popover.styles.tsx`)

`tv()` `slots`: `positioner`, `popup`, `title`, `description`, `close`. No variants — placement is
Positioner props, not styles.

## 8. Accessibility checklist

- [ ] Trigger gets `aria-expanded` + `aria-haspopup="dialog"`; popup is `role="dialog"`.
- [ ] `Popover.Title` / `Popover.Description` wire `aria-labelledby` / `aria-describedby`.
- [ ] Focus moves into the popup on open and returns to the trigger on close.
- [ ] `Escape` closes; outside press closes.
- [ ] Text contrast ≥4.5:1 both themes; focus ring on `Popover.Close`.
- [ ] `prefers-reduced-motion` honored.

## 9. Tests

**Unit:** trigger renders; content absent while closed; `defaultOpen` renders title, description,
close and a `dialog`; clicking the trigger opens; `Popover.Close` closes; `onOpenChange` fires;
`className` merges on the popup; server renders the trigger only; axe clean both themes.
**Browser:** click opens; `Escape` closes and focus returns to the trigger; outside click closes.

## 10. Stories

`Default` (a small form), `Sides`, `InsideDialog` (stacking guard). Both `data-theme` values.

## 11. Decisions

- Brought into scope by owner approval on 2026-09-27 (Q15), reversing roadmap §D.
- Non-modal by default (`modal={false}`) — matches Base UI and the "page stays usable" intent.
- Default `side="bottom"` (menus/selects open downward; Tooltip/HoverCard default to `top`
  because they sit over content).
- No arrow, consistent with the other floating parts.

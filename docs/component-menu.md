# Component: Menu

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI `menu`).

## 1. Purpose

A dropdown menu of actions triggered by a button. Keyboard nav, typeahead, focus, and dismiss from
Base UI.

## 2. Files

```
src/components/menu/
├── menu.styles.tsx   # tv() slots: popup, item.
├── menu.logic.tsx    # 'use client'; trigger + prop-driven items.
├── menu.test.tsx
├── menu.stories.tsx
└── index.tsx
test/browser/menu.test.ts  # Playwright: open + select
```

## 3. API

```ts
import type { ReactElement, ReactNode } from 'react'

export interface MenuItemOption {
  label: ReactNode
  onSelect?: () => void   // fires on click / Enter / Space; the menu then closes
  disabled?: boolean
  id?: string             // stable React key — set it for dynamic (filtered/reordered) menus;
                          // falls back to the array index
}

export interface MenuProps {
  children: ReactElement            // the trigger (e.g. a Button)
  items: MenuItemOption[]
  side?: 'top' | 'right' | 'bottom' | 'left'   // default 'bottom'
  align?: 'start' | 'center' | 'end'            // default 'start'
  sideOffset?: number                            // default 6
}
```

## 4. Variants → tokens

popup: `z-50 min-w-40 rounded-md border border-line bg-surface p-1 shadow-card` + enter/exit
transitions. item: `flex items-center gap-2 h-9 px-2.5 rounded-sm text-sm text-text cursor-pointer
data-[highlighted]:bg-line-soft data-[disabled]:opacity-45`.

## 5. States

closed · open (positioned popup) · item highlighted (keyboard) · disabled item.

## 6. Logic (`menu.logic.tsx`)

- `'use client'`. `Base.Root` → `Trigger render={children}` → `Portal` → `Positioner` → `Popup` →
  a `Base.Item onClick={onSelect}` per item.

## 7. Styles (`menu.styles.tsx`)

`tv()` `slots` (no variants).

## 8. Accessibility checklist

- [ ] `role="menu"`/`menuitem` wired by Base UI; trigger has `aria-haspopup`/`aria-expanded`.
- [ ] Arrow keys move, Enter/Space select, Escape closes, focus returns to trigger.

## 9. Tests

**Unit:** trigger renders; items not in the DOM while closed; SSR renders the trigger.
**Browser:** click trigger opens; clicking an item runs `onSelect` and closes.

## 10. Stories

`Default`, `WithDisabled`, `Sides`.

## 11. Decisions

- Prop-driven `items` (no separators/submenus/checkbox-items in v1; can add later).
- Not `forwardRef` (ref goes on the trigger child).

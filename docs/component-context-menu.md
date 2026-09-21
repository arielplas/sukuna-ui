# Component: ContextMenu

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `context-menu`). A right-click (or long-press) menu of actions over a target area. Reuses the
> `Menu` item shape and styling.

## 1. Purpose

Offer contextual actions where the pointer is — right-click on desktop, long-press on touch.
Positioning at the cursor, keyboard nav, typeahead, focus return, and dismiss come from Base UI
Context Menu. Shares `MenuItemOption` and the popup/item look with `Menu` so the two read as one
family.

## 2. Files

```
src/components/context-menu/
├── context-menu.styles.tsx   # tv() slots: trigger (iOS long-press fixes), popup, item (mirrors menu.styles).
├── context-menu.logic.tsx    # 'use client'; trigger area + prop-driven items.
├── context-menu.test.tsx
├── context-menu.stories.tsx
└── index.tsx
test/browser/context-menu.test.ts  # Playwright: right-click opens; select runs onSelect
```

## 3. API

```ts
import type { ReactNode } from 'react'
import type { MenuItemOption } from '../menu'   // reused: { label, onSelect?, disabled?, id? }

export interface ContextMenuProps {
  children: ReactNode             // area that responds to right-click / long-press (wrapped in a
                                  // display:contents trigger carrying the touch/iOS fixes)
  items: MenuItemOption[]
}
```

Reuses `MenuItemOption` verbatim (label / `onSelect` / `disabled` / `id`). Deliberately **not** in
v1: separators, submenus, and checkbox/radio items — same scope line as `Menu`; add to both together
if wanted.

## 4. Variants → tokens

Identical to `Menu`. popup: `z-50 min-w-40 rounded-md border border-line bg-surface p-1 shadow-card`
with enter/exit transitions. item: `flex items-center gap-2 h-9 px-2.5 rounded-sm text-sm text-text
cursor-pointer data-[highlighted]:bg-line-soft data-[disabled]:opacity-45`.

No new tokens — same set as `Menu` (`--sk-surface`, `--sk-line`, `--sk-line-soft`, `--sk-shadow-card`,
text tokens).

## 5. States

closed · open at cursor (positioned popup) · item highlighted (pointer/keyboard) · disabled item.

## 6. Logic (`context-menu.logic.tsx`)

- `'use client'`. `Base.ContextMenu.Root` → `Trigger` (Base UI's own `div`, `display: contents`,
  wrapping `children`; it carries the `contextmenu`/touch handlers, `-webkit-touch-callout:none` and
  `user-select:none`) → `Portal` → `Positioner` (anchored to the pointer) → `Popup` → a
  `Base.ContextMenu.Item onClick={onSelect}` per item.
- Not `forwardRef` (ref goes on the trigger child).
- No `useEffect`, no DOM access.

## 7. Styles (`context-menu.styles.tsx`)

`tv()` `slots`: `trigger` (`contents select-none [-webkit-touch-callout:none]` — the iOS long-press
fix) plus `popup` and `item`, the latter two the same shape as `menu.styles.tsx`. If the two drift, keep them in sync
by hand (no shared runtime import to avoid coupling client bundles); documented here as the source
of the intended parity.

## 8. Accessibility checklist

- [ ] `role="menu"`/`menuitem`; opens on `contextmenu` event and on long-press (touch).
- [ ] Full keyboard: once open, Arrow keys move, Enter/Space select, Escape closes, focus returns.
- [ ] Also openable from the keyboard (ContextMenu key / Shift+F10) via Base UI.
- [ ] Highlighted item ≥3:1 against the popup; disabled items announced as disabled.
- [ ] Never the *only* path to an action — provide a `Menu`/button alternative for critical actions.

## 9. Tests

**Unit:** trigger/child renders; items not in the DOM while closed; item shape maps to popup items;
SSR renders the child only. **Browser:** right-click on the area opens the popup; clicking an item
runs `onSelect` and closes; Escape closes.

## 10. Stories

`Default`, `WithDisabled`, `OnACard` (right-click a surface). Both `data-theme` values.

## 11. Decisions

- Prop-driven `items`, reusing `MenuItemOption` from `Menu` (one item contract across menus).
- Style parity with `Menu` kept by hand (duplicated slots) rather than a shared module, to avoid
  pulling one client component's bundle into the other.
- Documented as an enhancement, not a replacement, for keyboard/button access to the same actions.
- `children` are wrapped in Base UI's trigger `div` (`display: contents`) rather than merged onto the
  child via `render`, so the component can apply `user-select:none` / `-webkit-touch-callout:none`.
  Base UI only sets the callout style; without `user-select:none` an iOS long-press starts text
  selection and the menu never reliably opens.

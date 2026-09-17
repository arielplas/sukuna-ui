# Component: Drawer

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `dialog`), portals + focus trap. Compound, side-anchored.

## 1. Purpose

A panel that slides in from an edge (nav, filters, details). Focus trap, scroll lock, and dismiss
come from Base UI Dialog; we anchor and animate it to a side.

## 2. Files

```
src/components/drawer/
├── drawer.styles.tsx   # tv() slots (backdrop, popup, title, description, close) + `side` variant.
├── drawer.logic.tsx    # 'use client'; compound Drawer + sub-parts.
├── drawer.test.tsx
├── drawer.stories.tsx
└── index.tsx
test/browser/drawer.test.ts  # Playwright: open + Escape close
```

## 3. API

```ts
export interface DrawerProps { children: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; modal?: boolean | 'trap-focus' }
```

Compound: `Drawer` + `Drawer.Trigger` + `Drawer.Content` (takes `side?: 'left'|'right'|'top'|'bottom'`,
default `'right'`) + `Drawer.Title` + `Drawer.Description` + `Drawer.Close`.

## 4. Variants → tokens

backdrop: `fixed inset-0 bg-black/60 backdrop-blur-sm`. popup: `fixed bg-surface p-6 shadow-card`
anchored per `side` (e.g. right → `inset-y-0 right-0 h-full w-80 border-l`) with a slide-in
transform via `data-[starting-style]`/`data-[ending-style]`.

## 5. States

closed · open (slides in from `side`, focus trapped) · enter/leave transforms.

## 6. Logic (`drawer.logic.tsx`)

- `'use client'`. Same composition as Dialog (`Root` → `Trigger` → `Portal`/`Backdrop`/`Popup` →
  `Title`/`Description`/`Close`), but the popup is side-anchored via the `side` variant.

## 7. Styles

`tv()` `slots` + a `side` variant on the popup.

## 8. Accessibility checklist

- [ ] `role="dialog"` + `aria-modal`; labelled by `Drawer.Title`, described by `Drawer.Description`.
- [ ] Focus moves in on open, trapped while open, returns to trigger on close.
- [ ] `Escape` / outside-click dismiss; background scroll-locked.

## 9. Tests

**Unit:** trigger renders; content absent while closed; `defaultOpen` shows Title/Description +
`role="dialog"`; side class applies; SSR trigger-only. **Browser:** open + Escape closes.

## 10. Stories

`Right`, `Left`, `Top`, `Bottom`.

## 11. Decisions

- Built on Base UI Dialog with a `side` variant (no separate primitive). Compound API like Dialog.

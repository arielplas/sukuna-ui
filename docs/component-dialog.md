# Component: Dialog

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI),
> portals + focus trap. Compound component.

## 1. Purpose

A modal dialog. Focus trap, scroll lock, `Escape`/outside-click dismiss, and `aria` wiring come
from Base UI (`@base-ui-components/react/dialog`); we style backdrop, popup, title, etc.

## 2. Files

```
src/components/dialog/
├── dialog.styles.tsx   # tv() slots: backdrop, popup, title, description, close.
├── dialog.logic.tsx    # 'use client'; compound Dialog + sub-parts.
├── dialog.test.tsx
├── dialog.stories.tsx
└── index.tsx
test/browser/dialog.test.ts  # Playwright: focus trap, Escape, outside-click
```

## 3. API

```ts
export interface DialogProps {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean | 'trap-focus'   // default modal
}
```

Compound: `Dialog` (root) + `Dialog.Trigger` (wraps an element) + `Dialog.Content` (backdrop +
popup, portalled) + `Dialog.Title` + `Dialog.Description` + `Dialog.Close` (a button).

```tsx
<Dialog>
  <Dialog.Trigger><Button>Open</Button></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Delete project?</Dialog.Title>
    <Dialog.Description>This can't be undone.</Dialog.Description>
    <Dialog.Close>Cancel</Dialog.Close>
  </Dialog.Content>
</Dialog>
```

## 4. Variants → tokens

- backdrop: `fixed inset-0 z-50 bg-black/60 backdrop-blur-sm` + fade.
- popup: centered, `w-[90vw] max-w-lg rounded-lg border border-line bg-surface p-6 shadow-card` +
  scale/opacity enter-exit. `z-50` = `--sk-z-dialog`.
- title: `font-display text-lg font-bold tracking-tight`; description: `text-sm text-text-dim`.
- close: ghost-style button.

## 5. States

closed (nothing) · open (backdrop + popup, focus trapped) · enter/leave transitions.

## 6. Logic (`dialog.logic.tsx`)

- `'use client'`. Sub-parts wrap Base UI parts and apply the slot classes. `Trigger`/`Close` use
  Base UI's `render`/default button; `Title`/`Description` auto-wire `aria-labelledby`/`describedby`.

## 7. Styles (`dialog.styles.tsx`)

`tv()` with `slots` (no variants).

## 8. Accessibility checklist

- [ ] `role="dialog"` + `aria-modal`; labelled by `Dialog.Title`, described by `Dialog.Description`
      (Base UI wires these).
- [ ] Focus moves into the dialog on open, is trapped while open, and returns to the trigger on close.
- [ ] `Escape` and outside-click dismiss (modal).
- [ ] Background is inert/scroll-locked while open.

## 9. Tests

**Unit:** `defaultOpen` renders Title/Description/Close in the portal; closed renders nothing;
SSR renders the trigger, not the content.
**Browser (`test/browser/dialog.test.ts`):** open traps focus (Tab stays inside); `Escape` closes;
outside-click closes.

## 10. Stories

`Default`, `Destructive`, `LongContent`. Story ids are part of the browser-test contract.

## 11. Decisions

- Compound API (`Dialog.*`) rather than a single prop-driven component — matches how dialogs
  compose content. See `docs/ai-decisions.md`.

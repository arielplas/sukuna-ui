# Component: Accordion

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `accordion`).

## 1. Purpose

Vertically stacked, expandable sections. Keyboard + `aria` wiring from Base UI.

## 2. Files

```
src/components/accordion/
├── accordion.styles.tsx   # tv() slots: root, item, header, trigger, icon, panel.
├── accordion.logic.tsx    # 'use client'; prop-driven wrapper.
├── accordion.test.tsx
├── accordion.stories.tsx
└── index.tsx
test/browser/accordion.test.ts  # Playwright: expand/collapse
```

## 3. API

```ts
export interface AccordionItemData { value: string; trigger: ReactNode; content: ReactNode; disabled?: boolean }

export interface AccordionProps {
  items: AccordionItemData[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  openMultiple?: boolean   // default false
}
```

## 4. Variants → tokens

item: `border-b border-line`. trigger: `group flex w-full items-center justify-between gap-3 py-3 text-left font-medium text-text hover:text-text focus-visible:ring-2 focus-visible:ring-accent-glow`. icon (chevron): `text-text-dim transition-transform group-data-[panel-open]:rotate-180`. panel content: `pb-3 text-sm text-text-dim`.

## 5. States

collapsed · expanded (chevron rotated) · focus-visible · disabled item.

## 6. Logic (`accordion.logic.tsx`)

- `'use client'`. `Base.Root` (openMultiple, value/defaultValue/onValueChange) → per item:
  `Base.Item` → `Base.Header` → `Base.Trigger` (label + chevron) → `Base.Panel` (content).

## 7. Styles

`tv()` `slots` (no variants).

## 8. Accessibility checklist

- [ ] Trigger is a `<button>` with `aria-expanded`/`aria-controls` (Base UI); panels are regions.
- [ ] Enter/Space toggle; arrow keys move between headers.
- [ ] Expanded state shown by more than the chevron (content visibility).

## 9. Tests

**Unit:** renders triggers; `defaultValue` shows a panel; clicking a trigger toggles its content;
`onValueChange` fires; SSR. **Browser:** click expands/collapses.

## 10. Stories

`Default`, `OpenMultiple`, `WithDefault`.

## 11. Decisions

- Prop-driven `items`; string values; `value` is the array of open items (matches Base UI).

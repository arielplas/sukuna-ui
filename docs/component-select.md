# Component: Select

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI),
> portal + listbox. Prop-driven (not compound).

## 1. Purpose

A single-select dropdown. Keyboard, typeahead, positioning, dismiss, and listbox a11y come from
Base UI (`@base-ui-components/react/select`); we style the trigger, popup, and items.

## 2. Files

```
src/components/select/
├── select.styles.tsx   # tv() slots: trigger, icon, popup, item, indicator, placeholder.
├── select.logic.tsx    # 'use client'; prop-driven wrapper.
├── select.test.tsx
├── select.stories.tsx
└── index.tsx
test/browser/select.test.ts  # Playwright: open, choose, value updates, dismiss
```

## 3. API

```ts
export interface SelectOption { value: string; label: ReactNode; disabled?: boolean }

export interface SelectProps {
  items: SelectOption[]
  value?: string            // controlled
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string      // default 'Select…'
  disabled?: boolean
  name?: string             // form field name
  id?: string
  variant?: 'filled' | 'outline' | 'ghost'   // default 'filled' (the original look); same map as Input
  size?: 'sm' | 'md' | 'lg' // default 'md'
  'aria-label'?: string
}
```

Prop-driven with an `items` array (string values in v1). The `Value` shows the selected item's
label, or the placeholder when empty.

## 4. Variants → tokens

- trigger: `text-text border rounded-md`, `data-[popup-open]:border-accent`, focus ring;
  `variant` filled `bg-surface-2 border-line` (default) / outline `bg-transparent border-line` /
  ghost `bg-transparent border-transparent hover:bg-surface-2` — the shared form-control map (see
  Input); `size` sm `h-8 text-sm` / md `h-10 text-md` / lg `h-12 text-lg`.
- popup: `min-w-[var(--anchor-width,10rem)] max-h-[min(24rem,var(--available-height,24rem))] overflow-y-auto`
  `rounded-md border border-line bg-surface p-1 shadow-card` + fade/scale; z-index on the positioner
  (`z-[var(--sk-z-popover)]`). Opens below the trigger (`alignItemWithTrigger={false}`, flips up
  when cramped), is at least as wide as the trigger, and never taller than the space on its side.
- item: `h-9 px-2.5 rounded-sm text-sm`, `data-[highlighted]:bg-line-soft`, `data-[disabled]` dim.
- indicator: `text-accent` check; icon: `text-text-dim` chevron.

## 5. States

closed · open (listbox) · item highlighted (keyboard) · item selected (check) · disabled item ·
disabled trigger.

## 6. Logic (`select.logic.tsx`)

- `'use client'`. `Base.Root<string>` (value/defaultValue/onValueChange, guarding `null`) →
  `Trigger` (`Value` render fn for label/placeholder + `Icon`) → `Portal` → `Positioner` → `Popup`
  → `List` → `Item` (`ItemText` + `ItemIndicator`).

## 7. Styles (`select.styles.tsx`)

`tv()` with `slots` + a `size` variant on the trigger.

## 8. Accessibility checklist

- [ ] Trigger exposes the selected value; give it an `aria-label` or associate a `<label>` via `id`.
- [ ] Listbox roles, arrow-key navigation, typeahead, and selection from Base UI.
- [ ] `Escape` / outside-click dismiss; focus returns to the trigger.
- [ ] Disabled items are not selectable and are announced disabled.

## 9. Tests

**Unit:** trigger shows placeholder with no value and the label with `defaultValue`; options not in
the DOM while closed; SSR renders the trigger, not the list.
**Browser (`test/browser/select.test.ts`):** open, choose an item, trigger reflects it, popup closes;
keyboard selection.

## 10. Stories

`Default`, `WithDefault`, `Sizes`, `Disabled`, `WithDisabledItem`, `ManyItems` (four stacked
Selects with 100 numeric options — scroll and width guard). Story ids are part of the
browser-test contract.

## 11. Decisions

- Prop-driven `items` API with **string values** in v1 (not compound, not arbitrary value types);
  multiple-select and non-string values are post-1.0. See `docs/ai-decisions.md`.

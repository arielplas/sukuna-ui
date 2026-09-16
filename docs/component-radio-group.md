# Component: RadioGroup

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `radio-group` + `radio`).

## 1. Purpose

Choose one option from a small set. Roving focus + arrow-key selection from Base UI.

## 2. Files

```
src/components/radio-group/
├── radio-group.styles.tsx   # tv() slots: group, item, control, indicator, label.
├── radio-group.logic.tsx    # 'use client'; prop-driven wrapper.
├── radio-group.test.tsx
├── radio-group.stories.tsx
└── index.tsx
test/browser/radio-group.test.ts  # Playwright: arrow-key selection
```

## 3. API

```ts
export interface RadioOption { value: string; label: ReactNode; disabled?: boolean }

export interface RadioGroupProps {
  items: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'   // default 'vertical'
  size?: 'sm' | 'md'                          // default 'md'
  'aria-label'?: string
}
```

## 4. Variants → tokens

group: flex (col vertical / row horizontal) gap. control (the radio): `rounded-full border border-line bg-surface-2 data-[checked]:border-accent focus-visible:ring-2 focus-visible:ring-accent-glow disabled:opacity-45`, size sm `size-4` / md `size-5`. indicator: centered `rounded-full bg-accent` dot, hidden when unchecked. label: `text-sm text-text`.

## 5. States

unchecked · checked (accent border + dot) · focus-visible ring · disabled.

## 6. Logic (`radio-group.logic.tsx`)

- `'use client'`. `Base.RadioGroup` (value/defaultValue/onValueChange guarding non-string, name,
  disabled, aria) wraps a `<label>` per item containing `Radio.Root` + `Radio.Indicator` + label text.

## 7. Styles

`tv()` `slots` + `orientation`/`size` variants.

## 8. Accessibility checklist

- [ ] `role="radiogroup"` with an accessible name (`aria-label`/`aria-labelledby`).
- [ ] Arrow keys move + select; Tab enters/leaves the group (Base UI).
- [ ] Each option has a visible, associated label.

## 9. Tests

**Unit:** renders radios; clicking selects + fires `onValueChange`; controlled respected;
`disabled` item not selectable; no leak; SSR. **Browser:** arrow-key selection.

## 10. Stories

`Default`, `Horizontal`, `WithDefault`, `DisabledOption`.

## 11. Decisions

- Prop-driven `items` with **string** values (like Select).

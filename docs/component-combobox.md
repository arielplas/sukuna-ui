# Component: Combobox

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `autocomplete`).

## 1. Purpose

A text input with a filtered list of suggestions (free-text autocomplete). For a fixed
pick-from-list without typing, use Select.

## 2. Files

```
src/components/combobox/
├── combobox.styles.tsx   # tv() slots: input, popup, item, empty.
├── combobox.logic.tsx    # 'use client'; prop-driven wrapper.
├── combobox.test.tsx
├── combobox.stories.tsx
└── index.tsx
test/browser/combobox.test.ts  # Playwright: type → filter → select
```

## 3. API

```ts
export interface ComboboxProps {
  items: string[]
  value?: string          // the input text (controlled)
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string    // default 'Search…'
  disabled?: boolean
  emptyMessage?: string   // default 'No results'
  maxRenderedItems?: number // cap displayed suggestions (Base UI `limit`); search spans all items
  'aria-label'?: string
}
```

For large suggestion lists, set `maxRenderedItems` (e.g. `50`) so only the top N filtered matches
render — filtering still runs over the full `items`. Items also use `content-visibility: auto` so
off-screen options are cheap. Beyond a few thousand items, prefer server-side search feeding a
capped `items`.

## 4. Variants → tokens

input: same as Input (`bg-surface-2 border-line rounded-md`, focus ring). popup: `z-50 max-h-72
overflow-y-auto rounded-md border border-line bg-surface p-1 shadow-card` + fade/scale. item:
`h-9 px-2.5 rounded-sm data-[highlighted]:bg-line-soft data-[selected]:text-accent`. empty:
`text-sm text-text-dim`.

## 5. States

closed · typing (filtered list) · item highlighted (keyboard) · empty (no matches) · disabled.

## 6. Logic (`combobox.logic.tsx`)

- `'use client'`. `Base.Root` (items, value/defaultValue/onValueChange) → `Base.Input` → `Portal` →
  `Positioner` → `Popup` → `Empty` + `List` (render-prop → `Item` per filtered string).

## 7. Styles

`tv()` `slots` (no variants).

## 8. Accessibility checklist

- [ ] `role="combobox"` input with `aria-expanded`/`aria-controls`; listbox + options wired by Base UI.
- [ ] Arrow keys move, Enter selects, Escape closes; typeahead filters.
- [ ] Give the input an `aria-label` or associate a `<label>`.

## 9. Tests

**Unit:** renders a combobox input; typing filters to matching options; SSR renders the input.
**Browser:** type → filtered option appears → selecting fills the input.

## 10. Stories

`Default`, `WithValue`, `Disabled`.

## 11. Decisions

- String suggestions in v1 (object items / async loading deferred). Free-text value = input text.

# Component: ToggleGroup

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `toggle-group` + `toggle`). A segmented control: a row of pressable buttons where one (or many)
> is active. Ships a standalone `Toggle` from the same folder for single on/off buttons.

## 1. Purpose

Pick one option from a small, mutually-exclusive set (segmented control), or toggle several
independent options (a formatting toolbar). Roving focus, `aria-pressed`, and keyboard navigation
come from Base UI. Distinct from `RadioGroup` (which is for form values with labels/descriptions);
ToggleGroup is a compact button-style control, and `Toggle` is a single pressable button.

## 2. Files

```
src/components/toggle-group/
├── toggle-group.styles.tsx   # tv() slots: root, item + `size`/`orientation` variants.
├── toggle-group.logic.tsx    # 'use client'; prop-driven ToggleGroup + standalone Toggle.
├── toggle-group.test.tsx
├── toggle-group.stories.tsx
└── index.tsx                 # export { ToggleGroup, Toggle } + types
test/browser/toggle-group.test.ts  # Playwright: click + arrow-key roving selection
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface ToggleOption {
  value: string
  label: ReactNode
  disabled?: boolean
  'aria-label'?: string   // required when label is icon-only
}

interface ToggleGroupOwnProps {
  items: ToggleOption[]
  value?: string | string[]          // controlled; string in single mode, string[] in multiple
  defaultValue?: string | string[]
  onValueChange?: (value: string[]) => void   // always an array from Base UI
  multiple?: boolean                  // default false → single-select (segmented control)
  size?: 'sm' | 'md' | 'lg'           // default 'md'
  orientation?: 'horizontal' | 'vertical'  // default 'horizontal'
  disabled?: boolean
}

// A group needs an accessible name: pass aria-label or aria-labelledby.
export type ToggleGroupProps = ToggleGroupOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'dir'>

// Standalone single toggle button (e.g. a mute button). forwardRef to the <button>.
interface ToggleOwnProps {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}
export type ToggleProps = ToggleOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'value'>
```

Deliberately **not** in v1: `variant` styles beyond the single segmented look, and per-item icons +
text combos beyond what `label: ReactNode` already allows.

## 4. Variants → tokens

root: `inline-flex rounded-md border border-line bg-surface-2 p-0.5 gap-0.5`
(`flex-col` when `orientation="vertical"`). item: `inline-flex items-center justify-center gap-2
rounded-sm text-text-dim font-medium select-none cursor-pointer transition-colors duration-fast
hover:text-text data-[pressed]:bg-well data-[pressed]:text-text
data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring`.

| Size | Item height | Padding-x | Font |
|---|---|---|---|
| sm | 28px | `px-2.5` | `text-sm` |
| md | 34px | `px-3` | `text-md` |
| lg | 40px | `px-4` | `text-lg` |

No new tokens — reuses `--sk-surface-2`, `--sk-line`, `--sk-well`, `--sk-focus-ring`, text tokens.

## 5. States

default (unpressed) · hover · pressed (`data-[pressed]` → `--sk-well` fill) · focus-visible (ring) ·
disabled (per item or whole group).

## 6. Logic (`toggle-group.logic.tsx`)

- `'use client'`. `ToggleGroup`: `Base.ToggleGroup` (value/defaultValue/onValueChange/`toggleMultiple`
  = `multiple`/orientation/disabled) → a `Base.Toggle value={o.value}` per item. Not `forwardRef`
  (ref goes on the group `div` via spread if provided).
- `Toggle`: `forwardRef<HTMLButtonElement>` → `Base.Toggle` (pressed/defaultPressed/onPressedChange).
- No `useEffect`, no DOM access.

## 7. Styles (`toggle-group.styles.tsx`)

`tv()` `slots` (root, item) + `size` and `orientation` variants. `Toggle` reuses the `item` slot.

## 8. Accessibility checklist

- [ ] Group requires `aria-label`/`aria-labelledby` (enforced in docs + a warning-free story).
- [ ] Items expose `aria-pressed`; roving `tabIndex` with Arrow keys (Base UI), Home/End jump.
- [ ] Icon-only items require `aria-label` (enforced on `ToggleOption`).
- [ ] Pressed vs unpressed distinguished by more than color (fill + text weight/contrast ≥3:1).
- [ ] Focus ring visible in both themes.

## 9. Tests

**Unit:** renders one button per item; `defaultValue` marks the pressed item (`aria-pressed`);
clicking calls `onValueChange` with the array; `multiple` allows two pressed; disabled item not
selectable; standalone `Toggle` toggles `aria-pressed` and forwards `ref`; SSR renders all buttons.
**Browser:** click selects; Arrow keys move roving focus and select.

## 10. Stories

`Segmented` (single), `Multiple`, `Sizes`, `Vertical`, `IconOnly`, `Disabled`, `SingleToggle`. Both
`data-theme` values.

## 11. Decisions

- Prop-driven `items` (matches `Menu`/`Select`), plus a standalone `Toggle` for single buttons.
- `onValueChange` always receives an array (Base UI's shape) even in single mode — documented.
- Not merged into `RadioGroup`: different semantics (`aria-pressed` vs radio) and visual role.

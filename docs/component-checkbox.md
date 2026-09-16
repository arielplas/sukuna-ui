# Component: Checkbox

> Follows the `docs/component-button.md` template. `'use client'` — holds controllable state and
> sets the native `indeterminate` DOM property.

## 1. Purpose

A boolean checkbox. A native `<input type="checkbox">` tinted with `accent-color`, so keyboard,
focus, and the indeterminate state come from the platform. The consumer supplies the label.

## 2. Files

```
src/components/checkbox/
├── checkbox.styles.tsx
├── checkbox.logic.tsx   # 'use client' (controllable state + indeterminate ref).
├── checkbox.test.tsx
├── checkbox.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

type Native = Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'value' | 'defaultValue'
>

export interface CheckboxProps extends Native {
  size?: 'sm' | 'md'                    // default 'md'
  checked?: boolean                     // controlled
  defaultChecked?: boolean              // uncontrolled initial, default false
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean               // visual/AT "mixed"; default false
}
```

Boolean-friendly API (`onCheckedChange(checked)`) instead of raw `onChange`. Uncontrolled +
controlled via the shared `useControllableState` hook.

## 4. Variants → tokens

Base: `accent-accent cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-45 disabled:cursor-not-allowed`.
`accent-accent` sets `accent-color: var(--sk-accent)` — the native control renders in crimson.

| size | utility |
|---|---|
| sm | `size-4` |
| md | `size-5` |

## 5. States

default · hover · focus-visible (accent-glow ring) · checked (native, accent) · indeterminate
(native mixed) · disabled (opacity .45, not-allowed).

## 6. Logic (`checkbox.logic.tsx`)

- `'use client'`.
- `forwardRef<HTMLInputElement, CheckboxProps>`.
- `useControllableState<boolean>({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange })`.
- Merged ref callback sets `node.indeterminate` (a DOM property, not an attribute) and forwards the
  external ref — no `useEffect`.
- Renders a controlled native checkbox: `checked={state}`, `onChange={(e) => setState(e.target.checked)}`.

## 7. Styles (`checkbox.styles.tsx`)

`tv()` with `size`; `defaultVariants: { size: 'md' }`.

## 8. Accessibility checklist

- [ ] Programmatic label via `<label htmlFor>`, `aria-label`, or `aria-labelledby` (not rendered here).
- [ ] Space toggles (native).
- [ ] `indeterminate` is set as the DOM property so AT reports "mixed".
- [ ] Focus ring ≥ 3:1 against the surface in both themes.

## 9. Tests

- Renders every `size` on the server without throwing.
- Toggles on click when uncontrolled; fires `onCheckedChange`.
- Controlled `checked` stays until the parent updates; `onCheckedChange` still fires.
- `indeterminate` sets the DOM property.
- `disabled` blocks toggling.
- Forwards `ref` (object and callback forms).
- Space toggles via keyboard.
- Variant props never leak; consumer `className` wins; hydrates; axe passes in both themes.

## 10. Stories

`Playground`, `Sizes`, `Checked`, `Indeterminate`, `Disabled`, `WithLabel`. Both themes.

## 11. Decisions

- Native rendering tinted with `accent-color` rather than fully custom `appearance-none` art in v1
  (accessible, less CSS) — see `docs/ai-decisions.md`. Custom art can come later.
- `onCheckedChange(boolean)` replaces raw `onChange`.

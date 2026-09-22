# Component: Checkbox

> Follows the `docs/component-button.md` template. `'use client'` — holds controllable state and
> sets the native `indeterminate` DOM property.

## 1. Purpose

A boolean checkbox. A native `<input type="checkbox">` tinted with `accent-color`, so keyboard,
focus, and the indeterminate state come from the platform. Pass `label` for clickable text beside
the box (rendered inside a `<label>`), or label the bare input yourself.

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
  size?: 'sm' | 'md' | 'lg'             // default 'md'
  checked?: boolean                     // controlled
  defaultChecked?: boolean              // uncontrolled initial, default false
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean               // visual/AT "mixed"; default false
  label?: ReactNode                     // wraps input + text in a <label>; text click toggles
}
```

Boolean-friendly API (`onCheckedChange(checked)`) instead of raw `onChange`. Uncontrolled +
controlled via the shared `useControllableState` hook. Enter toggles as well as Space (handled
in `onKeyDown` with `preventDefault`, so it never implicitly submits a form); a consumer
`onKeyDown` runs first and can `preventDefault()` to opt out.

## 4. Variants → tokens

Base: `accent-accent cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-45 disabled:cursor-not-allowed`.
`accent-accent` sets `accent-color: var(--sk-accent)` — the native control renders in crimson.

| size | utility |
|---|---|
| sm | `size-4` |
| md | `size-5` |
| lg | `size-6` |

With `label`: wrapper `<label>` `inline-flex items-center gap-2 cursor-pointer select-none text-text
has-[:disabled]:cursor-not-allowed has-[:disabled]:text-text-dim`; text `text-sm` (sm) / `text-md` (md).

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
- `onKeyDown`: calls the consumer's handler, then on `Enter` (unless `defaultPrevented`)
  `preventDefault()` + toggles.
- With `label`: returns `<label class=root>{input}<span class=text>{label}</span></label>`; the
  ref still points at the `<input>`.

## 7. Styles (`checkbox.styles.tsx`)

`tv()` with `size`; `defaultVariants: { size: 'md' }`.

## 8. Accessibility checklist

- [ ] Named by `label` (wrapping `<label>`), or by `<label htmlFor>`, `aria-label`, or `aria-labelledby`.
- [ ] Space toggles (native); Enter toggles too and never submits the form.
- [ ] Clicking the `label` text toggles the box.
- [ ] `indeterminate` is set as the DOM property so AT reports "mixed".
- [ ] Focus ring ≥ 3:1 against the surface in both themes.

## 9. Tests

- Renders every `size` on the server without throwing.
- Toggles on click when uncontrolled; fires `onCheckedChange`.
- Controlled `checked` stays until the parent updates; `onCheckedChange` still fires.
- `indeterminate` sets the DOM property.
- `disabled` blocks toggling.
- Forwards `ref` (object and callback forms).
- Space toggles via keyboard; Enter toggles, calls the consumer `onKeyDown` first, never submits
  the form, and backs off when the consumer prevented it.
- `label` renders inside a `<label>`, names the box, text click toggles, ref stays on the input;
  disabled dims the text; server-renders.
- Browser (`test/browser/checkbox.test.ts`): label-text click toggles; Enter toggles.
- Variant props never leak; consumer `className` wins; hydrates; axe passes in both themes.

## 10. Stories

`Playground`, `Sizes`, `Checked`, `Indeterminate`, `Disabled`, `WithLabel` (`label` prop),
`ExternalLabel` (`<label htmlFor>`). Both themes.

## 11. Decisions

- Native rendering tinted with `accent-color` rather than fully custom `appearance-none` art in v1
  (accessible, less CSS) — see `docs/ai-decisions.md`. Custom art can come later.
- `onCheckedChange(boolean)` replaces raw `onChange`.
- Enter toggles (owner request, D32). Deviates from the bare native control on purpose; the
  handler prevents implicit form submission so a form never submits from a checkbox.

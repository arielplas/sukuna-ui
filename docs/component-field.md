# Component: Field

> Template note: follows the exact sections of `docs/component-button.md`.

## 1. Purpose

Wraps one form control (an `Input`, `Checkbox`, `Switch`, …) with a label, an optional
description and an optional error, and wires the `id` / `aria-labelledby` / `aria-describedby` /
`aria-invalid` relationships for you. It is the connective tissue of a form, not a control itself —
the control stays whatever you put inside. Built on **Base UI Field**, which owns the id and aria
bookkeeping so the wrapper stays thin.

## 2. Files

```
src/components/field/
├── field.styles.tsx   # tv() slots (root, label, control, description, error). Pure. Server-safe.
├── field.logic.tsx    # 'use client' — compound Field over Base UI Field parts.
├── field.test.tsx
├── field.stories.tsx
└── index.tsx          # export { Field }; export type { FieldProps, … }
```

## 3. API

```tsx
import { Field } from '@sukuna/ui'
import { Input } from '@sukuna/ui'

<Field invalid={hasError}>
  <Field.Label>Email</Field.Label>
  <Field.Control render={<Input type="email" />} />
  <Field.Description>Work address only.</Field.Description>
  <Field.Error>Enter a valid email.</Field.Error>
</Field>
```

Compound parts (each maps 1:1 to a Base UI Field part; every prop the Base part takes is accepted):

| Part | Renders | Notes |
|---|---|---|
| `Field` (root) | `<div>` | `invalid`, `name`, `disabled`, `validate`, `validationMode` from Base UI Field.Root. |
| `Field.Label` | `<label>` | Auto `htmlFor` → control id. |
| `Field.Control` | `<input>` | Pass `render={<Input/>}` (or any Base UI control) to use a custom control. |
| `Field.Description` | `<p>` | Auto-linked into the control's `aria-describedby`. |
| `Field.Error` | `<div>` | Shows conditionally (see §5); auto-linked into `aria-describedby` when shown. |

`Field.Error` accepts Base UI's `match` (`boolean | keyof ValidityState`). When `match` is omitted,
the wrapper defaults it to `true` if the root has `invalid` set — so a controlled `<Field invalid>`
shows its error with no extra prop, while native-constraint validation (no `invalid` prop) keeps
Base UI's default behavior (show when the control's `ValidityState` is invalid).

Deliberately **not** in v1: a monolithic `label` / `error` string prop (the compound parts are the
API; a one-shot convenience wrapper can come later), `size` variants (the inner control owns its
size), built-in async validation UI beyond what Base UI Field exposes.

## 4. Variants → tokens

No visual variants. Slots map straight to type/spacing tokens:

| Slot | Utilities | Tokens |
|---|---|---|
| root | `flex flex-col gap-1.5` | layout only |
| label | `text-sm font-medium text-text` | `--sk-text` |
| control | `w-full` | layout only (control brings its own styling) |
| description | `text-sm text-text-dim` | `--sk-text-dim` |
| error | `text-sm text-accent` | `--sk-accent` (Sukuna's one red, used as the danger tone) |

No raw hex; all colors resolve through `@theme` in `src/styles/theme.css`.

## 5. States

| State | Behavior |
|---|---|
| default | label + control; description/error optional |
| invalid (`<Field invalid>`) | control gets `aria-invalid="true"`; `Field.Error` renders and joins `aria-describedby` |
| valid | `Field.Error` renders `null`; nothing added to `aria-describedby` for it |
| disabled (`<Field disabled>`) | forwarded to the control (Base UI Field.Root precedence) |
| focus | handled entirely by the inner control (Input's own focus ring) |

The wrapper adds **zero** runtime styling and no focus handling of its own — focus visuals live on
the control.

## 6. Logic (`field.logic.tsx`)

- `'use client'` — **required**: Base UI `Field.Root`/`Field.Label`/`Field.Control`/`Field.Error`
  all declare `'use client'` (they use context + validation state), so any module that renders them
  is a client module. SSR still works: the directive only marks the client boundary; `renderToString`
  renders the tree normally (verified by the SSR test).
- Thin wrappers over `Base.Root/Label/Control/Description/Error`; each applies its slot class via
  `tailwind-variants` so a consumer `className` merges last.
- A tiny `FieldInvalidContext` lets `Field.Error` default its `match` to the root's `invalid` — no
  DOM access, no `useEffect`.
- Base UI owns id generation, `htmlFor`, `aria-labelledby`, `aria-describedby` and `aria-invalid`.
- No `forwardRef` on the root (Base UI Field.Root is a `<div>` grouping element; refs go on the
  control you pass in).

## 7. Styles (`field.styles.tsx`)

```ts
import { tv, type VariantProps } from '../../utils/tv'

export const fieldStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-text',
    control: 'w-full',
    description: 'text-sm text-text-dim',
    error: 'text-sm text-accent',
  },
})
export type FieldStyleProps = VariantProps<typeof fieldStyles>
```

## 8. Accessibility checklist

- [ ] Label is a real `<label>` associated with the control (`htmlFor` ↔ control `id`, from Base UI).
- [ ] Description and error, when present, are referenced by the control's `aria-describedby`.
- [ ] `aria-invalid="true"` on the control when the field is invalid.
- [ ] Error text meets ≥ 4.5:1 contrast in both themes (`text-accent` on surfaces).
- [ ] No independent focus target on the wrapper; focus lives on the control.

## 9. Tests

Required cases (see `field.test.tsx`):

- Label is associated with the control (`getByLabelText`; clicking the label focuses it).
- Description and error ids are both present in the control's `aria-describedby`.
- `<Field invalid>` sets `aria-invalid` on the control; valid does not.
- `Field.Error` renders `null` when valid, and renders when `match` is forced.
- SSR renders label + control + description + error (`renderServer`).
- axe: zero violations in dark and light, valid and invalid.
- Consumer `className` merges onto each slot.
- Real wiring with the `Input` component (`render={<Input/>}`) in at least one case.

## 10. Stories

`Playground`, `WithDescription`, `Invalid`, `CheckboxField` (a `Checkbox`/`Switch` inside a Field).
All rendered under both `data-theme` values via the global toolbar.

## 11. Decisions

- `match` auto-defaults to the root `invalid` state so `<Field invalid>` "just works" for controlled
  errors, while leaving Base UI's native-validity behavior intact when `invalid` is unset
  (agent decision, 2026-09-17; logged in `docs/ai-decisions.md` by the orchestrator).
- No `size`/`variant` on the wrapper — the control owns its own sizing.

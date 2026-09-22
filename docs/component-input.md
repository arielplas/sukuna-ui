# Component: Input

> Follows the `docs/component-button.md` section template. Static component — no `'use client'`
> (a native `<input>` holds its own value; controlled use goes through native `value`/`onChange`).

## 1. Purpose

A single-line text input. Native `<input>` styled to Sukuna, with size and an invalid state.

## 2. Files

```
src/components/input/
├── input.styles.tsx
├── input.logic.tsx   # forwardRef; NO 'use client'.
├── input.test.tsx
├── input.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  variant?: 'filled' | 'outline' | 'ghost'   // default 'filled' (the original look)
  size?: 'sm' | 'md' | 'lg'   // default 'md' (shadows the native numeric `size` attr — omitted)
  invalid?: boolean           // sets aria-invalid + crimson border
}
```

Native `size` (visible width in chars) is omitted in favor of the variant `size`. Everything else
native passes through (`type`, `value`, `defaultValue`, `onChange`, `placeholder`, `disabled`,
`required`, `name`, `autoComplete`, `aria-*`, …).

## 4. Variants → tokens

Base: `w-full text-text border placeholder:text-text-faint transition-[border-color,box-shadow] duration-fast ease-sukuna focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:border-accent disabled:opacity-45 disabled:cursor-not-allowed`.

| variant | utilities | use |
|---|---|---|
| filled | `bg-surface-2 border-line` | default — the original look |
| outline | `bg-transparent border-line` | on busy/tinted surfaces |
| ghost | `bg-transparent border-transparent hover:bg-surface-2` | inline edit; the border appears on focus (`border-accent`) or `invalid` |

The same `variant` map is shared by Select, Combobox and NumberField so the form layer reads as one.

| size | utilities |
|---|---|
| sm | `h-8 px-3 text-sm rounded-sm` |
| md | `h-10 px-3 text-md rounded-md` |
| lg | `h-12 px-4 text-lg rounded-lg` |

| invalid | utilities |
|---|---|
| true | `border-accent focus-visible:ring-accent-glow` |

Sukuna has one red (crimson), so the invalid border reuses `--sk-accent` (see `docs/questions.md` Q10).

## 5. States

| State | Behavior |
|---|---|
| default | as above |
| focus-visible | 2px `--sk-accent-glow` ring, border → accent |
| invalid | crimson border always; `aria-invalid="true"` |
| disabled | `opacity .45`, `cursor: not-allowed` (native disabled) |

## 6. Logic (`input.logic.tsx`)

- No `'use client'`.
- `forwardRef<HTMLInputElement, InputProps>`.
- Destructure `size`, `invalid`, `className` out; set `aria-invalid={invalid || undefined}`; spread
  the rest onto `<input>`.
- Full width by default (`w-full` in base); constrain with a wrapper or `className`.

## 7. Styles (`input.styles.tsx`)

`tv()` with `size` and `invalid` variants; `defaultVariants: { size: 'md' }`.

## 8. Accessibility checklist

- [ ] Every input has a programmatic label — a `<label htmlFor>`, `aria-label`, or
      `aria-labelledby`. The component does not render a label; the consumer supplies one.
- [ ] `invalid` sets `aria-invalid`; pair with `aria-describedby` pointing at the error text.
- [ ] Placeholder is not a label (it disappears on input); never rely on it alone.
- [ ] Focus ring ≥ 3:1 against the surface in both themes.

## 9. Tests

- Renders every `size` on the server without throwing.
- `invalid` sets `aria-invalid="true"`; absent otherwise.
- Controlled `value` + `onChange` works; `disabled` blocks typing.
- Forwards `ref` to the `<input>`.
- Native props pass through (`type`, `placeholder`, `name`, `data-*`).
- `size`/`invalid` never leak to the DOM as raw attributes.
- Consumer `className` wins over a conflicting utility.
- Hydrates cleanly; axe passes in both themes (rendered with a label).

## 10. Stories

`Playground`, `Sizes`, `Invalid`, `Disabled`, `Types`, `WithLabel`. Both themes.

## 11. Decisions

- Native numeric `size` attribute dropped in favor of the variant `size` (see `docs/ai-decisions.md`).
- No leading/trailing icon slots in v1 (compose a wrapper), keeping the element a plain `<input>`.
- Full width by default.

'use client'

import { Field as Base } from '@base-ui-components/react/field'
import { type ComponentProps, createContext, useContext } from 'react'
import { fieldStyles } from './field.styles'

const styles = fieldStyles()

/** Lets `Field.Error` default its `match` to the root's `invalid` state (see below). */
const FieldInvalidContext = createContext(false)

// Base UI parts type `className` as `string | ((state) => string)`; we only forward a string so it
// can merge through `tailwind-variants`. Keep `render` and every other Base prop.
type WithClass<T> = Omit<T, 'className'> & { className?: string }

/**
 * Props for the `Field` root: every Base UI `Field.Root` prop (a `<div>` plus `invalid`,
 * `disabled`, `name`, `validate`, `validationMode`, `validationDebounceTime`, `dirty`, `touched`
 * and `render`), with `className` narrowed to a plain string.
 * - `invalid?: boolean` — marks the field invalid from your own state (e.g. a form library);
 *   sets `aria-invalid` on the control and shows `Field.Error` by default.
 * - `disabled?: boolean` (default `false`) — disables the control; takes precedence over the
 *   control's own `disabled`.
 * - `name?: string` — the submitted field name; takes precedence over the control's `name`.
 * - `validate?` — custom validation; return an error string / string[] or `null` when valid.
 * - `validationMode?: 'onSubmit' | 'onBlur' | 'onChange'` (default `'onSubmit'`).
 */
export type FieldProps = WithClass<ComponentProps<typeof Base.Root>>
/**
 * Props for `Field.Label`: a `<label>`; every Base UI `Field.Label` prop (including `render`),
 * with `className` narrowed to a plain string. `htmlFor` is generated for you.
 */
export type FieldLabelProps = WithClass<ComponentProps<typeof Base.Label>>
/**
 * Props for `Field.Control`: an `<input>` by default; every Base UI `Field.Control` prop
 * (native input attributes, `render`, `onValueChange(value, details)`, `defaultValue`), with
 * `className` narrowed to a plain string. Pass `render={<Input />}` to use the Sukuna `Input`.
 */
export type FieldControlProps = WithClass<ComponentProps<typeof Base.Control>>
/**
 * Props for `Field.Description`: a `<p>`; every Base UI `Field.Description` prop (including
 * `render`), with `className` narrowed to a plain string. Its `id` is generated and added to
 * the control's `aria-describedby`.
 */
export type FieldDescriptionProps = WithClass<ComponentProps<typeof Base.Description>>
/**
 * Props for `Field.Error`: a `<div>`; every Base UI `Field.Error` prop (including `render`),
 * with `className` narrowed to a plain string.
 * - `match?: boolean | keyof ValidityState` — when to show the message. `true` always shows it;
 *   a `ValidityState` key (e.g. `'valueMissing'`) shows it for that native error only. When
 *   omitted, defaults to `true` if the root has `invalid` set, otherwise to Base UI's default
 *   (show when the control's native/custom validation fails).
 */
export type FieldErrorProps = WithClass<ComponentProps<typeof Base.Error>>

/**
 * Root of the compound `Field`: a `<div>` grouping a label, one control and optional
 * description/error. Base UI Field owns the id / `htmlFor` / `aria-describedby` /
 * `aria-invalid` wiring. `'use client'` (Base UI Field parts require it).
 */
function FieldRoot({ invalid, className, children, ...rest }: FieldProps) {
  return (
    <FieldInvalidContext.Provider value={invalid ?? false}>
      <Base.Root invalid={invalid} className={styles.root({ className })} {...rest}>
        {children}
      </Base.Root>
    </FieldInvalidContext.Provider>
  )
}

/** `Field.Label`: a real `<label>`, auto-associated (`htmlFor`) with the field control. */
function FieldLabel({ className, ...rest }: FieldLabelProps) {
  return <Base.Label className={styles.label({ className })} {...rest} />
}

/**
 * `Field.Control`: the form control. Renders an unstyled `<input>` by default; pass
 * `render={<Input />}` (or `<Checkbox />`, `<Switch />`, any Base UI control) to use a custom
 * one — Base UI merges the generated id and aria props onto it. Refs go on this element.
 */
function FieldControl({ className, ...rest }: FieldControlProps) {
  return <Base.Control className={styles.control({ className })} {...rest} />
}

/** `Field.Description`: supplementary `<p>` text, linked into the control's `aria-describedby`. */
function FieldDescription({ className, ...rest }: FieldDescriptionProps) {
  return <Base.Description className={styles.description({ className })} {...rest} />
}

/**
 * `Field.Error`: the validation message. Renders `null` while valid; when shown it is linked into
 * the control's `aria-describedby`. When `match` is omitted we default it to the root's `invalid`
 * state, so `<Field invalid>` shows a controlled error with no extra prop; leaving `invalid`
 * unset keeps Base UI's native-validity behavior.
 */
function FieldError({ match, className, ...rest }: FieldErrorProps) {
  const invalid = useContext(FieldInvalidContext)
  const resolvedMatch = match ?? (invalid ? true : undefined)
  return <Base.Error match={resolvedMatch} className={styles.error({ className })} {...rest} />
}

/**
 * Wraps one form control with a label, an optional description and an optional error, and wires
 * the `id` / `htmlFor` / `aria-describedby` / `aria-invalid` relationships for you. Compound:
 * `Field` (root) + `Field.Label`, `Field.Control`, `Field.Description`, `Field.Error`.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`), required because the underlying Base UI Field
 *   parts use context and validation state. It still renders on the server (SSR-tested); the
 *   directive only marks the client boundary.
 * - Accessibility: `Field.Label` is a real `<label>` bound to the control via a generated id;
 *   `Field.Description` and a shown `Field.Error` are referenced by the control's
 *   `aria-describedby`; `invalid` puts `aria-invalid="true"` on the control. The wrapper adds no
 *   focus target of its own — focus visuals live on the control.
 * - Variants: none. Slots are fixed: root `flex flex-col gap-1.5`, label `text-sm font-medium`,
 *   control `w-full` (layout only), description `text-sm text-text-dim`, error
 *   `text-sm text-accent`. A consumer `className` merges onto each part.
 * - Sizing/visuals belong to the inner control; pass `render={<Input size="lg" />}` etc.
 * - Error visibility: `<Field invalid>` shows `Field.Error` automatically (controlled errors).
 *   Without `invalid`, `Field.Error` follows native constraint validation (`required`, `type`,
 *   `pattern`, or a root `validate` function) and `validationMode`.
 * - The root is not `forwardRef`-wrapped; put refs on the control.
 *
 * @example
 * ```tsx
 * import { Field, Input } from 'sukuna-ui'
 *
 * <Field invalid={!!errors.email}>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control render={<Input type="email" />} name="email" />
 *   <Field.Description>Work address only.</Field.Description>
 *   <Field.Error>{errors.email ?? 'Enter a valid email.'}</Field.Error>
 * </Field>
 * ```
 *
 * @example
 * ```tsx
 * import { Field, Input, Switch } from 'sukuna-ui'
 *
 * // Native constraint validation: the error shows only for the matched ValidityState key.
 * <Field validationMode="onBlur">
 *   <Field.Label>Username</Field.Label>
 *   <Field.Control render={<Input />} required minLength={3} />
 *   <Field.Error match="valueMissing">Username is required.</Field.Error>
 *   <Field.Error match="tooShort">Use at least 3 characters.</Field.Error>
 * </Field>
 *
 * // A Switch as the control: the label becomes its accessible name.
 * <Field>
 *   <Field.Label>Email notifications</Field.Label>
 *   <Field.Control render={<Switch />} />
 * </Field>
 * ```
 */
export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
})

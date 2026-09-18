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

export type FieldProps = WithClass<ComponentProps<typeof Base.Root>>
export type FieldLabelProps = WithClass<ComponentProps<typeof Base.Label>>
export type FieldControlProps = WithClass<ComponentProps<typeof Base.Control>>
export type FieldDescriptionProps = WithClass<ComponentProps<typeof Base.Description>>
export type FieldErrorProps = WithClass<ComponentProps<typeof Base.Error>>

/**
 * Groups a label + control + optional description/error. Base UI Field owns the id / `htmlFor` /
 * `aria-describedby` / `aria-invalid` wiring. `'use client'` (Base UI Field parts require it).
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

/** Label; auto-associated (`htmlFor`) with the field control. */
function FieldLabel({ className, ...rest }: FieldLabelProps) {
  return <Base.Label className={styles.label({ className })} {...rest} />
}

/**
 * The control. Renders an `<input>` by default; pass `render={<Input/>}` (or any Base UI control)
 * to use a custom one — Base UI merges the id/aria props onto it.
 */
function FieldControl({ className, ...rest }: FieldControlProps) {
  return <Base.Control className={styles.control({ className })} {...rest} />
}

/** Supplementary text, linked into the control's `aria-describedby`. */
function FieldDescription({ className, ...rest }: FieldDescriptionProps) {
  return <Base.Description className={styles.description({ className })} {...rest} />
}

/**
 * Error message. Shown when the field is invalid and linked into `aria-describedby`. When `match`
 * is omitted we default it to the root's `invalid` state, so `<Field invalid>` shows a controlled
 * error with no extra prop; leaving `invalid` unset keeps Base UI's native-validity behavior.
 */
function FieldError({ match, className, ...rest }: FieldErrorProps) {
  const invalid = useContext(FieldInvalidContext)
  const resolvedMatch = match ?? (invalid ? true : undefined)
  return <Base.Error match={resolvedMatch} className={styles.error({ className })} {...rest} />
}

/** Compound: `Field` + `Field.Label/Control/Description/Error`. */
export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
})

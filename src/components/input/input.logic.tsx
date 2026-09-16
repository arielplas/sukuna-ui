import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type InputStyleProps, inputStyles } from './input.styles'

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    InputStyleProps {}

/** Single-line text input. Static and RSC-safe (no `'use client'`). */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={inputStyles({ size, invalid, className })}
      {...rest}
    />
  )
})

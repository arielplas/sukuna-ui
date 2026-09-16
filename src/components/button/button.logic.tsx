'use client'

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { buttonStyles } from './button.styles'

interface ButtonOwnProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  /** Shows a spinner, sets `aria-busy`, and disables the button; keeps its width. */
  loading?: boolean
  fullWidth?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

type ButtonBaseProps = ButtonOwnProps & Omit<ComponentPropsWithoutRef<'button'>, 'color'>

/**
 * Either the button has visible `children`, or — when it's icon-only — an `aria-label` is
 * required. This is enforced at the type level (the accessibility contract in the doc).
 */
export type ButtonProps =
  | (ButtonBaseProps & { children: ReactNode })
  | (ButtonBaseProps & { children?: undefined; 'aria-label': string })

const Spinner = () => (
  <svg aria-hidden="true" className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    fullWidth,
    loading = false,
    leadingIcon,
    trailingIcon,
    type,
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      // Native default is "submit", which surprises people inside forms.
      type={type ?? 'button'}
      className={buttonStyles({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})

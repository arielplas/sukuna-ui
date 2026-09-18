'use client'

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, type Ref } from 'react'
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

/** Default rendering: a native `<button>`. */
type ButtonAsButton = ButtonOwnProps & { as?: 'button' } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'color'
  >

/**
 * `as="a"` renders an `<a>` with the same styling — the "link that looks like a button" need.
 * Accepts `href` and every other anchor prop. A native `<a>` has no `disabled`, so `disabled` here
 * is mapped to `aria-disabled` + `tabIndex={-1}` + the disabled styles (`pointer-events-none`).
 */
type ButtonAsAnchor = ButtonOwnProps & { as: 'a'; disabled?: boolean } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'color'
  >

/**
 * Either the element has visible `children`, or — when it's icon-only — an `aria-label` is
 * required. This is enforced at the type level (the accessibility contract in the doc).
 */
type WithLabel<T> =
  | (T & { children: ReactNode })
  | (T & { children?: undefined; 'aria-label': string })

export type ButtonProps = WithLabel<ButtonAsButton> | WithLabel<ButtonAsAnchor>

const Spinner = () => (
  <svg aria-hidden="true" className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

/**
 * Internal, element-agnostic view of the props: every field this component reads, plus a loose
 * bucket for the native attributes it forwards. The public `ButtonProps` above stays sound; this
 * cast just lets one implementation serve both element kinds.
 */
type ButtonImplProps = ButtonOwnProps & {
  as?: 'button' | 'a'
  type?: ComponentPropsWithoutRef<'button'>['type']
  disabled?: boolean
  className?: string
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant,
      size,
      fullWidth,
      loading = false,
      leadingIcon,
      trailingIcon,
      as = 'button',
      type,
      disabled,
      className,
      children,
      ...rest
    } = props as ButtonImplProps

    const classes = buttonStyles({ variant, size, fullWidth, className })
    const content = (
      <>
        {loading ? <Spinner /> : leadingIcon}
        {children}
        {trailingIcon}
      </>
    )

    if (as === 'a') {
      const isDisabled = disabled || loading
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          className={classes}
          // Anchors have no `disabled`; express it accessibly and let the styles (pointer-events-none)
          // plus tabIndex=-1 block activation. `role` stays the native `link`.
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          {...(rest as ComponentPropsWithoutRef<'a'>)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        // Native default is "submit", which surprises people inside forms.
        type={type ?? 'button'}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...(rest as ComponentPropsWithoutRef<'button'>)}
      >
        {content}
      </button>
    )
  },
)

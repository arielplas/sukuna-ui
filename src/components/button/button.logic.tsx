'use client'

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, type Ref } from 'react'
import { buttonStyles } from './button.styles'

interface ButtonOwnProps {
  /**
   * Visual weight. `primary` is the crimson CTA (use once per surface), `secondary` is a quiet
   * bordered button, `ghost` has no background until hovered.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost'
  /**
   * Height/padding/font scale: `sm` = 32px, `md` = 40px, `lg` = 48px.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Shows a spinner in place of `leadingIcon`, sets `aria-busy="true"` and disables the button
   * (blocks `onClick`); the label stays rendered so the width does not jump.
   * @default false
   */
  loading?: boolean
  /**
   * Stretches the button to the full width of its container (`w-full`).
   * @default false
   */
  fullWidth?: boolean
  /** Icon rendered before the label. Replaced by the spinner while `loading`. */
  leadingIcon?: ReactNode
  /** Icon rendered after the label. Stays visible while `loading`. */
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

/**
 * Props for {@link Button}. A discriminated union on `as`:
 * - `as` omitted or `'button'`: own props + every native `<button>` attribute (except `color`).
 *   `type` defaults to `'button'`.
 * - `as: 'a'`: own props + every native `<a>` attribute (except `color`), plus a `disabled`
 *   boolean that maps to `aria-disabled` and `tabIndex={-1}`.
 *
 * In both branches you must pass visible `children` or, for an icon-only button, an
 * `aria-label` (enforced by the type).
 */
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

/**
 * Triggers an action. Use `variant="primary"` for the single main action on a surface and
 * `secondary`/`ghost` for everything else.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because it owns the `loading` state wiring.
 *   Renders fine on the server; no `useEffect` and no DOM access.
 * - Accessibility: renders a native `<button>` (or `<a>` with `as="a"`), so Space/Enter
 *   activation, focus and the `button`/`link` role come from the platform. Icon-only usage
 *   requires `aria-label` (the type will not compile without it). `loading` sets
 *   `aria-busy="true"` and the spinner is `aria-hidden`. A visible focus ring is always rendered.
 * - Variants: `variant`: 'primary' (default) | 'secondary' | 'ghost'; `size`: 'sm' | 'md'
 *   (default) | 'lg'; `fullWidth`: boolean (default false).
 * - `type` defaults to `'button'` (not the native `'submit'`); pass `type="submit"` explicitly
 *   inside forms.
 * - `disabled` and `loading` both block `onClick`. On `as="a"` there is no native `disabled`, so
 *   it is expressed as `aria-disabled="true"`, `tabIndex={-1}` and `pointer-events: none`.
 * - The ref is an `HTMLButtonElement` by default and an `HTMLAnchorElement` with `as="a"`.
 * - A consumer `className` is merged last (tailwind-merge), so it can override any utility.
 *
 * @example
 * ```tsx
 * import { Button } from 'sukuna-ui'
 *
 * <Button variant="primary" size="lg" onClick={() => startTrial()}>
 *   Start 7-day free trial
 * </Button>
 *
 * <Button variant="secondary" loading={isSaving} type="submit">
 *   Save changes
 * </Button>
 *
 * // Icon-only: `aria-label` is required by the type.
 * <Button variant="ghost" size="sm" aria-label="Close" leadingIcon={<CloseIcon />} />
 * ```
 *
 * @example
 * ```tsx
 * import { Button } from 'sukuna-ui'
 *
 * // A link that looks like a button; `disabled` becomes aria-disabled + tabIndex=-1.
 * <Button as="a" href="/pricing" variant="secondary" disabled={!canUpgrade}>
 *   See pricing
 * </Button>
 * ```
 */
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

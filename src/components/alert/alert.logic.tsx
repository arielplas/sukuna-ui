import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { type AlertStyleProps, alertStyles } from './alert.styles'

export interface AlertProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    AlertStyleProps {
  /** Bold display-font heading rendered above the body; replaces the native `title` tooltip. */
  title?: ReactNode
  /** Decorative icon shown at the leading edge, tinted by `tone` and hidden from AT. */
  icon?: ReactNode
}

/**
 * Inline message that draws attention to information, a success, a caution or an error.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`). There is no built-in close button; compose
 *   a Button and own the dismissal state yourself.
 * - Accessibility: the root `role` is derived from `tone` — `'alert'` (assertive) for `danger`
 *   and `warning`, `'status'` (polite) otherwise. A consumer-supplied `role` always wins. Tone is
 *   color only; put the meaning in `title`/children. The `icon` wrapper is `aria-hidden`.
 * - Variants: `tone`: 'info' (default) | 'success' | 'warning' | 'danger'. It colors the 4px
 *   left border and the icon: info `text-faint`, success `success`, warning `premium`, danger
 *   `accent` (Sukuna's one red).
 * - Children render in the body slot (`text-sm`, dim). `className` merges into the root slot.
 * - Theming: border, surface and text colors come from `--sk-*` tokens and flip with
 *   `data-theme`.
 *
 * @example
 * ```tsx
 * import { Alert } from 'sukuna-ui'
 *
 * <Alert tone="danger" title="Binding vow broken" icon={<SkullIcon />}>
 *   Your cursed energy output has been halved until the vow is renewed.
 * </Alert>
 * <Alert tone="success" role="status">
 *   Technique saved.
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone, title, icon, role, className, children, ...rest },
  ref,
) {
  // Announce urgent tones assertively; consumer `role` always wins.
  const resolvedRole = role ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status')
  const styles = alertStyles({ tone })
  return (
    <div ref={ref} role={resolvedRole} className={styles.root({ className })} {...rest}>
      {icon ? (
        <span aria-hidden="true" className={styles.icon()}>
          {icon}
        </span>
      ) : null}
      <div>
        {title ? <div className={styles.title()}>{title}</div> : null}
        <div className={styles.body()}>{children}</div>
      </div>
    </div>
  )
})

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { type AlertStyleProps, alertStyles } from './alert.styles'

export interface AlertProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    AlertStyleProps {
  /** Bold display-font heading rendered above the body; replaces the native `title` tooltip. */
  title?: ReactNode
  /** Decorative icon shown at the leading edge, tinted by `tone` and hidden from AT. */
  icon?: ReactNode
  /**
   * Renders a close button at the trailing edge that calls this handler. The Alert does not hide
   * itself: remove it in the handler (it stays a server component with no state).
   */
  onDismiss?: () => void
  /**
   * Accessible name of the close button.
   * @default 'Dismiss'
   */
  dismissLabel?: string
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
 * - Dismiss (v1.3): pass `onDismiss` to render a labelled close button (`dismissLabel`,
 *   default "Dismiss"); hide the Alert yourself in the handler.
 *
 * @example
 * ```tsx
 * import { Alert } from '@sukunagg/ui'
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
  { tone, title, icon, onDismiss, dismissLabel = 'Dismiss', role, className, children, ...rest },
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
      <div className={styles.content()}>
        {title ? <div className={styles.title()}>{title}</div> : null}
        <div className={styles.body()}>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={styles.dismiss()}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  )
})

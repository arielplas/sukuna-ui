import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { type AlertStyleProps, alertStyles } from './alert.styles'

export interface AlertProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    AlertStyleProps {
  title?: ReactNode
  icon?: ReactNode
}

/** Inline status/message. Static and RSC-safe (no `'use client'`). */
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

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { breadcrumbsStyles } from './breadcrumbs.styles'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
  current?: boolean
}

export interface BreadcrumbsProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
  items: BreadcrumbItem[]
  separator?: ReactNode
}

/** Breadcrumb trail. Static and RSC-safe (no `'use client'`). */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, separator = '/', 'aria-label': ariaLabel = 'Breadcrumb', className, ...rest },
  ref,
) {
  const styles = breadcrumbsStyles()
  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...rest}>
      <ol className={styles.list()}>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            // A breadcrumb trail is a fixed, ordered list; index is the stable key. Keying by href
            // breaks when two crumbs share one (e.g. repeated or placeholder hrefs).
            // biome-ignore lint/suspicious/noArrayIndexKey: ordered, non-reordering trail
            <li key={index} className={styles.item()}>
              {item.current || (!item.href && last) ? (
                <span aria-current="page" className={styles.current()}>
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} className={styles.link()}>
                  {item.label}
                </a>
              ) : (
                <span className={styles.link()}>{item.label}</span>
              )}
              {last ? null : (
                <span aria-hidden="true" className={styles.separator()}>
                  {separator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

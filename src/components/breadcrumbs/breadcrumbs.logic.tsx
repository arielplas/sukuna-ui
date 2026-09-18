import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { breadcrumbsStyles } from './breadcrumbs.styles'

/** One crumb in the trail, as passed in {@link BreadcrumbsProps.items}. */
export interface BreadcrumbItem {
  /** Visible text (or node) for this crumb. */
  label: ReactNode
  /**
   * Renders the crumb as a plain `<a href>`. Omit it for a non-link crumb; an omitted `href` on
   * the last item makes that item the current page.
   */
  href?: string
  /**
   * Marks this crumb as the current page: rendered as a `<span aria-current="page">`, never a
   * link, even if `href` is set. Inferred for a last item without `href`.
   * @default false
   */
  current?: boolean
}

/** Props for {@link Breadcrumbs}: every native `<nav>` attribute except `children`. */
export interface BreadcrumbsProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
  /** Crumbs from the root page to the current one, in order. */
  items: BreadcrumbItem[]
  /**
   * Decorative glyph rendered between crumbs (hidden from assistive tech).
   * @default '/'
   */
  separator?: ReactNode
}

/**
 * Shows the path to the current page and lets users jump back up it.
 *
 * @remarks
 * - SSR/RSC: static (no `'use client'`); no state, hooks or DOM access, so it can render inside
 *   React Server Components.
 * - Accessibility: `<nav aria-label="Breadcrumb">` (override via the `aria-label` prop) wrapping
 *   an `<ol>`. The current page is a `<span aria-current="page">` rather than a link, and
 *   separators are `aria-hidden`.
 * - Variants: none. `separator` defaults to `'/'`; the ref points at the `<nav>`.
 * - Behaviour: the current crumb is whichever item has `current: true`, or else the last item
 *   when it has no `href`. Items with `href` render as plain `<a>` tags (not a router `Link`);
 *   for client-side routing pass a `ReactNode` label wrapped in your router's link. `className`
 *   goes on the `<nav>` and is not merged with the list styles.
 *
 * @example
 * ```tsx
 * import { Breadcrumbs } from 'sukuna-ui'
 *
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Projects', href: '/projects' },
 *     { label: 'Sukuna UI', current: true },
 *   ]}
 * />
 *
 * // Custom separator; the last item is inferred as current because it has no href.
 * <Breadcrumbs
 *   separator="›"
 *   items={[{ label: 'Docs', href: '/docs' }, { label: 'Components' }]}
 * />
 * ```
 */
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

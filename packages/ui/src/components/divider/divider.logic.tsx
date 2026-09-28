import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type DividerStyleProps, dividerStyles } from './divider.styles'

export interface DividerProps extends ComponentPropsWithoutRef<'div'>, DividerStyleProps {
  /**
   * Marks the rule as purely visual: renders `aria-hidden="true"` and drops the `separator`
   * role so assistive tech skips it. Leave unset when the rule marks a real content boundary.
   * @default false
   */
  decorative?: boolean
}

/**
 * A thin rule that separates content, horizontally or vertically.
 *
 * @remarks
 * - SSR/RSC: static, RSC-safe (no `'use client'`); no hooks, no DOM access.
 * - Accessibility: renders `<div role="separator" aria-orientation={orientation}>` (a `<div>`
 *   rather than `<hr>` so the vertical case works uniformly). With `decorative` it becomes
 *   `aria-hidden` with no role. The line colour is `border-line`, which meets 3:1 against the
 *   surface tokens where the rule conveys structure.
 * - Variants: `orientation`: 'horizontal' (default) | 'vertical'. Horizontal is `w-full` with
 *   a top border. Vertical is `h-full self-stretch` with a left border, so place it inside a
 *   flex row and it stretches to the row's height.
 * - Ref: `HTMLDivElement`. Every native `<div>` attribute is forwarded; `className` is merged
 *   last (tailwind-merge), so use it for margins (`my-4`) or a different border colour.
 *
 * @example
 * ```tsx
 * import { Divider } from 'sukuna-ui'
 *
 * // Between two sections: announced as a separator.
 * <section>
 *   <h2>Account</h2>
 *   <Divider className="my-4" />
 *   <h2>Billing</h2>
 * </section>
 *
 * // Vertical inside a flex row: stretches to the row's height.
 * <nav className="flex items-center gap-3">
 *   <a href="/docs">Docs</a>
 *   <Divider orientation="vertical" />
 *   <a href="/blog">Blog</a>
 * </nav>
 *
 * // Purely visual (e.g. between a card's header and body): hidden from assistive tech.
 * <Divider decorative />
 * ```
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', decorative, className, ...rest },
  ref,
) {
  // Keep role + aria-orientation together (a separator supports aria-orientation; a bare div
  // does not), and hide entirely when decorative.
  const a11y = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'separator', 'aria-orientation': orientation } as const)
  return <div ref={ref} className={dividerStyles({ orientation, className })} {...a11y} {...rest} />
})

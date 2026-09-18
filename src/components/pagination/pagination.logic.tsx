import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { paginationStyles } from './pagination.styles'

/** Props for {@link Pagination}: every native `<nav>` attribute except `onChange`. */
export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  /** Current page, 1-based (the first page is `1`, not `0`). */
  page: number
  /** Total number of pages; the last page button and the Next bound come from it. */
  count: number
  /**
   * Fires when the user clicks a page number, Previous or Next, with the 1-based page to show.
   * Never fires past the bounds (Previous/Next are disabled there). The component holds no state,
   * so store the value and pass it back as `page`.
   */
  onPageChange?: (page: number) => void
  /**
   * How many page buttons to show on each side of the current page before collapsing to an
   * ellipsis; first and last pages are always shown.
   * @default 1
   */
  siblingCount?: number
}

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)

/**
 * Computes which page numbers {@link Pagination} renders, with `'dots'` where a run of pages is
 * collapsed into an ellipsis.
 *
 * @remarks
 * - Pure and side-effect free; exported so you can drive a custom layout or test the branches.
 * - Every page is listed (no dots) while `count <= siblingCount * 2 + 5`. Otherwise the result
 *   always starts with `1` and ends with `count`, with at most one `'dots'` on each side of the
 *   current window and a fixed total length of `siblingCount * 2 + 5` entries.
 * - `page` is 1-based and expected to be within `1..count`; out-of-range values are not clamped.
 *
 * @param page Current page, 1-based.
 * @param count Total number of pages.
 * @param siblingCount Pages shown on each side of `page` (default `1`).
 * @returns Page numbers and `'dots'` placeholders, in render order.
 *
 * @example
 * ```ts
 * import { paginationRange } from 'sukuna-ui'
 *
 * paginationRange(5, 10) // [1, 'dots', 4, 5, 6, 'dots', 10]
 * paginationRange(1, 10) // [1, 2, 3, 4, 5, 'dots', 10]
 * paginationRange(2, 5) // [1, 2, 3, 4, 5]
 * ```
 */
export function paginationRange(
  page: number,
  count: number,
  siblingCount = 1,
): (number | 'dots')[] {
  const total = siblingCount * 2 + 5
  if (total >= count) return range(1, count)

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, count)
  const showLeftDots = left > 2
  const showRightDots = right < count - 1
  const edgeCount = 3 + 2 * siblingCount

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), 'dots', count]
  if (showLeftDots && !showRightDots) return [1, 'dots', ...range(count - edgeCount + 1, count)]
  return [1, 'dots', ...range(left, right), 'dots', count]
}

const ChevronIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Navigates between pages of results with Previous/Next buttons and numbered page buttons.
 *
 * @remarks
 * - SSR/RSC: static (no `'use client'`). It holds no state — you own `page` — so it renders in
 *   React Server Components; only the `onPageChange` handler needs a client boundary.
 * - Accessibility: `<nav aria-label="Pagination">` (override via `aria-label`) around a `<ul>` of
 *   native `<button type="button">`s. The current page has `aria-current="page"`; Previous/Next are
 *   labelled 'Previous page' / 'Next page' and are natively `disabled` on the first/last page.
 *   Ellipses are inert, `aria-hidden` text.
 * - Variants: none. `siblingCount` defaults to `1` (seven slots: `1 … 4 5 6 … 10`). Ref → `<nav>`.
 * - Behaviour: fully controlled and 1-based. Clicking the already-current page still calls
 *   `onPageChange(page)`. Pages are counted, not items — compute `count` as
 *   `Math.ceil(total / pageSize)` yourself. `className` goes on the `<nav>`.
 *
 * @example
 * ```tsx
 * import { useState } from 'react'
 * import { Pagination } from 'sukuna-ui'
 *
 * const PAGE_SIZE = 20
 * const [page, setPage] = useState(1)
 * const count = Math.ceil(results.length / PAGE_SIZE)
 * const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
 *
 * <Pagination page={page} count={count} onPageChange={setPage} />
 *
 * // Wider window: two page buttons on each side of the current page.
 * <Pagination page={page} count={count} siblingCount={2} onPageChange={setPage} />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    count,
    onPageChange,
    siblingCount = 1,
    'aria-label': ariaLabel = 'Pagination',
    className,
    ...rest
  },
  ref,
) {
  const styles = paginationStyles()
  const items = paginationRange(page, count, siblingCount)
  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...rest}>
      <ul className={styles.list()}>
        <li>
          <button
            type="button"
            aria-label="Previous page"
            className={styles.nav()}
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            <ChevronIcon dir="left" />
          </button>
        </li>
        {items.map((item, index) =>
          item === 'dots' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: dots positions are stable per render
            <li key={`dots-${index}`} className={styles.ellipsis()} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                data-active={item === page || undefined}
                className={styles.page()}
                onClick={() => onPageChange?.(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label="Next page"
            className={styles.nav()}
            disabled={page >= count}
            onClick={() => onPageChange?.(page + 1)}
          >
            <ChevronIcon dir="right" />
          </button>
        </li>
      </ul>
    </nav>
  )
})

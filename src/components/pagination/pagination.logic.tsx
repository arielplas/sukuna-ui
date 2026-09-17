import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { paginationStyles } from './pagination.styles'

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  page: number
  count: number
  onPageChange?: (page: number) => void
  siblingCount?: number
}

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)

/** Page numbers to render, with `'dots'` placeholders. Pure — exported for testing. */
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

/** Controlled pagination. Static and RSC-safe (no `'use client'`). */
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

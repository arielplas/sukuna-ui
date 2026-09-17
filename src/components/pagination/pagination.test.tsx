import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Pagination, paginationRange } from './index'

describe('paginationRange', () => {
  it('shows all pages when the count is small', () => {
    expect(paginationRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })
  it('right dots near the start', () => {
    expect(paginationRange(2, 20)).toEqual([1, 2, 3, 4, 5, 'dots', 20])
  })
  it('left dots near the end', () => {
    expect(paginationRange(19, 20)).toEqual([1, 'dots', 16, 17, 18, 19, 20])
  })
  it('both dots in the middle', () => {
    expect(paginationRange(10, 20)).toEqual([1, 'dots', 9, 10, 11, 'dots', 20])
  })
})

describe('Pagination', () => {
  it('renders a labelled nav with the current page marked', () => {
    render(<Pagination page={3} count={10} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange for a page, prev and next', async () => {
    const onPageChange = mock()
    render(<Pagination page={3} count={10} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }))
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onPageChange.mock.calls).toEqual([[4], [2], [4]])
  })

  it('disables prev on the first page and next on the last', () => {
    const { rerender } = render(<Pagination page={1} count={5} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    rerender(<Pagination page={5} count={5} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('renders on the server', () => {
    expect(renderServer(<Pagination page={1} count={3} />)).toContain('Pagination')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Pagination page={5} count={20} />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

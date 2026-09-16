import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Spinner } from './index'

describe('Spinner', () => {
  it('is a status with a default accessible name', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('accepts a custom label', () => {
    render(<Spinner label="Saving…" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving…')
  })

  it('applies the size to the svg', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.querySelector('svg')?.classList.contains('size-6')).toBe(true)
    expect(container.querySelector('svg')?.classList.contains('animate-spin')).toBe(true)
  })

  it('recolors via className and forwards ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Spinner ref={ref} className="text-success" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(el.classList.contains('text-success')).toBe(true)
    expect(el.classList.contains('text-accent')).toBe(false)
  })

  it('renders on the server', () => {
    expect(renderServer(<Spinner />)).toContain('role="status"')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

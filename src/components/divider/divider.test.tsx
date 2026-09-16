import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Divider } from './index'

describe('Divider', () => {
  it('is a separator with orientation by default', () => {
    render(<Divider data-testid="d" />)
    const el = screen.getByTestId('d')
    expect(el).toHaveAttribute('role', 'separator')
    expect(el).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('supports vertical orientation', () => {
    render(<Divider orientation="vertical" data-testid="d" />)
    expect(screen.getByTestId('d')).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getByTestId('d').classList.contains('border-l')).toBe(true)
  })

  it('decorative removes the role and hides from AT', () => {
    render(<Divider decorative data-testid="d" />)
    const el = screen.getByTestId('d')
    expect(el).not.toHaveAttribute('role')
    expect(el).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Divider ref={ref} className="my-4" data-testid="d" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(screen.getByTestId('d').classList.contains('my-4')).toBe(true)
  })

  it('renders on the server', () => {
    expect(renderServer(<Divider />)).toContain('separator')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <p>above</p>
          <Divider />
          <p>below</p>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

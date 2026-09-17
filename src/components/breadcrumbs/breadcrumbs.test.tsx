import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Breadcrumbs } from './index'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Sukuna', current: true },
]

describe('Breadcrumbs', () => {
  it('renders a labelled navigation with links', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  })

  it('marks the current page and does not link it', () => {
    render(<Breadcrumbs items={items} />)
    const current = screen.getByText('Sukuna')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Sukuna' })).toBeNull()
  })

  it('renders decorative separators between items', () => {
    const { container } = render(<Breadcrumbs items={items} separator=">" />)
    const seps = container.querySelectorAll('[aria-hidden="true"]')
    expect(seps.length).toBe(items.length - 1)
    expect(seps[0]?.textContent).toBe('>')
  })

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLElement>()
    render(<Breadcrumbs ref={ref} items={items} className="my-2" data-testid="b" />)
    expect(ref.current?.tagName).toBe('NAV')
    expect(screen.getByTestId('b').classList.contains('my-2')).toBe(true)
  })

  it('renders on the server', () => {
    expect(renderServer(<Breadcrumbs items={items} />)).toContain('Breadcrumb')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Breadcrumbs items={items} />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Button } from './index'

const variants = ['primary', 'secondary', 'ghost'] as const
const sizes = ['sm', 'md', 'lg'] as const

describe('Button', () => {
  it('renders every variant and size on the server', () => {
    for (const variant of variants)
      for (const size of sizes)
        expect(
          renderServer(
            <Button variant={variant} size={size}>
              Go
            </Button>,
          ),
        ).toContain('<button')
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Button>Go</Button>)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Button>Go</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost" aria-label="More">
            ⋯
          </Button>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })

  it('defaults type to button and can be overridden', () => {
    const { rerender } = render(<Button>Go</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    rerender(<Button type="submit">Go</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('blocks clicks and sets aria-busy while loading', async () => {
    const onClick = mock()
    render(
      <Button loading onClick={onClick}>
        Go
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('blocks clicks while disabled', async () => {
    const onClick = mock()
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows a spinner in place of the leading icon while loading', () => {
    const { container, rerender } = render(
      <Button leadingIcon={<span data-testid="icon" />}>Go</Button>,
    )
    expect(screen.queryByTestId('icon')).not.toBeNull()
    rerender(
      <Button loading leadingIcon={<span data-testid="icon" />}>
        Go
      </Button>,
    )
    expect(screen.queryByTestId('icon')).toBeNull()
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
  })

  it('renders trailing icon and keeps the label', () => {
    render(<Button trailingIcon={<span data-testid="tr" />}>Next</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Next')
    expect(screen.queryByTestId('tr')).not.toBeNull()
  })

  it('forwards ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Go</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('does not leak variant props to the DOM', () => {
    render(
      <Button variant="ghost" size="lg" fullWidth data-testid="b">
        Go
      </Button>,
    )
    const el = screen.getByTestId('b')
    for (const attr of ['variant', 'size', 'fullWidth', 'fullwidth', 'loading'])
      expect(el.hasAttribute(attr)).toBe(false)
  })

  it('lets a consumer className override a conflicting utility', () => {
    render(
      <Button className="h-20" data-testid="c">
        Go
      </Button>,
    )
    const cls = screen.getByTestId('c').classList
    expect(cls.contains('h-20')).toBe(true)
    expect(cls.contains('h-10')).toBe(false)
  })

  it('is keyboard reachable and activates on Enter', async () => {
    const onClick = mock()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await userEvent.keyboard('[Enter]')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders as an anchor with role link and the button classes when as="a"', () => {
    render(
      <Button as="a" href="/pricing" data-testid="link">
        Pricing
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Pricing' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/pricing')
    // Shares the button styling.
    expect(link.classList.contains('inline-flex')).toBe(true)
    expect(link.classList.contains('font-display')).toBe(true)
    // Anchor must not carry button-only attributes.
    expect(link.hasAttribute('type')).toBe(false)
    expect(link.hasAttribute('disabled')).toBe(false)
  })

  it('marks a disabled link with aria-disabled and removes it from the tab order', () => {
    render(
      <Button as="a" href="/pricing" disabled>
        Pricing
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Pricing' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
    expect(link.hasAttribute('disabled')).toBe(false)
    expect(link.classList.contains('aria-disabled:pointer-events-none')).toBe(true)
  })

  it('sets aria-busy and blocks activation on a loading link', () => {
    render(
      <Button as="a" href="/pricing" loading leadingIcon={<span data-testid="lead" />}>
        Pricing
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Pricing' })
    expect(link).toHaveAttribute('aria-busy', 'true')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
    // Spinner replaces the leading icon while loading.
    expect(screen.queryByTestId('lead')).toBeNull()
    expect(link.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
  })

  it('forwards ref to the anchor element when as="a"', () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <Button as="a" href="/pricing" ref={ref}>
        Pricing
      </Button>,
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('supports an icon-only link via aria-label', () => {
    render(<Button as="a" href="/next" aria-label="Next" leadingIcon={<span data-testid="ic" />} />)
    const link = screen.getByRole('link', { name: 'Next' })
    expect(link.tagName).toBe('A')
    expect(screen.queryByTestId('ic')).not.toBeNull()
  })
})

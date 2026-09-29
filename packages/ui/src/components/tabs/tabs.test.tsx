import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderServer } from '../../../../../test/ssr'
import { Tabs } from './index'

const items = [
  { value: 'account', label: 'Account', content: 'Account settings' },
  { value: 'billing', label: 'Billing', content: 'Billing details' },
  { value: 'team', label: 'Team', content: 'Team members', disabled: true },
]

describe('Tabs', () => {
  it('renders tablist and the active panel', () => {
    render(<Tabs items={items} aria-label="Settings" defaultValue="account" />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByText('Account settings')).toBeVisible()
  })

  it('switches panel on tab click and fires onValueChange', async () => {
    const onValueChange = mock()
    render(
      <Tabs
        items={items}
        aria-label="Settings"
        defaultValue="account"
        onValueChange={onValueChange}
      />,
    )
    await userEvent.click(screen.getByRole('tab', { name: 'Billing' }))
    expect(onValueChange).toHaveBeenLastCalledWith('billing')
    expect(screen.getByText('Billing details')).toBeVisible()
  })

  it('is horizontal by default with the underline styling', () => {
    render(<Tabs items={items} defaultValue="a" aria-label="Sections" />)
    expect(screen.getByRole('tablist')).not.toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getAllByRole('tab')[0]?.classList.contains('border-b-2')).toBe(true)
  })

  it('orientation="vertical" lays out a navigation column and moves with ArrowDown', async () => {
    render(<Tabs items={items} defaultValue="a" aria-label="Sections" orientation="vertical" />)
    const list = screen.getByRole('tablist')
    expect(list).toHaveAttribute('aria-orientation', 'vertical')
    expect(list.classList.contains('flex-col')).toBe(true)
    const [first, second] = screen.getAllByRole('tab') as [HTMLElement, HTMLElement]
    expect(first.classList.contains('border-r-2')).toBe(true)
    expect(first.classList.contains('border-b-2')).toBe(false)
    first.focus()
    await userEvent.keyboard('[ArrowDown]')
    expect(second).toHaveFocus()
  })

  it('pill variant renders a segmented track; underline stays the default', () => {
    const { unmount } = render(
      <Tabs items={items} aria-label="Settings" defaultValue="account" variant="pill" />,
    )
    const list = screen.getByRole('tablist')
    expect(list.classList.contains('rounded-pill')).toBe(true)
    expect(list.classList.contains('bg-well')).toBe(true)
    expect(list.classList.contains('border-b')).toBe(false)
    expect(screen.getByRole('tab', { name: 'Account' }).classList.contains('rounded-pill')).toBe(
      true,
    )
    unmount()

    render(<Tabs items={items} aria-label="Settings" defaultValue="account" />)
    const underline = screen.getByRole('tablist')
    expect(underline.classList.contains('border-b')).toBe(true)
    expect(screen.getByRole('tab', { name: 'Account' }).classList.contains('border-b-2')).toBe(true)
  })

  it('size and fitted map to their utilities', () => {
    render(<Tabs items={items} aria-label="Settings" defaultValue="account" size="lg" fitted />)
    const tab = screen.getByRole('tab', { name: 'Account' })
    expect(tab.classList.contains('h-12')).toBe(true)
    expect(tab.classList.contains('flex-1')).toBe(true)
    expect(screen.getByRole('tablist').classList.contains('w-full')).toBe(true)
  })

  it('pill has no sliding indicator; vertical tabs ignore pill and fitted', () => {
    const { container, unmount } = render(
      <Tabs items={items} aria-label="Settings" defaultValue="account" variant="pill" />,
    )
    expect(container.querySelector('[data-sk-indicator]')).toBeNull()
    unmount()

    render(
      <Tabs
        items={items}
        aria-label="Settings"
        defaultValue="account"
        orientation="vertical"
        variant="pill"
        fitted
      />,
    )
    const list = screen.getByRole('tablist')
    expect(list.classList.contains('rounded-pill')).toBe(false)
    expect(list.classList.contains('w-full')).toBe(false)
    expect(list.classList.contains('border-r')).toBe(true)
    const tab = screen.getByRole('tab', { name: 'Account' })
    expect(tab.classList.contains('border-r-2')).toBe(true)
    expect(tab.classList.contains('h-9')).toBe(true)
  })

  it('renders on the server with the tabs', () => {
    const html = renderServer(<Tabs items={items} aria-label="Settings" defaultValue="account" />)
    expect(html).toContain('Account')
    expect(html).toContain('Billing')
  })
})

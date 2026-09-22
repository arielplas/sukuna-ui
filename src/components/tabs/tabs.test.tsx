import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderServer } from '../../../test/ssr'
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
    expect(screen.getByRole('tab', { name: 'Account' }).classList.contains('border-b-2')).toBe(
      true,
    )
  })

  it('size and fitted map to their utilities', () => {
    render(<Tabs items={items} aria-label="Settings" defaultValue="account" size="lg" fitted />)
    const tab = screen.getByRole('tab', { name: 'Account' })
    expect(tab.classList.contains('h-12')).toBe(true)
    expect(tab.classList.contains('flex-1')).toBe(true)
    expect(screen.getByRole('tablist').classList.contains('w-full')).toBe(true)
  })

  it('renders on the server with the tabs', () => {
    const html = renderServer(<Tabs items={items} aria-label="Settings" defaultValue="account" />)
    expect(html).toContain('Account')
    expect(html).toContain('Billing')
  })
})

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

  it('renders on the server with the tabs', () => {
    const html = renderServer(<Tabs items={items} aria-label="Settings" defaultValue="account" />)
    expect(html).toContain('Account')
    expect(html).toContain('Billing')
  })
})

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

  it('renders on the server with the tabs', () => {
    const html = renderServer(<Tabs items={items} aria-label="Settings" defaultValue="account" />)
    expect(html).toContain('Account')
    expect(html).toContain('Billing')
  })
})

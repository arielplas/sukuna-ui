import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderServer } from '../../../../../test/ssr'
import { Button } from '../button'
import { Menu } from './index'

const items = [
  { label: 'Edit', onSelect: () => {}, id: 'edit' },
  { label: 'Duplicate', onSelect: () => {} },
  { label: 'Delete', onSelect: () => {}, disabled: true },
]

describe('Menu', () => {
  it('renders the trigger', () => {
    render(
      <Menu items={items}>
        <Button>Options</Button>
      </Menu>,
    )
    expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument()
  })

  it('renders an aria-hidden leading icon when an item has one', async () => {
    render(
      <Menu items={[{ label: 'Edit', icon: <svg data-testid="pencil" /> }, { label: 'Plain' }]}>
        <Button>Options</Button>
      </Menu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Options' }))
    const edit = await screen.findByRole('menuitem', { name: 'Edit' })
    const icon = screen.getByTestId('pencil').parentElement as HTMLElement
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(edit.contains(icon)).toBe(true)
    expect(
      screen.getByRole('menuitem', { name: 'Plain' }).querySelector('[aria-hidden]'),
    ).toBeNull()
  })

  it('does not render items while closed', () => {
    render(
      <Menu items={items}>
        <Button>Options</Button>
      </Menu>,
    )
    expect(screen.queryByText('Duplicate')).toBeNull()
  })

  it('renders the trigger (not the items) on the server', () => {
    const html = renderServer(
      <Menu items={items}>
        <button type="button">Options</button>
      </Menu>,
    )
    expect(html).toContain('Options')
    expect(html).not.toContain('Duplicate')
  })
})

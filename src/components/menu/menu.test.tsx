import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { renderServer } from '../../../test/ssr'
import { Button } from '../button'
import { Menu } from './index'

const items = [
  { label: 'Edit', onSelect: () => {} },
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

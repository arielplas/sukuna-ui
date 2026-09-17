import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { renderServer } from '../../../test/ssr'
import { Button } from '../button'
import { Drawer } from './index'

function Example({
  defaultOpen,
  side,
}: {
  defaultOpen?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
}) {
  return (
    <Drawer defaultOpen={defaultOpen}>
      <Drawer.Trigger>
        <Button>Open</Button>
      </Drawer.Trigger>
      <Drawer.Content side={side}>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Description>Refine your results.</Drawer.Description>
        <Drawer.Close>Done</Drawer.Close>
      </Drawer.Content>
    </Drawer>
  )
}

describe('Drawer', () => {
  it('renders the trigger', () => {
    render(<Example />)
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('does not render content while closed', () => {
    render(<Example />)
    expect(screen.queryByText('Filters')).toBeNull()
  })

  it('renders content and role=dialog when open, anchored to the side', () => {
    render(<Example defaultOpen side="left" />)
    expect(screen.getByText('Filters')).toBeInTheDocument()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog.classList.contains('border-r')).toBe(true) // left drawer has a right border
  })

  it('renders the trigger (not content) on the server', () => {
    const html = renderServer(<Example />)
    expect(html).toContain('Open')
    expect(html).not.toContain('Refine your results')
  })
})

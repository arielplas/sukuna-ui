import { describe, expect, it, mock } from 'bun:test'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectAccessible } from '../../../../../test/axe'
import { expectHydrates, renderServer } from '../../../../../test/ssr'
import { Button } from '../button'
import { Popover } from './index'

function Example({
  defaultOpen,
  onOpenChange,
  side,
  className,
}: {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}) {
  return (
    <Popover defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <Button variant="secondary">Filters</Button>
      </Popover.Trigger>
      <Popover.Content side={side} className={className}>
        <Popover.Title>Filter results</Popover.Title>
        <Popover.Description>Narrow the list by status.</Popover.Description>
        <Popover.Close>Done</Popover.Close>
      </Popover.Content>
    </Popover>
  )
}

describe('Popover', () => {
  it('renders the trigger with popup semantics', () => {
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Filters' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
  })

  it('does not render the content while closed', () => {
    render(<Example />)
    expect(screen.queryByText('Filter results')).toBeNull()
  })

  it('opens on click and names the dialog from the title', async () => {
    const onOpenChange = mock(() => {})
    render(<Example onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Filter results')
    expect(dialog).toHaveAccessibleDescription('Narrow the list by status.')
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('closes from Popover.Close', async () => {
    render(<Example defaultOpen />)
    await userEvent.click(screen.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(screen.queryByText('Filter results')).toBeNull())
  })

  it('defaults the side to bottom and honors an override', () => {
    const { unmount } = render(<Example defaultOpen />)
    expect(document.querySelector('[data-side="bottom"]')).not.toBeNull()
    unmount()
    render(<Example defaultOpen side="right" />)
    expect(document.querySelector('[data-side="right"]')).not.toBeNull()
  })

  it('merges a consumer className onto the popup', () => {
    render(<Example defaultOpen className="w-96" />)
    expect(screen.getByRole('dialog').classList.contains('w-96')).toBe(true)
    expect(screen.getByRole('dialog').classList.contains('w-72')).toBe(false)
  })

  it('renders only the trigger on the server and hydrates', async () => {
    const html = renderServer(<Example />)
    expect(html).toContain('Filters')
    expect(html).not.toContain('Filter results')
    await expectHydrates(<Example />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { unmount } = render(
        <div data-theme={theme}>
          <Example defaultOpen />
        </div>,
      )
      // Audit the trigger and the portalled popup, not their shared parent: Base UI's focus-guard
      // spans sit beside the trigger, aria-hidden + tabindex=0 by design (they bounce focus back).
      await expectAccessible(screen.getByRole('button', { name: 'Filters' }))
      await expectAccessible(screen.getByRole('dialog'))
      unmount()
    }
  })
})

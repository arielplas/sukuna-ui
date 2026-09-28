import { describe, expect, it, mock } from 'bun:test'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MouseEvent } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Button } from '../button'
import { AlertDialog } from './index'

function Example({
  defaultOpen,
  onAction,
  onOpenChange,
  className,
}: {
  defaultOpen?: boolean
  onAction?: (e: MouseEvent<HTMLButtonElement>) => void
  onOpenChange?: (open: boolean) => void
  className?: string
}) {
  return (
    <AlertDialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Trigger>
        <Button variant="secondary">Delete project</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content className={className}>
        <AlertDialog.Title>Delete project?</AlertDialog.Title>
        <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action onClick={onAction}>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}

describe('AlertDialog', () => {
  it('renders only the trigger while closed', () => {
    render(<Example />)
    expect(screen.getByRole('button', { name: 'Delete project' })).toBeInTheDocument()
    expect(screen.queryByText('Delete project?')).toBeNull()
  })

  it('opens from the trigger as a named, described alertdialog', async () => {
    const onOpenChange = mock(() => {})
    render(<Example onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveAccessibleName('Delete project?')
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.')
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('Action runs onClick, then closes', async () => {
    const onAction = mock(() => {})
    render(<Example defaultOpen onAction={onAction} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  })

  it('Action stays open when onClick calls preventDefault', async () => {
    render(<Example defaultOpen onAction={(e) => e.preventDefault()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('Action closes when it has no onClick', async () => {
    render(<Example defaultOpen />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  })

  it('Cancel closes without running the action', async () => {
    const onAction = mock(() => {})
    render(<Example defaultOpen onAction={onAction} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    expect(onAction).not.toHaveBeenCalled()
  })

  it('merges a consumer className onto the popup', () => {
    render(<Example defaultOpen className="max-w-sm" />)
    const dialog = screen.getByRole('alertdialog')
    expect(dialog.classList.contains('max-w-sm')).toBe(true)
    expect(dialog.classList.contains('max-w-md')).toBe(false)
  })

  it('renders only the trigger on the server and hydrates', async () => {
    const html = renderServer(<Example />)
    expect(html).toContain('Delete project')
    expect(html).not.toContain('cannot be undone')
    await expectHydrates(<Example />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { unmount } = render(
        <div data-theme={theme}>
          <Example defaultOpen />
        </div>,
      )
      // The popup itself (Base UI's focus guards around it are aria-hidden by design).
      await expectAccessible(screen.getByRole('alertdialog'))
      unmount()
    }
  })
})

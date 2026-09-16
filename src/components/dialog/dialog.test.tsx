import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { renderServer } from '../../../test/ssr'
import { Button } from '../button'
import { Dialog } from './index'

function Example({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <Dialog.Trigger>
        <Button>Open</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('renders the trigger', () => {
    render(<Example />)
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('does not render content while closed', () => {
    render(<Example />)
    expect(screen.queryByText('Delete project?')).toBeNull()
  })

  it('renders title, description and close when open', () => {
    render(<Example defaultOpen />)
    expect(screen.getByText('Delete project?')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders the trigger (not the content) on the server', () => {
    const html = renderServer(<Example />)
    expect(html).toContain('Open')
    expect(html).not.toContain('cannot be undone')
  })
})

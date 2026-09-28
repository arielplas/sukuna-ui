import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../button'
import { AlertDialog } from './index'

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  args: { children: null },
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialog.Trigger>
        <Button variant="secondary">Delete project</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete project?</AlertDialog.Title>
        <AlertDialog.Description>
          This permanently deletes the project and everything in it. This cannot be undone.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  ),
}

/** Keeps the dialog open (with a spinner) until the async work finishes, then closes it. */
export const AsyncAction: Story = {
  render: function AsyncActionStory() {
    const [open, setOpen] = useState(false)
    const [busy, setBusy] = useState(false)
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger>
          <Button variant="secondary">Discard draft</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Discard draft?</AlertDialog.Title>
          <AlertDialog.Description>Your unsaved changes will be lost.</AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Cancel disabled={busy}>Keep editing</AlertDialog.Cancel>
            <AlertDialog.Action
              loading={busy}
              onClick={(event) => {
                event.preventDefault()
                setBusy(true)
                setTimeout(() => {
                  setBusy(false)
                  setOpen(false)
                }, 1200)
              }}
            >
              Discard
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  },
}

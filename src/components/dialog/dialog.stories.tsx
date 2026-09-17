import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Select } from '../select'
import { Text } from '../text'
import { Dialog } from './index'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { children: null },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const footer = {
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
  marginTop: 20,
} as const

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Invite teammates</Dialog.Title>
        <Dialog.Description>Send an invite link to your workspace.</Dialog.Description>
        <div style={footer}>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close render={<Button>Send invite</Button>} />
        </div>
      </Dialog.Content>
    </Dialog>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="secondary">Delete project</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Description>
          This permanently deletes the project and everything in it. This cannot be undone.
        </Dialog.Description>
        <div style={footer}>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close render={<Button>Delete</Button>} />
        </div>
      </Dialog.Content>
    </Dialog>
  ),
}

/**
 * A dropdown opened inside a dialog must render *above* it. The popover layer sits above the
 * dialog layer in the z-index scale, so the Select popup is never clipped by the dialog.
 */
export const WithSelect: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button>Edit member</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Member role</Dialog.Title>
        <Dialog.Description>Choose a role for this workspace member.</Dialog.Description>
        <div style={{ marginTop: 16 }}>
          <Select
            aria-label="Role"
            defaultValue="viewer"
            items={[
              { value: 'viewer', label: 'Viewer' },
              { value: 'editor', label: 'Editor' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
        </div>
        <div style={footer}>
          <Dialog.Close render={<Button>Save</Button>} />
        </div>
      </Dialog.Content>
    </Dialog>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="ghost">Terms</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Terms of service</Dialog.Title>
        {Array.from({ length: 12 }, (_, i) => `Section ${i + 1}`).map((label) => (
          <Text key={label} tone="dim" size="sm" style={{ marginTop: 8 }}>
            {label}. Dark is the identity; light is a mode. Crimson is for action.
          </Text>
        ))}
        <div style={footer}>
          <Dialog.Close render={<Button>Accept</Button>} />
        </div>
      </Dialog.Content>
    </Dialog>
  ),
}

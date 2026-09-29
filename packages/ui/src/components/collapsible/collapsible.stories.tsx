import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Switch } from '../switch'
import { Text } from '../text'
import { Collapsible } from './index'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Collapsible>
      <Collapsible.Trigger>Advanced options</Collapsible.Trigger>
      <Collapsible.Content>
        Webhook retries, custom headers and request timeouts.
      </Collapsible.Content>
    </Collapsible>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <Collapsible.Trigger>Release notes</Collapsible.Trigger>
      <Collapsible.Content>
        Popover, AlertDialog, Textarea, Collapsible and Meter.
      </Collapsible.Content>
    </Collapsible>
  ),
}

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Switch checked={open} onCheckedChange={setOpen} aria-label="Show details" />
        <Collapsible open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger>Details</Collapsible.Trigger>
          <Collapsible.Content>
            <Text tone="dim" size="sm">
              Driven by the switch above or the trigger.
            </Text>
          </Collapsible.Content>
        </Collapsible>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled>
      <Collapsible.Trigger>Locked section</Collapsible.Trigger>
      <Collapsible.Content>Unreachable.</Collapsible.Content>
    </Collapsible>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { Dialog } from '../dialog'
import { Popover } from './index'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: { children: null },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <Button variant="secondary">Filters</Button>
      </Popover.Trigger>
      <Popover.Content align="start">
        <Popover.Title>Filter results</Popover.Title>
        <Popover.Description>Show only matching items.</Popover.Description>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          <Checkbox label="Active" defaultChecked />
          <Checkbox label="Archived" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <Popover.Close>Done</Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  ),
}

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, padding: 120, justifyContent: 'center' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <Popover.Trigger>
            <Button variant="ghost">{side}</Button>
          </Popover.Trigger>
          <Popover.Content side={side}>
            <Popover.Title>Opens {side}</Popover.Title>
          </Popover.Content>
        </Popover>
      ))}
    </div>
  ),
}

/** A popover opened inside a dialog renders above it (popover layer 60 > dialog layer 50). */
export const InsideDialog: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Project settings</Dialog.Title>
        <div style={{ marginTop: 16 }}>
          <Popover>
            <Popover.Trigger>
              <Button variant="secondary">More info</Button>
            </Popover.Trigger>
            <Popover.Content>
              <Popover.Title>Visible above the dialog</Popover.Title>
            </Popover.Content>
          </Popover>
        </div>
      </Dialog.Content>
    </Dialog>
  ),
}

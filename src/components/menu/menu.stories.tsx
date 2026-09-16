import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Menu } from './index'

const items = [
  { label: 'Edit', onSelect: () => {} },
  { label: 'Duplicate', onSelect: () => {} },
  { label: 'Archive', onSelect: () => {} },
  { label: 'Delete', onSelect: () => {}, disabled: true },
]

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: { items, children: <Button variant="secondary">Options</Button> },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 40 }}>
      <Menu {...args}>
        <Button variant="secondary">Options</Button>
      </Menu>
    </div>
  ),
}

export const WithDisabled: Story = { ...Default }

export const Sides: Story = {
  render: (args) => (
    <div style={{ padding: 40 }}>
      <Menu {...args} side="right" align="start">
        <Button variant="ghost">Open right</Button>
      </Menu>
    </div>
  ),
}

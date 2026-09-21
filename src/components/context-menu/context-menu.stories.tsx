import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextMenu } from './index'

const items = [
  { label: 'Copy', onSelect: () => {} },
  { label: 'Rename', onSelect: () => {} },
  { label: 'Duplicate', onSelect: () => {} },
  { label: 'Delete', onSelect: () => {}, disabled: true },
]

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  args: { items, children: <div /> },
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

const Area = ({ label }: { label: string }) => (
  <div className="grid h-40 w-72 place-items-center rounded-md border border-line bg-surface-2 text-text-dim">
    {label}
  </div>
)

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 40 }}>
      <ContextMenu {...args}>
        <Area label="Right-click me" />
      </ContextMenu>
    </div>
  ),
}

export const WithDisabled: Story = { ...Default }

export const OnACard: Story = {
  render: (args) => (
    <div style={{ padding: 40 }}>
      <ContextMenu {...args}>
        <div className="w-72 rounded-lg border border-line bg-surface p-4 shadow-card">
          <h3 className="font-display font-bold text-text">Project file</h3>
          <p className="mt-1 text-sm text-text-dim">Right-click for actions.</p>
        </div>
      </ContextMenu>
    </div>
  ),
}

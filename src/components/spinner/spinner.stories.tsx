import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './index'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
}

export const Inline: Story = {
  render: (args) => (
    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: 'var(--sk-text)' }}>
      <Spinner {...args} size="sm" /> Loading your workspace…
    </span>
  ),
}

export const Recolored: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Spinner {...args} className="text-success" label="Success spinner" />
      <Spinner {...args} className="text-text-dim" label="Muted spinner" />
    </div>
  ),
}

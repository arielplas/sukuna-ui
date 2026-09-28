import type { Meta, StoryObj } from '@storybook/react-vite'
import { Meter } from './index'

const meta = {
  title: 'Components/Meter',
  component: Meter,
  tags: ['autodocs'],
  args: { label: 'Storage', value: 62, showValue: true },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Meter>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Meter label="Accent" value={70} showValue />
      <Meter label="Success" value={45} tone="success" showValue />
      <Meter label="Premium" value={90} tone="premium" showValue />
    </div>
  ),
}

export const Storage: Story = {
  args: {
    label: 'Storage used',
    value: 3.2,
    max: 5,
    format: { style: 'unit', unit: 'gigabyte', maximumFractionDigits: 1 },
    'aria-valuetext': '3.2 of 5 GB used',
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Meter aria-label="Small" value={40} size="sm" />
      <Meter aria-label="Medium" value={40} size="md" />
    </div>
  ),
}

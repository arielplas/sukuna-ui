import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberField } from './index'

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  args: { defaultValue: 1, 'aria-label': 'Quantity' },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}>
      <NumberField {...args} size="sm" aria-label="Small" />
      <NumberField {...args} size="md" aria-label="Medium" />
      <NumberField {...args} size="lg" aria-label="Large" />
    </div>
  ),
}

export const WithMinMax: Story = {
  args: { defaultValue: 1, min: 1, max: 5, 'aria-label': 'Between 1 and 5' },
}

export const Currency: Story = {
  args: {
    defaultValue: 1234.5,
    min: 0,
    step: 0.5,
    format: { style: 'currency', currency: 'USD' },
    'aria-label': 'Price',
  },
}

export const Percent: Story = {
  args: {
    defaultValue: 0.2,
    min: 0,
    max: 1,
    step: 0.05,
    format: { style: 'percent' },
    'aria-label': 'Rate',
  },
}

export const ReadOnly: Story = {
  args: { defaultValue: 42, readOnly: true, 'aria-label': 'Read only' },
}

export const Disabled: Story = {
  args: { defaultValue: 42, disabled: true, 'aria-label': 'Disabled' },
}

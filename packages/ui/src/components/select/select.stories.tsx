import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './index'

const items = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular', disabled: true },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { items, placeholder: 'Choose a framework', 'aria-label': 'Framework' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDefault: Story = { args: { defaultValue: 'vue' } }

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Select {...args} size="sm" />
      <Select {...args} size="md" />
      <Select {...args} size="lg" />
    </div>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Select {...args} variant="filled" placeholder="filled" />
      <Select {...args} variant="outline" placeholder="outline" />
      <Select {...args} variant="ghost" placeholder="ghost" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, defaultValue: 'react' } }

export const WithDisabledItem: Story = {}

const numbers = Array.from({ length: 100 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}))

/** 100 items (1 … 100) — the popup scrolls; no windowing is applied. Several stacked vertically. */
export const ManyItems: Story = {
  args: { items: numbers, placeholder: 'Pick a number', 'aria-label': 'Number' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 240 }}>
      <Select {...args} aria-label="First number" />
      <Select {...args} aria-label="Second number" defaultValue="42" />
      <Select {...args} aria-label="Third number" size="sm" />
      <Select {...args} aria-label="Fourth number" defaultValue="100" />
    </div>
  ),
}

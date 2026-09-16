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
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, defaultValue: 'react' } }

export const WithDisabledItem: Story = {}

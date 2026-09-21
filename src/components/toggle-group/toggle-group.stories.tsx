import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle, ToggleGroup } from './index'

const align = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: { items: align, 'aria-label': 'Text alignment', defaultValue: 'left' },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Segmented: Story = {}

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['left'],
    'aria-label': 'Text format',
    items: [
      { value: 'bold', label: 'Bold' },
      { value: 'italic', label: 'Italic' },
      { value: 'underline', label: 'Underline' },
    ],
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <ToggleGroup {...args} size="sm" aria-label="Small" />
      <ToggleGroup {...args} size="md" aria-label="Medium" />
      <ToggleGroup {...args} size="lg" aria-label="Large" />
    </div>
  ),
}

export const Vertical: Story = { args: { orientation: 'vertical' } }

export const Disabled: Story = {
  args: {
    items: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center', disabled: true },
      { value: 'right', label: 'Right' },
    ],
  },
}

export const SingleToggle: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Toggle aria-label="Bold" defaultPressed>
        <b>B</b>
      </Toggle>
      <Toggle aria-label="Italic">
        <i>I</i>
      </Toggle>
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip } from './index'

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Chip' },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } as const

export const Tones: Story = {
  render: (args) => (
    <div style={row}>
      {(['neutral', 'accent', 'success', 'premium'] as const).map((tone) => (
        <Chip key={tone} {...args} tone={tone}>
          {tone}
        </Chip>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <div key={variant} style={row}>
          {(['neutral', 'accent', 'success', 'premium'] as const).map((tone) => (
            <Chip key={tone} {...args} tone={tone} variant={variant}>
              {variant} {tone}
            </Chip>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const FilterChips: Story = {
  name: 'Selected (filter chips)',
  render: (args) => (
    <div style={row}>
      <Chip {...args} variant="outline" selected>
        All
      </Chip>
      <Chip {...args} variant="outline">
        Open
      </Chip>
      <Chip {...args} variant="outline">
        Closed
      </Chip>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} size="sm">
        small
      </Chip>
      <Chip {...args} size="md">
        medium
      </Chip>
    </div>
  ),
}

export const Dismissible: Story = {
  render: (args) => (
    <div style={row}>
      <Chip {...args} onDismiss={() => {}}>
        React
      </Chip>
      <Chip {...args} tone="accent" onDismiss={() => {}}>
        Active filter
      </Chip>
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <Chip {...args} leadingIcon={<span aria-hidden>●</span>} tone="success">
      Online
    </Chip>
  ),
}

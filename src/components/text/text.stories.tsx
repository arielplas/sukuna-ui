import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './index'

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'The quick brown fox jumps over the lazy dog' },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((size) => (
        <Text key={size} {...args} size={size} font="display">
          {size} — Sukuna
        </Text>
      ))}
    </div>
  ),
}

export const Weights: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['regular', 'semibold', 'bold', 'black'] as const).map((weight) => (
        <Text key={weight} {...args} weight={weight} size="xl">
          {weight}
        </Text>
      ))}
    </div>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['default', 'dim', 'faint', 'accent', 'success', 'premium'] as const).map((tone) => (
        <Text key={tone} {...args} tone={tone}>
          {tone}
        </Text>
      ))}
    </div>
  ),
}

export const Alignment: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      {(['start', 'center', 'end'] as const).map((align) => (
        <Text key={align} {...args} align={align}>
          {align}
        </Text>
      ))}
    </div>
  ),
}

export const Tracking: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text {...args} tracking="tight" size="xl" font="display">
        Tight tracking headline
      </Text>
      <Text {...args} tracking="eyebrow" size="xs" tone="dim">
        Eyebrow label
      </Text>
    </div>
  ),
}

export const Truncate: Story = {
  args: { truncate: true },
  render: (args) => (
    <div style={{ width: 200 }}>
      <Text {...args} />
    </div>
  ),
}

export const Numeric: Story = {
  args: { numeric: true, children: '1,204,983.50' },
}

export const AsElements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Text {...args} as="h3" size="lg" weight="bold">
        h3 heading
      </Text>
      <Text {...args} as="label">
        label element
      </Text>
      <Text {...args} as="small" tone="dim">
        small print
      </Text>
    </div>
  ),
}

export const Headline: Story = {
  args: {
    as: 'h1',
    font: 'display',
    size: '3xl',
    weight: 'black',
    tracking: 'tight',
    children: 'Dark is the identity',
  },
}

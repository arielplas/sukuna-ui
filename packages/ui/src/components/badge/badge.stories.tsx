import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './index'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } as const

export const Playground: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div style={row}>
      {(['neutral', 'accent', 'success', 'premium'] as const).map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Badge {...args} size="sm">
        small
      </Badge>
      <Badge {...args} size="md">
        medium
      </Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: (args) => (
    <div style={row}>
      {(['neutral', 'accent', 'success', 'premium'] as const).map((tone) => (
        <Badge key={tone} {...args} tone={tone} dot>
          {tone}
        </Badge>
      ))}
    </div>
  ),
}

export const Live: Story = {
  args: { tone: 'accent', dot: true, children: 'LIVE' },
}

export const InText: Story = {
  render: (args) => (
    <p style={{ color: 'var(--sk-text)', fontFamily: 'var(--sk-font-sans)' }}>
      Streaming now{' '}
      <Badge {...args} tone="accent" dot>
        LIVE
      </Badge>{' '}
      — join before it ends.
    </p>
  ),
}

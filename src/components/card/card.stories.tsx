import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../badge'
import { Text } from '../text'
import { Card } from './index'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: { children: 'Card content' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const grid = { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 200px)' } as const

export const Playground: Story = {}

export const Elevations: Story = {
  render: (args) => (
    <div style={grid}>
      {(['flat', 'raised', 'sunken'] as const).map((elevation) => (
        <Card key={elevation} {...args} elevation={elevation}>
          {elevation}
        </Card>
      ))}
    </div>
  ),
}

export const Padding: Story = {
  render: (args) => (
    <div style={grid}>
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} {...args} padding={padding}>
          padding {padding}
        </Card>
      ))}
    </div>
  ),
}

export const Radius: Story = {
  render: (args) => (
    <div style={grid}>
      <Card {...args} radius="md">
        radius md
      </Card>
      <Card {...args} radius="lg">
        radius lg
      </Card>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <Card elevation="raised" style={{ maxWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text as="h3" font="display" size="lg" weight="bold">
          Pro plan
        </Text>
        <Badge tone="premium">PREMIUM</Badge>
      </div>
      <Text tone="dim" size="sm" style={{ marginTop: 8 }}>
        Everything in Free, plus unlimited projects and priority support.
      </Text>
    </Card>
  ),
}

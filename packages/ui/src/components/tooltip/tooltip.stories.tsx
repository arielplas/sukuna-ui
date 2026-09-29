import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Tooltip } from './index'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Saved to your library',
    children: <Button variant="secondary">Hover or focus me</Button>,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Tooltip {...args} />
    </div>
  ),
}

export const Sides: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, padding: 80 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={`side: ${side}`}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const WithDelay: Story = {
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Tooltip {...args} delay={600} content="Appears after 600ms">
        <Button variant="ghost">Slow tooltip</Button>
      </Tooltip>
    </div>
  ),
}

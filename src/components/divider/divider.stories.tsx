import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './index'

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ width: 280 }}>
      <Divider {...args} />
    </div>
  ),
}

export const Vertical: Story = {
  render: (args) => (
    <div style={{ display: 'flex', height: 40, alignItems: 'stretch', gap: 12 }}>
      <span>Left</span>
      <Divider {...args} orientation="vertical" />
      <span>Right</span>
    </div>
  ),
}

export const InText: Story = {
  render: (args) => (
    <div style={{ width: 280, color: 'var(--sk-text)', fontFamily: 'var(--sk-font-sans)' }}>
      <p style={{ margin: 0 }}>Section one</p>
      <Divider {...args} style={{ margin: '12px 0' }} />
      <p style={{ margin: 0 }}>Section two</p>
    </div>
  ),
}

export const Decorative: Story = { args: { decorative: true }, ...Horizontal }

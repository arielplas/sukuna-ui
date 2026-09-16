import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './index'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { fallback: 'AR' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/80?img=12', alt: 'A person' },
}

export const Fallback: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      {['AR', 'JS', 'KL', 'MN'].map((initials, i) => (
        <Avatar
          key={initials}
          fallback={initials}
          style={{ marginLeft: i === 0 ? 0 : -10, boxShadow: '0 0 0 2px var(--sk-bg)' }}
        />
      ))}
    </div>
  ),
}

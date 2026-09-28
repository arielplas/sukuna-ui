import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShinyText } from './index'

const meta = {
  title: 'Components/ShinyText',
  component: ShinyText,
  tags: ['autodocs'],
  args: { children: 'Limited drop' },
} satisfies Meta<typeof ShinyText>

export default meta
type Story = StoryObj<typeof meta>

const wrap = { fontFamily: 'var(--sk-font-display)', fontWeight: 700, fontSize: 24 } as const

export const Playground: Story = {}

export const Speeds: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, ...wrap }}>
      <ShinyText speed="slow">Slow shimmer</ShinyText>
      <ShinyText speed="normal">Normal shimmer</ShinyText>
      <ShinyText speed="fast">Fast shimmer</ShinyText>
    </div>
  ),
}

export const OnLabel: Story = {
  render: () => (
    <span style={{ ...wrap, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
      <ShinyText as="strong">New</ShinyText>
    </span>
  ),
}

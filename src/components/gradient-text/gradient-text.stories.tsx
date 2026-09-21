import type { Meta, StoryObj } from '@storybook/react-vite'
import { GradientText } from './index'

const meta = {
  title: 'Components/GradientText',
  component: GradientText,
  tags: ['autodocs'],
  args: { children: 'Malevolent Shrine' },
} satisfies Meta<typeof GradientText>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Headline: Story = {
  render: () => (
    <GradientText
      as="h1"
      className="text-3xl font-display font-black tracking-tight"
      style={{ fontFamily: 'var(--sk-font-display)' }}
    >
      Malevolent Shrine
    </GradientText>
  ),
}

export const InParagraph: Story = {
  render: () => (
    <p style={{ color: 'var(--sk-text)', fontFamily: 'var(--sk-font-sans)', fontSize: 18 }}>
      The one and only{' '}
      <GradientText className="font-bold" style={{ fontFamily: 'var(--sk-font-display)' }}>
        King of Curses
      </GradientText>
      .
    </p>
  ),
}

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

const display = { fontFamily: 'var(--sk-font-display)' } as const

export const Playground: Story = {}

export const Hero: Story = {
  render: () => (
    <GradientText
      as="h1"
      className="font-black tracking-tight"
      style={{ ...display, fontSize: 72, lineHeight: 1.05 }}
    >
      King of Curses
    </GradientText>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, ...display, fontWeight: 800 }}>
      {[24, 36, 54, 80].map((px) => (
        <GradientText key={px} style={{ fontSize: px, lineHeight: 1.1 }}>
          Sukuna {px}px
        </GradientText>
      ))}
    </div>
  ),
}

export const GradientVsSolid: Story = {
  name: 'Gradient vs solid (proof)',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...display,
        fontWeight: 900,
        fontSize: 60,
        lineHeight: 1.1,
      }}
    >
      <GradientText>Gradient fill</GradientText>
      <span style={{ color: 'var(--sk-accent)' }}>Solid accent</span>
    </div>
  ),
}

export const CustomGradient: Story = {
  name: 'Custom gradient (style override)',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...display,
        fontWeight: 900,
        fontSize: 56,
        lineHeight: 1.1,
      }}
    >
      <GradientText style={{ backgroundImage: 'linear-gradient(90deg,#FF3B4E,#FF9E00)' }}>
        Crimson to gold
      </GradientText>
      <GradientText style={{ backgroundImage: 'linear-gradient(90deg,#FF3B4E,#FF7AC6)' }}>
        Crimson to pink
      </GradientText>
      <GradientText style={{ backgroundImage: 'linear-gradient(90deg,#7C3AED,#22D3EE)' }}>
        Violet to cyan
      </GradientText>
    </div>
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

import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard } from './index'

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  args: { children: null },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

const Card = () => (
  <div style={{ display: 'grid', gap: 4 }}>
    <div className="font-display font-bold text-text">Ryomen Sukuna</div>
    <div className="text-text-dim">King of Curses · 1,000 fingers</div>
  </div>
)

export const Default: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard>
        <HoverCard.Trigger href="/sukuna" className="text-accent underline underline-offset-2">
          @sukuna
        </HoverCard.Trigger>
        <HoverCard.Content>
          <Card />
        </HoverCard.Content>
      </HoverCard>
    </div>
  ),
}

export const Sides: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard>
        <HoverCard.Trigger href="/sukuna" className="text-accent underline underline-offset-2">
          @sukuna
        </HoverCard.Trigger>
        <HoverCard.Content side="right" align="start">
          <Card />
        </HoverCard.Content>
      </HoverCard>
    </div>
  ),
}

export const WithLink: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <HoverCard>
        <HoverCard.Trigger href="/sukuna" className="text-accent underline underline-offset-2">
          jujutsu-kaisen/sukuna
        </HoverCard.Trigger>
        <HoverCard.Content className="w-72">
          <div className="font-display font-bold text-text">sukuna</div>
          <p className="mt-1 text-text-dim">A cursed-technique reference implementation.</p>
          <a href="/sukuna" className="mt-3 inline-block text-accent underline underline-offset-2">
            View profile →
          </a>
        </HoverCard.Content>
      </HoverCard>
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Carousel } from './index'

const panel = (label: string, bg: string) => (
  <div
    key={label}
    style={{
      height: 200,
      display: 'grid',
      placeItems: 'center',
      background: bg,
      color: 'var(--sk-text)',
      fontFamily: 'var(--sk-font-display)',
      fontSize: 28,
      fontWeight: 800,
      borderRadius: 'var(--sk-radius-md)',
    }}
  >
    {label}
  </div>
)

const defaultSlides = [
  panel('One', 'var(--sk-surface-2)'),
  panel('Two', 'var(--sk-well)'),
  panel('Three', 'var(--sk-surface-2)'),
]

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: { 'aria-label': 'Featured', children: defaultSlides },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Loop: Story = { args: { loop: true } }

export const Autoplay: Story = { args: { loop: true, autoplay: true, autoplayInterval: 3000 } }

export const Controlled: Story = {
  render: () => {
    const [i, setI] = useState(0)
    return (
      <div>
        <Carousel aria-label="Controlled" index={i} onIndexChange={setI}>
          {panel('One', 'var(--sk-surface-2)')}
          {panel('Two', 'var(--sk-well)')}
        </Carousel>
        <p style={{ marginTop: 8, color: 'var(--sk-text-dim)', fontFamily: 'var(--sk-font-sans)' }}>
          Active slide: {i + 1}
        </p>
      </div>
    )
  },
}

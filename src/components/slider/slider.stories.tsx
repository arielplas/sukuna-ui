import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './index'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { 'aria-label': 'Volume' },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 65 } }
export const Steps: Story = { args: { defaultValue: 40, step: 10 } }
export const Disabled: Story = { args: { defaultValue: 30, disabled: true } }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from './index'

const steps = [
  { label: 'Account', description: 'Your details' },
  { label: 'Payment', description: 'Card or bank' },
  { label: 'Confirm', description: 'Review & submit' },
]

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: steps.map(({ label }) => ({ label })), activeStep: 1, 'aria-label': 'Checkout' },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ width: 480 }}>
      <Stepper {...args} />
    </div>
  ),
}
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const WithDescriptions: Story = {
  render: (args) => (
    <div style={{ width: 520 }}>
      <Stepper {...args} steps={steps} />
    </div>
  ),
}
export const FirstStep: Story = { args: { activeStep: 0 } }
export const Completed: Story = { args: { activeStep: 3 } }

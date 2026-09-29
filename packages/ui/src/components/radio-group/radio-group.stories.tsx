import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup } from './index'

const items = [
  { value: 'card', label: 'Card' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'crypto', label: 'Crypto', disabled: true },
]

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { items, 'aria-label': 'Payment method' },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Horizontal: Story = { args: { orientation: 'horizontal' } }
export const WithDefault: Story = { args: { defaultValue: 'bank' } }
export const DisabledOption: Story = { args: { defaultValue: 'card' } }

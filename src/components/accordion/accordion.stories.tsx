import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from './index'

const items = [
  { value: 'ship', trigger: 'Shipping', content: 'Orders ship within 2–3 business days.' },
  { value: 'returns', trigger: 'Returns', content: 'Free returns within 30 days of delivery.' },
  { value: 'warranty', trigger: 'Warranty', content: 'One-year limited warranty on all items.' },
]

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { items },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 380 }}>
      <Accordion {...args} />
    </div>
  ),
}
export const OpenMultiple: Story = {
  render: (args) => (
    <div style={{ width: 380 }}>
      <Accordion {...args} openMultiple defaultValue={['ship', 'returns']} />
    </div>
  ),
}
export const WithDefault: Story = {
  render: (args) => (
    <div style={{ width: 380 }}>
      <Accordion {...args} defaultValue={['warranty']} />
    </div>
  ),
}

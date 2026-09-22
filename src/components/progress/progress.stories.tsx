import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './index'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { 'aria-label': 'Progress' },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = { args: { value: 64 } }
export const Indeterminate: Story = { args: { value: null } }
export const WithLabel: Story = { args: { value: 40, label: 'Uploading…' } }

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Progress {...args} value={50} size="sm" />
      <Progress {...args} value={50} size="md" />
      <Progress {...args} value={50} size="lg" />
    </div>
  ),
}

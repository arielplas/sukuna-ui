import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { ToastProvider, useToast } from './index'

function Trigger({ description }: { description?: string }) {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Saved', description })}>Show toast</Button>
}

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: { children: null },
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <ToastProvider>
      <Trigger description="Your changes were saved to the cloud." />
    </ToastProvider>
  ),
}

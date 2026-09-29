import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { ToastProvider, type ToastTone, useToast } from './index'

function Trigger({ description }: { description?: string }) {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Saved', description })}>Show toast</Button>
}

const TONES: { tone: ToastTone; title: string; description: string }[] = [
  { tone: 'info', title: 'Heads up', description: 'A new version is available.' },
  { tone: 'success', title: 'Saved', description: 'Your changes are live.' },
  { tone: 'warning', title: 'Storage almost full', description: '92% of your quota is used.' },
  { tone: 'danger', title: 'Upload failed', description: 'The file could not be sent.' },
]

function ToneTriggers() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {TONES.map((t) => (
        <Button key={t.tone} variant="secondary" onClick={() => toast(t)}>
          {t.tone}
        </Button>
      ))}
    </div>
  )
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

export const Tones: Story = {
  render: () => (
    <ToastProvider>
      <ToneTriggers />
    </ToastProvider>
  ),
}

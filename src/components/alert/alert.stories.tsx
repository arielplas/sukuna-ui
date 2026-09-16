import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './index'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { title: 'Heads up', children: 'This is an alert message with some detail.' },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const InfoIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Info: Story = { args: { tone: 'info' } }
export const Success: Story = { args: { tone: 'success' } }
export const Warning: Story = { args: { tone: 'warning' } }
export const Danger: Story = { args: { tone: 'danger', role: 'alert' } }

export const WithIcon: Story = { args: { tone: 'info', icon: <InfoIcon /> } }

export const TitleOnly: Story = { args: { title: undefined, children: 'Just a one-line note.' } }

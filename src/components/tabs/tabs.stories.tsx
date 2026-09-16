import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './index'

const items = [
  { value: 'account', label: 'Account', content: 'Manage your account settings.' },
  { value: 'billing', label: 'Billing', content: 'Update your billing details.' },
  { value: 'team', label: 'Team', content: 'Invite and manage teammates.', disabled: true },
]

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { items, 'aria-label': 'Settings', defaultValue: 'account' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithDefault: Story = { args: { defaultValue: 'billing' } }
export const DisabledTab: Story = {}

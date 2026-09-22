import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './index'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { 'aria-label': 'Wi-Fi' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Switch {...args} size="sm" />
      <Switch {...args} size="md" />
      <Switch {...args} size="lg" />
    </div>
  ),
}

export const On: Story = { args: { defaultChecked: true } }

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      <Switch {...args} disabled />
      <Switch {...args} disabled defaultChecked />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-flex',
        gap: 12,
        alignItems: 'center',
        color: 'var(--sk-text)',
        fontFamily: 'var(--sk-font-sans)',
      }}
    >
      <span id="notif-label">Notifications</span>
      <Switch aria-labelledby="notif-label" />
    </div>
  ),
}

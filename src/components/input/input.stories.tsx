import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './index'

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'you@example.com', 'aria-label': 'Email' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const col = { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 } as const

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={col}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input key={size} {...args} size={size} placeholder={`size ${size}`} />
      ))}
    </div>
  ),
}

export const Invalid: Story = { args: { invalid: true, defaultValue: 'not-an-email' } }

export const Disabled: Story = { args: { disabled: true, defaultValue: 'locked' } }

export const Types: Story = {
  render: (args) => (
    <div style={col}>
      <Input {...args} type="text" placeholder="text" />
      <Input {...args} type="password" placeholder="password" />
      <Input {...args} type="number" placeholder="number" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div style={col}>
      <label
        htmlFor="email-demo"
        style={{ color: 'var(--sk-text)', fontFamily: 'var(--sk-font-sans)' }}
      >
        Email
      </label>
      <Input {...args} id="email-demo" aria-label={undefined} />
    </div>
  ),
}

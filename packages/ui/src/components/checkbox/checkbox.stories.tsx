import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './index'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { 'aria-label': 'Accept' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Checkbox {...args} size="sm" />
      <Checkbox {...args} size="md" />
    </div>
  ),
}

export const Checked: Story = { args: { defaultChecked: true } }

export const Indeterminate: Story = { args: { indeterminate: true } }

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      <Checkbox {...args} disabled />
      <Checkbox {...args} disabled defaultChecked />
    </div>
  ),
}

export const WithLabel: Story = {
  args: { 'aria-label': undefined, label: 'Email me product updates' },
}

/** Naming the bare input from outside with `<label htmlFor>` also works. */
export const ExternalLabel: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-flex',
        gap: 8,
        alignItems: 'center',
        color: 'var(--sk-text)',
        fontFamily: 'var(--sk-font-sans)',
      }}
    >
      <Checkbox id="updates" />
      <label htmlFor="updates" style={{ cursor: 'pointer' }}>
        Email me product updates
      </label>
    </div>
  ),
}

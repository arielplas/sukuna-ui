import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../field'
import { Textarea } from './index'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { 'aria-label': 'Notes', placeholder: 'Write something…' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Textarea aria-label="Small" size="sm" placeholder="sm" />
      <Textarea aria-label="Medium" size="md" placeholder="md" />
      <Textarea aria-label="Large" size="lg" placeholder="lg" />
    </div>
  ),
}

/** Grows with its content (CSS `field-sizing`) — keep typing new lines. */
export const AutoResize: Story = {
  args: { autoResize: true, resize: 'none', rows: 2, placeholder: 'Grows as you type…' },
}

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'Too short' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Read-only history' },
}

export const InField: Story = {
  render: () => (
    <Field>
      <Field.Label>Description</Field.Label>
      <Field.Control render={<Textarea placeholder="What is this project about?" />} />
      <Field.Description>Markdown is supported.</Field.Description>
    </Field>
  ),
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../checkbox'
import { Input } from '../input'
import { Field } from './index'

const meta = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

const box = { maxWidth: 320 } as const

export const Playground: Story = {
  render: () => (
    <div style={box}>
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input type="email" placeholder="you@example.com" />} />
      </Field>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div style={box}>
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input type="email" placeholder="you@example.com" />} />
        <Field.Description>We&rsquo;ll only use this for account notices.</Field.Description>
      </Field>
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div style={box}>
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input type="email" defaultValue="not-an-email" invalid />} />
        <Field.Description>Work address only.</Field.Description>
        <Field.Error>Enter a valid email address.</Field.Error>
      </Field>
    </div>
  ),
}

export const CheckboxField: Story = {
  render: () => (
    <div style={box}>
      <Field>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Field.Control render={<Checkbox />} />
          <Field.Label>Subscribe to the newsletter</Field.Label>
        </div>
        <Field.Description>One email a week, no more.</Field.Description>
      </Field>
    </div>
  ),
}

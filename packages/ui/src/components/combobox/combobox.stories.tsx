import type { Meta, StoryObj } from '@storybook/react-vite'
import { Combobox } from './index'

const items = ['React', 'Vue', 'Svelte', 'Solid', 'Angular', 'Preact', 'Qwik', 'Astro']

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { items, 'aria-label': 'Framework', placeholder: 'Search frameworks…' },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Combobox {...args} />
    </div>
  ),
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'React' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'React' } }

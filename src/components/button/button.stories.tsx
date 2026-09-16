import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './index'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Start 7-day free trial' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } as const
const ArrowIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} leadingIcon={<ArrowIcon />}>
        Leading
      </Button>
      <Button {...args} trailingIcon={<ArrowIcon />}>
        Trailing
      </Button>
    </div>
  ),
}

export const Loading: Story = { args: { loading: true } }

export const Disabled: Story = { args: { disabled: true } }

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Button {...args} />
    </div>
  ),
}

export const IconOnly: Story = {
  args: { 'aria-label': 'Next', children: undefined, leadingIcon: <ArrowIcon /> },
  render: (args) => <Button {...args} />,
}

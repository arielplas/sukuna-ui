import type { Meta, StoryObj } from '@storybook/react-vite'
import { Counter } from './index'

const meta = {
  title: 'Components/Counter',
  component: Counter,
  tags: ['autodocs'],
  args: { value: 1240 },
} satisfies Meta<typeof Counter>

export default meta
type Story = StoryObj<typeof meta>

const stat = {
  fontFamily: 'var(--sk-font-display)',
  fontWeight: 700,
  fontSize: 34,
  color: 'var(--sk-text)',
} as const

const Stat = (props: React.ComponentProps<typeof Counter>) => (
  <span style={stat}>
    <Counter {...props} />
  </span>
)

export const Playground: Story = {}

export const Basic: Story = {
  render: (args) => <Stat {...args} />,
}

export const Currency: Story = {
  render: () => <Stat value={4999} prefix="$" format={(n) => `$${n.toLocaleString()}`} />,
}

export const Percentage: Story = {
  render: () => <Stat value={99.9} decimals={1} suffix="%" />,
}

export const Decimals: Story = {
  render: () => <Stat value={1234.567} decimals={2} />,
}

export const FromNonZero: Story = {
  render: () => <Stat value={1280} from={1000} />,
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumbs } from './index'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Sukuna', current: true },
]

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: { items },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const CustomSeparator: Story = { args: { separator: '›' } }
export const LongTrail: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Workspace', href: '/w' },
      { label: 'Projects', href: '/w/p' },
      { label: 'Sukuna', href: '/w/p/sukuna' },
      { label: 'Settings', current: true },
    ],
  },
}

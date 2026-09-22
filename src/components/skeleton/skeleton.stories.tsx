import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './index'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = { args: { variant: 'text', className: 'w-48' } }
export const Rectangular: Story = { args: { variant: 'rectangular', className: 'h-24 w-64' } }
export const Circular: Story = { args: { variant: 'circular', className: 'size-12' } }

export const Shimmer: Story = {
  render: () => (
    <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton animation="shimmer" variant="rectangular" className="h-32 w-full" />
      <Skeleton animation="shimmer" variant="text" className="w-3/4" />
      <Skeleton animation="shimmer" variant="text" className="w-1/2" />
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton variant="rectangular" className="h-32 w-full" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circular" className="size-10" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    </div>
  ),
}

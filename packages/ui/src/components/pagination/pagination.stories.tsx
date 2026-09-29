import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pagination } from './index'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { count: 10, page: 1 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function Interactive({ count, page: initial }: { count: number; page: number }) {
  const [page, setPage] = useState(initial)
  return <Pagination count={count} page={page} onPageChange={setPage} />
}

export const Default: Story = { render: (args) => <Interactive count={args.count} page={1} /> }
export const ManyPages: Story = { render: () => <Interactive count={20} page={10} /> }
export const FirstPage: Story = { render: () => <Interactive count={8} page={1} /> }
export const LastPage: Story = { render: () => <Interactive count={8} page={8} /> }

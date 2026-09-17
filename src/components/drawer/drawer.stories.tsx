import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Drawer } from './index'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { children: null },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const panel = (side: 'left' | 'right' | 'top' | 'bottom') => (
  <Drawer>
    <Drawer.Trigger>
      <Button variant="secondary">Open {side}</Button>
    </Drawer.Trigger>
    <Drawer.Content side={side}>
      <Drawer.Title>Filters</Drawer.Title>
      <Drawer.Description>Refine your results.</Drawer.Description>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
        <Drawer.Close render={<Button>Done</Button>} />
      </div>
    </Drawer.Content>
  </Drawer>
)

export const Right: Story = { render: () => panel('right') }
export const Left: Story = { render: () => panel('left') }
export const Top: Story = { render: () => panel('top') }
export const Bottom: Story = { render: () => panel('bottom') }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../badge'
import { Table } from './index'

const rows = [
  { name: 'Ariel', role: 'Owner', status: 'Active' },
  { name: 'Jordan', role: 'Editor', status: 'Active' },
  { name: 'Kim', role: 'Viewer', status: 'Invited' },
]

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Name</Table.HeaderCell>
          <Table.HeaderCell scope="col">Role</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell>{r.role}</Table.Cell>
            <Table.Cell>
              <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
}

const Rows = () => (
  <>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell scope="col">Name</Table.HeaderCell>
        <Table.HeaderCell scope="col">Role</Table.HeaderCell>
        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {rows.map((r) => (
        <Table.Row key={r.name}>
          <Table.Cell>{r.name}</Table.Cell>
          <Table.Cell>{r.role}</Table.Cell>
          <Table.Cell>{r.status}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </>
)

export const Compact: Story = {
  render: () => (
    <Table density="compact">
      <Rows />
    </Table>
  ),
}

export const Striped: Story = {
  render: () => (
    <Table striped>
      <Rows />
    </Table>
  ),
}

export const Hoverable: Story = {
  render: () => (
    <Table hoverable>
      <Rows />
    </Table>
  ),
}

export const StripedHoverableCompact: Story = {
  render: () => (
    <Table density="compact" striped hoverable>
      <Rows />
    </Table>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Name</Table.HeaderCell>
          <Table.HeaderCell scope="col">Role</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.name} data-interactive>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell>{r.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
}

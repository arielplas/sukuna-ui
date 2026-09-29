import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArchiveIcon, CopyIcon, PencilIcon, TrashIcon } from '../../stories/icons'
import { Badge } from '../badge'
import { Table } from '../table'
import { RowActions } from './index'

const items = [
  { label: 'Edit', icon: <PencilIcon />, onSelect: () => {} },
  { label: 'Duplicate', icon: <CopyIcon />, onSelect: () => {} },
  { label: 'Archive', icon: <ArchiveIcon />, onSelect: () => {} },
  { label: 'Delete', icon: <TrashIcon />, onSelect: () => {} },
]

const meta = {
  title: 'Components/RowActions',
  component: RowActions,
  tags: ['autodocs'],
  args: { items, 'aria-label': 'Actions for invoice #42' },
} satisfies Meta<typeof RowActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const members = [
  { name: 'Ariel', role: 'Owner', status: 'Active' },
  { name: 'Jordan', role: 'Editor', status: 'Active' },
  { name: 'Kim', role: 'Viewer', status: 'Invited' },
]

/** The actions column: `Table.ActionsHeaderCell` + `Table.ActionsCell` holding a `RowActions`. */
export const InTable: Story = {
  render: () => (
    <Table aria-label="Team members">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Name</Table.HeaderCell>
          <Table.HeaderCell scope="col">Role</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
          <Table.ActionsHeaderCell scope="col" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.map((m) => (
          <Table.Row key={m.name}>
            <Table.Cell>{m.name}</Table.Cell>
            <Table.Cell>{m.role}</Table.Cell>
            <Table.Cell>
              <Badge tone={m.status === 'Active' ? 'success' : 'neutral'}>{m.status}</Badge>
            </Table.Cell>
            <Table.ActionsCell>
              <RowActions
                aria-label={`Actions for ${m.name}`}
                items={[
                  { label: 'Edit', icon: <PencilIcon />, onSelect: () => {} },
                  { label: 'Duplicate', icon: <CopyIcon />, onSelect: () => {} },
                  {
                    label: 'Remove',
                    icon: <TrashIcon />,
                    onSelect: () => {},
                    disabled: m.role === 'Owner',
                  },
                ]}
              />
            </Table.ActionsCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
}

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: 'Edit', icon: <PencilIcon />, onSelect: () => {} },
      { label: 'Delete', icon: <TrashIcon />, onSelect: () => {}, disabled: true },
    ],
  },
}

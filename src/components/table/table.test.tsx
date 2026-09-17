import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Table } from './index'

function Example() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Name</Table.HeaderCell>
          <Table.HeaderCell scope="col">Role</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Ariel</Table.Cell>
          <Table.Cell>Owner</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

describe('Table', () => {
  it('renders a semantic table with headers and rows', () => {
    render(<Example />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getByRole('cell', { name: 'Ariel' })).toBeInTheDocument()
  })

  it('resolves header cells to th and data cells to td', () => {
    render(<Example />)
    expect(screen.getByText('Name').tagName).toBe('TH')
    expect(screen.getByText('Owner').tagName).toBe('TD')
  })

  it('forwards ref to the table and merges className', () => {
    const ref = createRef<HTMLTableElement>()
    render(
      <Table ref={ref} className="text-md">
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(ref.current?.tagName).toBe('TABLE')
    expect(ref.current?.classList.contains('text-md')).toBe(true)
  })

  it('wraps the table in a horizontal-scroll container', () => {
    const { container } = render(<Example />)
    const wrapper = container.querySelector('div')
    expect(wrapper?.classList.contains('overflow-x-auto')).toBe(true)
  })

  it('renders on the server', () => {
    expect(renderServer(<Example />)).toContain('<table')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Example />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

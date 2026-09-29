import { describe, expect, it, mock } from 'bun:test'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expectAccessible } from '../../../../../test/axe'
import { expectHydrates, renderServer } from '../../../../../test/ssr'
import type { MenuItemOption } from '../menu'
import { Table } from '../table'
import { RowActions } from './index'

const makeItems = (onEdit = () => {}): MenuItemOption[] => [
  { label: 'Edit', icon: <svg data-testid="edit-icon" />, onSelect: onEdit, id: 'edit' },
  { label: 'Delete', onSelect: () => {}, disabled: true, id: 'delete' },
]

describe('RowActions', () => {
  it('renders a small square ghost trigger with a default name', () => {
    render(<RowActions items={makeItems()} />)
    const trigger = screen.getByRole('button', { name: 'Row actions' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger.classList.contains('w-8')).toBe(true)
    expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('opens the menu with icon items and runs onSelect', async () => {
    const onEdit = mock(() => {})
    render(<RowActions aria-label="Actions for Ariel" items={makeItems(onEdit)} />)
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Ariel' }))
    const edit = await screen.findByRole('menuitem', { name: 'Edit' })
    expect(edit.contains(screen.getByTestId('edit-icon'))).toBe(true)
    await userEvent.click(edit)
    expect(onEdit).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })

  it('opens aligned to the end by default and honors size, side and align', async () => {
    const { unmount } = render(<RowActions items={makeItems()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Row actions' }))
    expect(document.querySelector('[data-align="end"]')).not.toBeNull()
    unmount()
    render(<RowActions items={makeItems()} size="md" side="left" align="start" />)
    const trigger = screen.getByRole('button', { name: 'Row actions' })
    expect(trigger.classList.contains('w-10')).toBe(true)
    await userEvent.click(trigger)
    expect(document.querySelector('[data-side="left"]')).not.toBeNull()
  })

  it('a disabled trigger does not open', async () => {
    render(<RowActions items={makeItems()} disabled />)
    const trigger = screen.getByRole('button', { name: 'Row actions' })
    expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('forwards the ref to the trigger and merges className', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<RowActions ref={ref} items={makeItems()} className="text-accent" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.classList.contains('text-accent')).toBe(true)
  })

  it('renders only the trigger on the server and hydrates', async () => {
    const html = renderServer(<RowActions items={makeItems()} />)
    expect(html).toContain('Row actions')
    expect(html).not.toContain('Edit')
    await expectHydrates(<RowActions items={makeItems()} />)
  })

  it('is accessible in a table actions column, both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Table aria-label="Team">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Name</Table.HeaderCell>
                <Table.ActionsHeaderCell scope="col" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Ariel</Table.Cell>
                <Table.ActionsCell>
                  <RowActions aria-label="Actions for Ariel" items={makeItems()} />
                </Table.ActionsCell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

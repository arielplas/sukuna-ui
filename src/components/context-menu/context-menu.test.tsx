import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { renderServer } from '../../../test/ssr'
import { ContextMenu } from './index'

const makeItems = (onCopy = () => {}) => [
  { label: 'Copy', onSelect: onCopy, id: 'copy' },
  { label: 'Paste', onSelect: () => {} }, // no id → falls back to index
  { label: 'Delete', onSelect: () => {}, disabled: true },
]

describe('ContextMenu', () => {
  it('renders the trigger area', () => {
    render(
      <ContextMenu items={makeItems()}>
        <div>Right-click me</div>
      </ContextMenu>,
    )
    expect(screen.getByText('Right-click me')).toBeInTheDocument()
  })

  it('does not render items until opened', () => {
    render(
      <ContextMenu items={makeItems()}>
        <div>area</div>
      </ContextMenu>,
    )
    expect(screen.queryByText('Copy')).toBeNull()
  })

  it('opens on the contextmenu event and renders items (keyed with and without id)', () => {
    render(
      <ContextMenu items={makeItems()}>
        <div>area</div>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('area'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument()
  })

  it('runs onSelect when an item is chosen', () => {
    const onCopy = mock(() => {})
    render(
      <ContextMenu items={makeItems(onCopy)}>
        <div>area</div>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('area'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }))
    expect(onCopy).toHaveBeenCalled()
  })

  it('renders a disabled item as disabled', () => {
    render(
      <ContextMenu items={makeItems()}>
        <div>area</div>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('area'))
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-disabled')
  })

  it('renders only the trigger on the server', () => {
    const html = renderServer(
      <ContextMenu items={makeItems()}>
        <div>area</div>
      </ContextMenu>,
    )
    expect(html).toContain('area')
    expect(html).not.toContain('Copy')
  })
})

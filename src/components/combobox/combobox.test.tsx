import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderServer } from '../../../test/ssr'
import { Combobox } from './index'

const items = ['Apple', 'Banana', 'Cherry', 'Grape']

describe('Combobox', () => {
  it('renders a combobox input', () => {
    render(<Combobox items={items} aria-label="Fruit" />)
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeInTheDocument()
  })

  it('maps variant and size onto the input; filled/md is the unchanged default', () => {
    render(
      <>
        <Combobox items={items} aria-label="filled" />
        <Combobox items={items} aria-label="ghost" variant="ghost" size="lg" />
      </>,
    )
    const filled = screen.getByRole('combobox', { name: 'filled' }).classList
    expect(filled.contains('bg-surface-2')).toBe(true)
    expect(filled.contains('h-10')).toBe(true)
    const ghost = screen.getByRole('combobox', { name: 'ghost' }).classList
    expect(ghost.contains('border-transparent')).toBe(true)
    expect(ghost.contains('h-12')).toBe(true)
    expect(ghost.contains('bg-surface-2')).toBe(false)
  })

  it('does not render options until typing', () => {
    render(<Combobox items={items} aria-label="Fruit" />)
    expect(screen.queryByRole('option', { name: 'Banana' })).toBeNull()
  })

  it('filters options as the user types', async () => {
    render(<Combobox items={items} aria-label="Fruit" />)
    await userEvent.type(screen.getByRole('combobox', { name: 'Fruit' }), 'ap')
    // "Apple" and "Grape" contain "ap"; "Banana" does not.
    expect(await screen.findByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Banana' })).toBeNull()
  })

  it('caps the number of rendered suggestions with maxRenderedItems', async () => {
    const many = ['Apple', 'Apricot', 'Avocado', 'Almond', 'Acai']
    render(<Combobox items={many} maxRenderedItems={2} aria-label="Fruit" />)
    // Every item contains "a"; the cap limits the displayed list to 2 even though all 5 match.
    await userEvent.type(screen.getByRole('combobox', { name: 'Fruit' }), 'a')
    expect(await screen.findAllByRole('option')).toHaveLength(2)
  })

  it('renders the input on the server', () => {
    expect(
      renderServer(<Combobox items={items} placeholder="Find fruit" aria-label="Fruit" />),
    ).toContain('Find fruit')
  })
})

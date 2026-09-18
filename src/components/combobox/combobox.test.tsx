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

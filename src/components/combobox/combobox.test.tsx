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

  it('renders the input on the server', () => {
    expect(
      renderServer(<Combobox items={items} placeholder="Find fruit" aria-label="Fruit" />),
    ).toContain('Find fruit')
  })
})

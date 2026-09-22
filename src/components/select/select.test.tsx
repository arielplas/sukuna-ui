import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderServer } from '../../../test/ssr'
import { Select } from './index'

const items = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte', disabled: true },
]

describe('Select', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(<Select items={items} placeholder="Pick a framework" aria-label="Framework" />)
    expect(screen.getByText('Pick a framework')).toBeInTheDocument()
  })

  it('shows the selected label for defaultValue', () => {
    render(<Select items={items} defaultValue="vue" aria-label="Framework" />)
    expect(screen.getByText('Vue')).toBeInTheDocument()
  })

  it('renders a trigger with combobox/button role', () => {
    render(<Select items={items} aria-label="Framework" />)
    // Base UI select trigger is a button.
    expect(screen.getByRole('combobox', { name: 'Framework' })).toBeInTheDocument()
  })

  it('maps variant onto the trigger; filled is the unchanged default', () => {
    render(
      <>
        <Select items={items} aria-label="filled" />
        <Select items={items} aria-label="outline" variant="outline" />
        <Select items={items} aria-label="ghost" variant="ghost" />
      </>,
    )
    const cls = (name: string) => screen.getByRole('combobox', { name }).classList
    expect(cls('filled').contains('bg-surface-2')).toBe(true)
    expect(cls('filled').contains('border-line')).toBe(true)
    expect(cls('outline').contains('bg-transparent')).toBe(true)
    expect(cls('outline').contains('border-line')).toBe(true)
    expect(cls('ghost').contains('border-transparent')).toBe(true)
    expect(cls('ghost').contains('bg-surface-2')).toBe(false)
  })

  it('does not render the option list while closed', () => {
    render(<Select items={items} aria-label="Framework" />)
    expect(screen.queryByText('Svelte')).toBeNull()
  })

  it('fires onValueChange when an option is chosen (open list)', async () => {
    const onValueChange = mock()
    render(
      <Select items={items} defaultOpen onValueChange={onValueChange} aria-label="Framework" />,
    )
    await userEvent.click(await screen.findByRole('option', { name: 'React' }))
    expect(onValueChange).toHaveBeenCalledWith('react')
  })

  it('renders the trigger (not the list) on the server', () => {
    const html = renderServer(
      <Select items={items} placeholder="server-placeholder" aria-label="Framework" />,
    )
    expect(html).toContain('server-placeholder')
    expect(html).not.toContain('Svelte')
  })
})

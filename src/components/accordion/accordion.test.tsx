import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderServer } from '../../../test/ssr'
import { Accordion } from './index'

const items = [
  { value: 'ship', trigger: 'Shipping', content: 'Ships in 2–3 days.' },
  { value: 'returns', trigger: 'Returns', content: '30-day returns.' },
]

describe('Accordion', () => {
  it('renders a trigger per item', () => {
    render(<Accordion items={items} />)
    expect(screen.getByRole('button', { name: 'Shipping' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Returns' })).toBeInTheDocument()
  })

  it('shows content for a defaultValue-open item', () => {
    render(<Accordion items={items} defaultValue={['ship']} />)
    expect(screen.getByText('Ships in 2–3 days.')).toBeVisible()
  })

  it('toggles a panel on trigger click and fires onValueChange', async () => {
    const onValueChange = mock()
    render(<Accordion items={items} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Returns' }))
    expect(onValueChange).toHaveBeenCalled()
    expect(screen.getByText('30-day returns.')).toBeVisible()
  })

  it('renders on the server', () => {
    const html = renderServer(<Accordion items={items} />)
    expect(html).toContain('Shipping')
    expect(html).toContain('Returns')
  })
})

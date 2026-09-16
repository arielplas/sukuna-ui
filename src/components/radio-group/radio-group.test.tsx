import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { RadioGroup } from './index'

const items = [
  { value: 'card', label: 'Card' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'crypto', label: 'Crypto', disabled: true },
]

describe('RadioGroup', () => {
  it('renders a labelled control per option', () => {
    render(<RadioGroup items={items} aria-label="Payment" />)
    // Each radio is named via aria-labelledby → discoverable by accessible name.
    expect(screen.getByRole('radio', { name: 'Card' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Bank transfer' })).toBeInTheDocument()
  })

  it('selects on click and fires onValueChange (uncontrolled)', async () => {
    const onValueChange = mock()
    render(<RadioGroup items={items} aria-label="Payment" onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Bank transfer' }))
    expect(onValueChange).toHaveBeenLastCalledWith('bank')
  })

  it('drives a controlled parent', async () => {
    function Controlled() {
      const [v, setV] = useState('card')
      return <RadioGroup items={items} aria-label="Payment" value={v} onValueChange={setV} />
    }
    render(<Controlled />)
    await userEvent.click(screen.getByRole('radio', { name: 'Bank transfer' }))
    expect(screen.getByRole('radio', { name: 'Bank transfer' })).toBeChecked()
  })

  it('does not select a disabled option', async () => {
    const onValueChange = mock()
    render(<RadioGroup items={items} aria-label="Payment" onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Crypto' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('renders on the server', () => {
    expect(renderServer(<RadioGroup items={items} aria-label="Payment" />)).toContain(
      'Bank transfer',
    )
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <RadioGroup items={items} aria-label="Payment" defaultValue="card" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { NumberField } from './index'

const sizes = ['sm', 'md', 'lg'] as const

describe('NumberField', () => {
  it('renders the input and both steppers on the server', () => {
    for (const size of sizes) {
      const html = renderServer(<NumberField size={size} defaultValue={1} aria-label="qty" />)
      expect(html).toContain('<input')
    }
    render(<NumberField defaultValue={1} aria-label="qty" />)
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument()
  })

  it('shows the initial value', () => {
    render(<NumberField defaultValue={7} aria-label="qty" />)
    expect(screen.getByRole('textbox')).toHaveValue('7')
  })

  it('increments and decrements, reporting via onValueChange', async () => {
    let last: number | null | undefined
    render(
      <NumberField
        defaultValue={1}
        onValueChange={(v) => {
          last = v
        }}
        aria-label="qty"
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(screen.getByRole('textbox')).toHaveValue('2')
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(last).toBe(1)
  })

  it('works uncontrolled without an onValueChange handler', async () => {
    render(<NumberField defaultValue={0} aria-label="qty" />)
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(screen.getByRole('textbox')).toHaveValue('1')
  })

  it('disables the stepper at a reached bound', () => {
    render(<NumberField defaultValue={5} max={5} min={0} aria-label="qty" />)
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decrease' })).not.toBeDisabled()
  })

  it('formats the value via Intl options', () => {
    render(
      <NumberField
        defaultValue={1234.5}
        format={{ style: 'currency', currency: 'USD' }}
        aria-label="price"
      />,
    )
    expect(screen.getByRole('textbox')).toHaveValue('$1,234.50')
  })

  it('readOnly marks the input read-only', () => {
    render(<NumberField defaultValue={3} readOnly aria-label="qty" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('applies disabled to the whole field', () => {
    render(<NumberField defaultValue={3} disabled aria-label="qty" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('forwards ref and native props to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<NumberField ref={ref} defaultValue={1} name="count" placeholder="0" aria-label="qty" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '0')
  })

  it('does not leak the size variant onto the DOM input', () => {
    render(<NumberField defaultValue={1} size="lg" aria-label="qty" />)
    expect(screen.getByRole('textbox').hasAttribute('size')).toBe(false)
  })

  it('lets a consumer className override a group utility', () => {
    const { container } = render(
      <NumberField defaultValue={1} className="rounded-none" aria-label="qty" />,
    )
    const group = container.querySelector('.rounded-none')
    expect(group).not.toBeNull()
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<NumberField defaultValue={2} aria-label="qty" />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <label htmlFor="qty">Quantity</label>
          <NumberField id="qty" defaultValue={1} min={0} max={10} />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Checkbox } from './index'

describe('Checkbox', () => {
  it('renders every size on the server', () => {
    for (const size of ['sm', 'md'] as const)
      expect(renderServer(<Checkbox size={size} aria-label="c" />)).toContain('type="checkbox"')
  })

  it('toggles when uncontrolled and fires onCheckedChange', async () => {
    const onCheckedChange = mock()
    render(<Checkbox aria-label="agree" onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole<HTMLInputElement>('checkbox')
    expect(el.checked).toBe(false)
    await userEvent.click(el)
    expect(el.checked).toBe(true)
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
  })

  it('respects a controlled checked value', async () => {
    const onCheckedChange = mock()
    render(<Checkbox aria-label="c" checked={false} onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole<HTMLInputElement>('checkbox')
    await userEvent.click(el)
    expect(el.checked).toBe(false) // stays until parent updates
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('drives a controlled parent', async () => {
    function Controlled() {
      const [on, setOn] = useState(false)
      return <Checkbox aria-label="c" checked={on} onCheckedChange={setOn} />
    }
    render(<Controlled />)
    const el = screen.getByRole<HTMLInputElement>('checkbox')
    await userEvent.click(el)
    expect(el.checked).toBe(true)
  })

  it('sets the indeterminate DOM property', () => {
    render(<Checkbox aria-label="c" indeterminate />)
    expect(screen.getByRole<HTMLInputElement>('checkbox').indeterminate).toBe(true)
  })

  it('disabled blocks toggling', async () => {
    const onCheckedChange = mock()
    render(<Checkbox aria-label="c" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('forwards ref (object and callback forms)', () => {
    const objRef = createRef<HTMLInputElement>()
    render(<Checkbox aria-label="c" ref={objRef} />)
    expect(objRef.current).toBeInstanceOf(HTMLInputElement)

    let cbNode: HTMLInputElement | null = null
    render(
      <Checkbox
        aria-label="c2"
        ref={(n) => {
          cbNode = n
        }}
      />,
    )
    expect(cbNode).toBeInstanceOf(HTMLInputElement)
  })

  it('toggles with the Space key', async () => {
    render(<Checkbox aria-label="c" />)
    const el = screen.getByRole<HTMLInputElement>('checkbox')
    await userEvent.tab()
    expect(el).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(el.checked).toBe(true)
  })

  it('does not leak variant props and lets className override', () => {
    render(<Checkbox aria-label="c" size="sm" className="size-8" data-testid="c" />)
    const el = screen.getByTestId('c')
    expect(el.hasAttribute('size')).toBe(false)
    expect(el.classList.contains('size-8')).toBe(true)
    expect(el.classList.contains('size-4')).toBe(false)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Checkbox aria-label="h" defaultChecked />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <label htmlFor="terms">Accept terms</label>
          <Checkbox id="terms" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

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

  it('toggles with the Enter key and does not submit the form', async () => {
    const onSubmit = mock((e: { preventDefault: () => void }) => e.preventDefault())
    const onKeyDown = mock(() => {})
    render(
      <form onSubmit={onSubmit}>
        <Checkbox aria-label="c" onKeyDown={onKeyDown} />
      </form>,
    )
    const el = screen.getByRole<HTMLInputElement>('checkbox')
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(el.checked).toBe(true)
    await userEvent.keyboard('{Enter}')
    expect(el.checked).toBe(false)
    expect(onKeyDown).toHaveBeenCalledTimes(2)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('leaves Enter alone when the consumer already prevented it', async () => {
    render(<Checkbox aria-label="c" onKeyDown={(e) => e.preventDefault()} />)
    const el = screen.getByRole<HTMLInputElement>('checkbox')
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(el.checked).toBe(false)
  })

  it('renders `label` inside a <label>, so clicking the text toggles and names the box', async () => {
    const onCheckedChange = mock(() => {})
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} label="Email me updates" onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Email me updates' })
    expect(ref.current).toBe(el)
    expect(el.closest('label')).not.toBeNull()
    await userEvent.click(screen.getByText('Email me updates'))
    expect(el.checked).toBe(true)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('dims the label text when disabled and renders it on the server', () => {
    const html = renderServer(<Checkbox label="Off" disabled />)
    expect(html).toContain('<label')
    expect(html).toContain('has-[:disabled]:text-text-dim')
    expect(html).toContain('>Off<')
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

  it('is accessible with a label prop in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Checkbox label="Accept the terms" defaultChecked />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
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

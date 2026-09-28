import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Field } from '../field'
import { Textarea } from './index'

describe('Textarea', () => {
  it('renders a textbox with 3 rows and vertical resize by default', () => {
    render(<Textarea aria-label="Bio" />)
    const el = screen.getByRole('textbox', { name: 'Bio' })
    expect(el.tagName).toBe('TEXTAREA')
    expect(el).toHaveAttribute('rows', '3')
    expect(el.classList.contains('resize-y')).toBe(true)
    expect(el.classList.contains('min-h-20')).toBe(true)
    expect(el).not.toHaveAttribute('aria-invalid')
  })

  it('renders every size on the server', () => {
    for (const [size, cls] of [
      ['sm', 'min-h-16'],
      ['md', 'min-h-20'],
      ['lg', 'min-h-24'],
    ] as const) {
      expect(renderServer(<Textarea aria-label="x" size={size} />)).toContain(cls)
    }
  })

  it('invalid sets aria-invalid and the crimson border', () => {
    render(<Textarea aria-label="Bio" invalid />)
    const el = screen.getByRole('textbox')
    expect(el).toHaveAttribute('aria-invalid', 'true')
    expect(el.classList.contains('border-accent')).toBe(true)
  })

  it('applies resize and autoResize variants', () => {
    render(<Textarea aria-label="a" resize="none" autoResize />)
    const el = screen.getByRole('textbox')
    expect(el.classList.contains('resize-none')).toBe(true)
    expect(el.classList.contains('[field-sizing:content]')).toBe(true)
  })

  it('forwards the ref, merges className and fires onChange', async () => {
    const ref = createRef<HTMLTextAreaElement>()
    const onChange = mock(() => {})
    render(<Textarea aria-label="a" ref={ref} rows={6} className="min-h-40" onChange={onChange} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    expect(ref.current).toHaveAttribute('rows', '6')
    expect(ref.current?.classList.contains('min-h-40')).toBe(true)
    expect(ref.current?.classList.contains('min-h-20')).toBe(false)
    await userEvent.type(screen.getByRole('textbox'), 'hi')
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('is labelled by Field when rendered through Field.Control', () => {
    render(
      <Field>
        <Field.Label>Description</Field.Label>
        <Field.Control render={<Textarea />} />
      </Field>,
    )
    expect(screen.getByLabelText('Description').tagName).toBe('TEXTAREA')
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Textarea aria-label="Bio" defaultValue="hello" />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { unmount, container } = render(
        <div data-theme={theme}>
          <label htmlFor="t">Notes</label>
          <Textarea id="t" invalid />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Input } from '../input'
import { Field } from './index'

describe('Field', () => {
  it('associates the label with the control', async () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input type="email" />} />
      </Field>,
    )
    // Association proven by name-based lookup (htmlFor ↔ control id).
    const input = screen.getByLabelText<HTMLInputElement>('Email')
    expect(input).toBeInstanceOf(HTMLInputElement)
    // Clicking the label focuses the control.
    await userEvent.click(screen.getByText('Email'))
    expect(input).toHaveFocus()
  })

  it('links description and error via aria-describedby', () => {
    render(
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input type="email" />} />
        <Field.Description>Work address only.</Field.Description>
        <Field.Error>Enter a valid email.</Field.Error>
      </Field>,
    )
    const describedby = screen.getByLabelText('Email').getAttribute('aria-describedby') ?? ''
    expect(describedby).toContain(screen.getByText('Work address only.').id)
    expect(describedby).toContain(screen.getByText('Enter a valid email.').id)
  })

  it('sets aria-invalid on the control only when invalid', () => {
    const Tree = ({ invalid }: { invalid?: boolean }) => (
      <Field invalid={invalid}>
        <Field.Label>Name</Field.Label>
        <Field.Control render={<Input />} />
      </Field>
    )
    const { rerender } = render(<Tree />)
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
    rerender(<Tree invalid />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not render the error when the field is valid', () => {
    render(
      <Field>
        <Field.Label>City</Field.Label>
        <Field.Control render={<Input />} />
        <Field.Error>Required.</Field.Error>
      </Field>,
    )
    expect(screen.queryByText('Required.')).toBeNull()
  })

  it('renders the error when match is forced', () => {
    render(
      <Field>
        <Field.Label>Zip</Field.Label>
        <Field.Control render={<Input />} />
        <Field.Error match>Forced error.</Field.Error>
      </Field>,
    )
    expect(screen.getByText('Forced error.')).toBeInTheDocument()
  })

  it('renders on the server', () => {
    const html = renderServer(
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input type="email" />} />
        <Field.Description>Work address only.</Field.Description>
        <Field.Error>Bad email.</Field.Error>
      </Field>,
    )
    expect(html).toContain('Email')
    expect(html).toContain('<input')
    expect(html).toContain('Work address only.')
    expect(html).toContain('Bad email.')
  })

  it('merges a consumer className onto each slot', () => {
    render(
      <Field className="mt-4">
        <Field.Label className="uppercase">Email</Field.Label>
        <Field.Control render={<Input aria-label="email" />} className="ring-1" />
        <Field.Description className="italic">Desc</Field.Description>
        <Field.Error match className="font-bold">
          Err
        </Field.Error>
      </Field>,
    )
    expect(screen.getByText('Email').className).toContain('uppercase')
    expect(screen.getByText('Desc').className).toContain('italic')
    expect(screen.getByText('Err').className).toContain('font-bold')
  })

  it('is accessible in both themes, valid and invalid', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Field>
            <Field.Label>Email</Field.Label>
            <Field.Control render={<Input type="email" />} />
            <Field.Description>Work address only.</Field.Description>
          </Field>
          <Field invalid>
            <Field.Label>Password</Field.Label>
            <Field.Control render={<Input type="password" />} />
            <Field.Error>Required.</Field.Error>
          </Field>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

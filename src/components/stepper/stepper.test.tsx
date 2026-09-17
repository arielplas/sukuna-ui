import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Stepper } from './index'

const steps = [
  { label: 'Account', description: 'Your details' },
  { label: 'Payment' },
  { label: 'Confirm' },
]

describe('Stepper', () => {
  it('renders a list item per step with an accessible label', () => {
    render(<Stepper steps={steps} activeStep={1} aria-label="Checkout" />)
    expect(screen.getByRole('list', { name: 'Checkout' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('marks the current step with aria-current', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    const items = screen.getAllByRole('listitem')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
    expect(items[0]).not.toHaveAttribute('aria-current')
  })

  it('shows a check for completed steps and the number otherwise', () => {
    const { container } = render(<Stepper steps={steps} activeStep={2} />)
    // steps 0 and 1 completed → 2 check svgs
    expect(container.querySelectorAll('svg[aria-hidden="true"]').length).toBe(2)
    expect(screen.getByText('3')).toBeInTheDocument() // upcoming shows its number
  })

  it('renders descriptions and forwards ref + className', () => {
    const ref = createRef<HTMLOListElement>()
    render(<Stepper ref={ref} steps={steps} activeStep={0} className="gap-6" data-testid="s" />)
    expect(ref.current?.tagName).toBe('OL')
    expect(screen.getByText('Your details')).toBeInTheDocument()
    expect(screen.getByTestId('s').classList.contains('gap-6')).toBe(true)
  })

  it('renders on the server', () => {
    expect(renderServer(<Stepper steps={steps} activeStep={0} />)).toContain('Payment')
  })

  it('is accessible in both themes and orientations', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Stepper steps={steps} activeStep={1} />
          <Stepper steps={steps} activeStep={1} orientation="vertical" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

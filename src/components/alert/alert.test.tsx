import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Alert } from './index'

const tones = ['info', 'success', 'warning', 'danger'] as const

describe('Alert', () => {
  it('renders every tone on the server', () => {
    for (const tone of tones) expect(renderServer(<Alert tone={tone}>msg</Alert>)).toContain('msg')
  })

  it('has role status by default and can be overridden', () => {
    const { rerender } = render(<Alert data-testid="a">hi</Alert>)
    expect(screen.getByTestId('a')).toHaveAttribute('role', 'status')
    rerender(
      <Alert data-testid="a" role="alert">
        hi
      </Alert>,
    )
    expect(screen.getByTestId('a')).toHaveAttribute('role', 'alert')
  })

  it('applies the tone border color', () => {
    render(
      <Alert tone="danger" data-testid="a">
        boom
      </Alert>,
    )
    expect(screen.getByTestId('a').classList.contains('border-l-accent')).toBe(true)
  })

  it('renders title and body; icon only when provided', () => {
    const { rerender, container } = render(<Alert title="Heads up">body text</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('body text')).toBeInTheDocument()
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
    rerender(
      <Alert title="Heads up" icon={<svg data-testid="ic" />}>
        body text
      </Alert>,
    )
    expect(screen.getByTestId('ic')).toBeInTheDocument()
  })

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Alert ref={ref} className="mt-8" data-testid="a">
        x
      </Alert>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(screen.getByTestId('a').classList.contains('mt-8')).toBe(true)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          {tones.map((tone) => (
            <Alert key={tone} tone={tone} title={tone}>
              {tone} message
            </Alert>
          ))}
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

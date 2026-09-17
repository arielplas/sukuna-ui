import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Slider } from './index'

// Value changes / keyboard are exercised in test/browser/slider.test.ts — Base UI's slider
// references a global `event` during interaction that happy-dom doesn't provide, so unit tests
// stay non-interactive (render + semantics + SSR).
describe('Slider', () => {
  it('renders a slider with the current value, min and max', () => {
    render(<Slider defaultValue={30} min={0} max={100} aria-label="Volume" />)
    const el = screen.getByRole('slider')
    expect(el).toHaveAttribute('aria-valuenow', '30')
    expect(el).toHaveAttribute('min', '0')
    expect(el).toHaveAttribute('max', '100')
  })

  it('names the slider via aria-label', () => {
    render(<Slider defaultValue={10} aria-label="Brightness" />)
    expect(screen.getByRole('slider', { name: 'Brightness' })).toBeInTheDocument()
  })

  it('merges className on the root', () => {
    render(<Slider defaultValue={10} aria-label="Volume" className="max-w-xs" />)
    expect(screen.getByRole('group').classList.contains('max-w-xs')).toBe(true)
  })

  it('renders on the server', () => {
    expect(renderServer(<Slider defaultValue={20} aria-label="Volume" />)).toContain('Volume')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Slider defaultValue={40} aria-label="Volume" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

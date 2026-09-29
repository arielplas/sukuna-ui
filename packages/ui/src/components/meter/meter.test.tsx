import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { expectAccessible } from '../../../../../test/axe'
import { expectHydrates, renderServer } from '../../../../../test/ssr'
import { Meter } from './index'

const indicator = (meter: HTMLElement) =>
  meter.querySelector('[class*="rounded-pill"] > [class*="rounded-pill"]') as HTMLElement

describe('Meter', () => {
  it('renders role="meter" with value, min and max', () => {
    render(<Meter aria-label="Quota" value={30} min={10} max={60} />)
    const meter = screen.getByRole('meter', { name: 'Quota' })
    expect(meter).toHaveAttribute('aria-valuenow', '30')
    expect(meter).toHaveAttribute('aria-valuemin', '10')
    expect(meter).toHaveAttribute('aria-valuemax', '60')
  })

  it('is named by its label, and falls back to "Meter" without one', () => {
    const { unmount } = render(<Meter label="Storage" value={40} />)
    expect(screen.getByRole('meter', { name: 'Storage' })).toBeInTheDocument()
    unmount()
    render(<Meter value={40} />)
    expect(screen.getByRole('meter', { name: 'Meter' })).toBeInTheDocument()
  })

  it('showValue prints the formatted value, also without a label', () => {
    const { unmount } = render(
      <Meter
        label="Disk"
        value={3}
        max={5}
        showValue
        format={{ style: 'unit', unit: 'gigabyte' }}
      />,
    )
    expect(screen.getByRole('meter')).toHaveTextContent('3 GB')
    unmount()
    render(<Meter aria-label="Score" value={42} showValue />)
    expect(screen.getByRole('meter')).toHaveTextContent('42')
  })

  it('aria-valuetext overrides the spoken value', () => {
    render(<Meter aria-label="Disk" value={3} max={5} aria-valuetext="3 of 5 GB used" />)
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '3 of 5 GB used')
  })

  it('applies tone and size classes and merges className', () => {
    for (const [tone, cls] of [
      ['accent', 'bg-accent'],
      ['success', 'bg-success'],
      ['premium', 'bg-premium'],
    ] as const) {
      const { unmount } = render(
        <Meter aria-label="m" value={50} tone={tone} size="sm" className="max-w-sm" />,
      )
      const meter = screen.getByRole('meter')
      expect(indicator(meter).classList.contains(cls)).toBe(true)
      expect(meter.querySelector('.h-1\\.5')).not.toBeNull()
      expect(meter.classList.contains('max-w-sm')).toBe(true)
      unmount()
    }
  })

  it('renders on the server and hydrates', async () => {
    const html = renderServer(<Meter label="Storage" value={40} />)
    expect(html).toContain('role="meter"')
    expect(html).toContain('Storage')
    await expectHydrates(<Meter label="Storage" value={40} showValue />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { unmount, container } = render(
        <div data-theme={theme}>
          <Meter label="Storage" value={40} showValue tone="success" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

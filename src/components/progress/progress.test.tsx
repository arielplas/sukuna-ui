import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Progress } from './index'

describe('Progress', () => {
  it('is a progressbar with the current value (determinate)', () => {
    render(<Progress value={40} aria-label="Upload" />)
    const el = screen.getByRole('progressbar')
    expect(el).toHaveAttribute('aria-valuenow', '40')
    expect(el).toHaveAttribute('aria-valuemax', '100')
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress aria-label="Loading" />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('defaults an accessible name when neither label nor aria-label is given', () => {
    render(<Progress value={20} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Progress')
  })

  it('respects a custom max', () => {
    render(<Progress value={3} max={5} aria-label="Steps" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5')
  })

  it('renders a label and merges className', () => {
    render(<Progress value={10} label="Uploading…" className="mt-2" data-testid="p" />)
    expect(screen.getByText('Uploading…')).toBeInTheDocument()
  })

  it('renders on the server', () => {
    expect(renderServer(<Progress value={50} aria-label="x" />)).toContain('progressbar')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Progress value={60} label="Determinate" />
          <Progress aria-label="Indeterminate" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

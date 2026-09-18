import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Avatar } from './index'

describe('Avatar', () => {
  it('renders the fallback', () => {
    render(<Avatar fallback="AR" />)
    expect(screen.getByText('AR')).toBeInTheDocument()
  })

  it('keeps the fallback while an image loads (no load event in happy-dom)', () => {
    // Base UI only swaps in the <img> after it loads; happy-dom never fires load,
    // so the fallback stays. Image-swap behavior is covered manually / in-browser.
    render(<Avatar src="/me.png" alt="Ariel" fallback="AR" />)
    expect(screen.getByText('AR')).toBeInTheDocument()
  })

  it('defaults alt to empty (decorative) when a src has no alt', () => {
    // No alt provided → the image is treated as decorative rather than announcing its filename.
    render(<Avatar src="/me.png" fallback="AR" data-testid="a" />)
    expect(screen.getByTestId('a')).toBeInTheDocument()
  })

  it('applies the size to the root', () => {
    render(<Avatar fallback="AR" size="lg" data-testid="a" />)
    expect(screen.getByTestId('a').classList.contains('size-12')).toBe(true)
  })

  it('merges className', () => {
    render(<Avatar fallback="AR" className="ring-2" data-testid="a" />)
    expect(screen.getByTestId('a').classList.contains('ring-2')).toBe(true)
  })

  it('renders the fallback on the server', () => {
    expect(renderServer(<Avatar fallback="AR" />)).toContain('AR')
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Avatar fallback="AR" size="sm" />
          <Avatar fallback="JS" size="md" />
          <Avatar fallback="KL" size="lg" />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

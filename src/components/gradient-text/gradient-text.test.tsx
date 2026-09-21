import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { GradientText } from './index'

describe('GradientText', () => {
  it('server-renders real text as a span by default', () => {
    const html = renderServer(<GradientText>Malevolent Shrine</GradientText>)
    expect(html).toContain('<span')
    expect(html).toContain('Malevolent Shrine')
  })

  it('renders as the requested element', () => {
    render(<GradientText as="h1">Domain</GradientText>)
    const el = screen.getByRole('heading', { level: 1 })
    expect(el.tagName).toBe('H1')
    expect(el.textContent).toBe('Domain')
  })

  it('applies the clip utilities and the accent gradient with a fallback color', () => {
    render(<GradientText data-testid="g">Shrine</GradientText>)
    const el = screen.getByTestId('g')
    for (const cls of ['bg-clip-text', 'bg-gradient-accent', 'text-accent'])
      expect(el.classList.contains(cls)).toBe(true)
  })

  it('does not leak variant props and merges className last', () => {
    render(
      <GradientText gradient="accent" className="text-3xl" data-testid="g">
        x
      </GradientText>,
    )
    const el = screen.getByTestId('g')
    expect(el.hasAttribute('gradient')).toBe(false)
    expect(el.hasAttribute('as')).toBe(false)
    expect(el.classList.contains('text-3xl')).toBe(true)
  })

  it('forwards ref to the rendered element', () => {
    const ref = createRef<HTMLElement>()
    render(
      <GradientText ref={ref} as="h2">
        h
      </GradientText>,
    )
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<GradientText as="h1">Hydrate</GradientText>)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <GradientText as="h1" className="text-3xl font-black">
            Malevolent Shrine
          </GradientText>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

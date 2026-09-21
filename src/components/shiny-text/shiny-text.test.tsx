import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { ShinyText } from './index'

describe('ShinyText', () => {
  it('server-renders real text as a span by default', () => {
    const html = renderServer(<ShinyText>Limited drop</ShinyText>)
    expect(html).toContain('<span')
    expect(html).toContain('Limited drop')
  })

  it('maps each speed to its animate utility and always guards reduced motion', () => {
    const cases = {
      slow: 'animate-shine-slow',
      normal: 'animate-shine',
      fast: 'animate-shine-fast',
    }
    for (const [speed, cls] of Object.entries(cases)) {
      const { unmount } = render(
        <ShinyText speed={speed as keyof typeof cases} data-testid="s">
          x
        </ShinyText>,
      )
      const el = screen.getByTestId('s')
      expect(el.classList.contains(cls)).toBe(true)
      expect(el.classList.contains('motion-reduce:animate-none')).toBe(true)
      unmount()
    }
  })

  it('renders as the requested element', () => {
    render(<ShinyText as="strong">New</ShinyText>)
    const el = screen.getByText('New')
    expect(el.tagName).toBe('STRONG')
  })

  it('does not leak variant props and merges className last', () => {
    render(
      <ShinyText speed="fast" className="text-lg" data-testid="s">
        x
      </ShinyText>,
    )
    const el = screen.getByTestId('s')
    expect(el.hasAttribute('speed')).toBe(false)
    expect(el.hasAttribute('as')).toBe(false)
    expect(el.classList.contains('text-lg')).toBe(true)
  })

  it('forwards ref to the rendered element', () => {
    const ref = createRef<HTMLElement>()
    render(<ShinyText ref={ref}>x</ShinyText>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<ShinyText>Hydrate</ShinyText>)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <ShinyText>Limited drop</ShinyText>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

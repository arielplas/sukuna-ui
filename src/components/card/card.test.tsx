import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Card } from './index'

const elevations = ['flat', 'raised', 'sunken'] as const
const paddings = ['none', 'sm', 'md', 'lg'] as const

describe('Card', () => {
  it('renders every elevation and padding on the server', () => {
    for (const elevation of elevations)
      for (const padding of paddings)
        expect(
          renderServer(
            <Card elevation={elevation} padding={padding}>
              body
            </Card>,
          ),
        ).toContain('body')
  })

  it('applies radius and gives raised a shadow', () => {
    render(
      <Card elevation="raised" radius="md" data-testid="c">
        x
      </Card>,
    )
    const cls = screen.getByTestId('c').classList
    expect(cls.contains('rounded-md')).toBe(true)
    expect(cls.contains('shadow-card')).toBe(true)
  })

  it('does not leak variant props to the DOM', () => {
    render(
      <Card
        elevation="sunken"
        padding="lg"
        radius="lg"
        tone="premium"
        interactive
        glow
        data-testid="c"
      >
        x
      </Card>,
    )
    const el = screen.getByTestId('c')
    for (const attr of ['elevation', 'padding', 'radius', 'tone', 'interactive', 'glow'])
      expect(el.hasAttribute(attr)).toBe(false)
  })

  it('premium tone swaps the border and tints the surface; default is unchanged', () => {
    render(
      <>
        <Card tone="premium" data-testid="p">
          x
        </Card>
        <Card data-testid="d">x</Card>
      </>,
    )
    const p = screen.getByTestId('p').classList
    expect(p.contains('border-premium-dim')).toBe(true)
    expect(p.contains('border-line')).toBe(false)
    expect(screen.getByTestId('p').className).toContain('color-mix')
    const d = screen.getByTestId('d').classList
    expect(d.contains('border-line')).toBe(true)
    expect(d.contains('border-premium-dim')).toBe(false)
  })

  it('interactive adds the hover lift and focus-within ring; glow adds the accent halo', () => {
    render(
      <Card interactive glow data-testid="c">
        x
      </Card>,
    )
    const cls = screen.getByTestId('c').classList
    expect(cls.contains('hover:-translate-y-0.5')).toBe(true)
    expect(cls.contains('focus-within:ring-2')).toBe(true)
    expect(cls.contains('hover:shadow-[0_0_22px_4px_var(--sk-accent-glow)]')).toBe(true)
    expect(cls.contains('motion-reduce:transition-none')).toBe(true)
  })

  it('forwards ref and renders children', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Card ref={ref}>
        <span>inner</span>
      </Card>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(screen.getByText('inner')).toBeInTheDocument()
  })

  it('passes native props through', () => {
    render(
      <Card id="panel" data-testid="n" role="group" aria-label="stats">
        x
      </Card>,
    )
    const el = screen.getByTestId('n')
    expect(el).toHaveAttribute('id', 'panel')
    expect(el).toHaveAttribute('role', 'group')
  })

  it('lets a consumer className override a conflicting utility', () => {
    render(
      <Card padding="md" className="p-0" data-testid="c">
        x
      </Card>,
    )
    const cls = screen.getByTestId('c').classList
    expect(cls.contains('p-0')).toBe(true)
    expect(cls.contains('p-6')).toBe(false)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Card elevation="raised">card</Card>)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          {elevations.map((elevation) => (
            <Card key={elevation} elevation={elevation}>
              {elevation}
            </Card>
          ))}
          <Card tone="premium">premium</Card>
          <a href="/x">
            <Card interactive glow>
              clickable
            </Card>
          </a>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

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
      <Card elevation="sunken" padding="lg" radius="lg" data-testid="c">
        x
      </Card>,
    )
    const el = screen.getByTestId('c')
    for (const attr of ['elevation', 'padding', 'radius']) expect(el.hasAttribute(attr)).toBe(false)
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
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

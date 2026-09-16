import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Text } from './index'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
const tones = ['default', 'dim', 'faint', 'accent', 'success', 'premium'] as const

describe('Text', () => {
  it('renders every size and tone on the server', () => {
    for (const size of sizes)
      for (const tone of tones)
        expect(
          renderServer(
            <Text size={size} tone={tone}>
              Sukuna
            </Text>,
          ),
        ).toContain('Sukuna')
  })

  it('defaults to a <p>', () => {
    render(<Text>body</Text>)
    expect(screen.getByText('body').tagName).toBe('P')
  })

  it('renders as the requested element', () => {
    render(
      <Text as="h2" size="2xl">
        Heading
      </Text>,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading')
    render(<Text as="label">Field</Text>)
    expect(screen.getByText('Field').tagName).toBe('LABEL')
  })

  it('applies truncate and numeric, and never leaks variant props to the DOM', () => {
    render(
      <Text truncate numeric data-testid="t">
        123
      </Text>,
    )
    const el = screen.getByTestId('t')
    expect(el.classList.contains('truncate')).toBe(true)
    expect(el.classList.contains('tabular-nums')).toBe(true)
    // variant props must not appear as attributes
    for (const attr of ['size', 'tone', 'weight', 'truncate', 'numeric', 'font', 'leading']) {
      expect(el.hasAttribute(attr)).toBe(false)
    }
  })

  it('forwards ref to the rendered element', () => {
    const ref = createRef<HTMLElement>()
    render(<Text ref={ref}>x</Text>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  it('passes native props through', () => {
    render(
      <Text id="lede" data-testid="n" aria-label="lede">
        hi
      </Text>,
    )
    const el = screen.getByTestId('n')
    expect(el).toHaveAttribute('id', 'lede')
    expect(el).toHaveAttribute('aria-label', 'lede')
  })

  it('lets a consumer className override a conflicting utility', () => {
    render(
      <Text size="md" className="text-3xl" data-testid="c">
        big
      </Text>,
    )
    const cls = screen.getByTestId('c').classList
    expect(cls.contains('text-3xl')).toBe(true)
    expect(cls.contains('text-md')).toBe(false)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Text as="h1">Title</Text>)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Text as="h2" size="xl">
            Accessible
          </Text>
          <Text tone="dim">Secondary copy</Text>
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

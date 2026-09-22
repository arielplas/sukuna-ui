import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { renderServer } from '../../../test/ssr'
import { Chip } from './index'

const tones = ['neutral', 'accent', 'success', 'premium'] as const

describe('Chip', () => {
  it('renders every tone and size on the server', () => {
    for (const tone of tones)
      for (const size of ['sm', 'md'] as const)
        expect(
          renderServer(
            <Chip tone={tone} size={size}>
              tag
            </Chip>,
          ),
        ).toContain('tag')
  })

  it('renders a dismiss button only with onDismiss and calls it', async () => {
    const onDismiss = mock()
    const { rerender } = render(<Chip>plain</Chip>)
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
    rerender(<Chip onDismiss={onDismiss}>removable</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('uses a custom dismiss label and renders a leading icon', () => {
    render(
      <Chip onDismiss={() => {}} dismissLabel="Clear filter" leadingIcon={<svg data-testid="ic" />}>
        Filter
      </Chip>,
    )
    expect(screen.getByRole('button', { name: 'Clear filter' })).toBeInTheDocument()
    expect(screen.getByTestId('ic')).toBeInTheDocument()
  })

  it('does not leak variant props and forwards ref + className', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <Chip ref={ref} tone="accent" variant="outline" size="sm" className="mx-1" data-testid="c">
        x
      </Chip>,
    )
    const el = screen.getByTestId('c')
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(el.classList.contains('mx-1')).toBe(true)
    for (const attr of ['tone', 'variant', 'size', 'selected'])
      expect(el.hasAttribute(attr)).toBe(false)
  })

  it('unset variant keeps the original per-tone look; the trio forces one', () => {
    render(
      <>
        <Chip tone="accent" data-testid="accent-auto">
          x
        </Chip>
        <Chip tone="accent" variant="soft" data-testid="accent-soft">
          x
        </Chip>
        <Chip tone="premium" variant="solid" data-testid="premium-solid">
          x
        </Chip>
        <Chip tone="neutral" variant="outline" data-testid="neutral-outline">
          x
        </Chip>
      </>,
    )
    const cls = (id: string) => screen.getByTestId(id).classList
    expect(cls('accent-auto').contains('bg-gradient-accent')).toBe(true)
    expect(cls('accent-soft').contains('text-accent')).toBe(true)
    expect(cls('accent-soft').contains('bg-gradient-accent')).toBe(false)
    expect(cls('premium-solid').contains('bg-premium')).toBe(true)
    expect(cls('premium-solid').contains('text-bg')).toBe(true)
    expect(cls('neutral-outline').contains('bg-transparent')).toBe(true)
  })

  it('selected sets data-selected (styled via the data variant) and is off by default', () => {
    const { rerender } = render(<Chip data-testid="c">x</Chip>)
    const el = screen.getByTestId('c')
    expect(el.hasAttribute('data-selected')).toBe(false)
    expect(el.classList.contains('data-[selected]:border-accent')).toBe(true)
    rerender(
      <Chip data-testid="c" selected>
        x
      </Chip>,
    )
    expect(el.hasAttribute('data-selected')).toBe(true)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          {tones.map((tone) => (
            <Chip key={tone} tone={tone} onDismiss={() => {}}>
              {tone}
            </Chip>
          ))}
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

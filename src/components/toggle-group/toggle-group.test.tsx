import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Toggle, ToggleGroup } from './index'

const items = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right', disabled: true },
]

describe('ToggleGroup', () => {
  it('renders a button per item on the server', () => {
    const html = renderServer(<ToggleGroup aria-label="Align" items={items} />)
    expect(html).toContain('Left')
    expect(html).toContain('Center')
  })

  it('marks the default value pressed', () => {
    render(<ToggleGroup aria-label="Align" defaultValue="left" items={items} />)
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('single mode: selecting one clears the other, reporting an array', async () => {
    let last: string[] | undefined
    render(
      <ToggleGroup
        aria-label="Align"
        defaultValue="left"
        onValueChange={(v) => {
          last = v
        }}
        items={items}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Center' }))
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false')
    expect(last).toEqual(['center'])
  })

  it('multiple mode: keeps several pressed (controlled array value)', async () => {
    let last: string[] | undefined
    render(
      <ToggleGroup
        aria-label="Format"
        multiple
        value={['left']}
        onValueChange={(v) => {
          last = v
        }}
        items={items}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Center' }))
    expect(last).toEqual(['left', 'center'])
  })

  it('works uncontrolled without an onValueChange handler', async () => {
    render(<ToggleGroup aria-label="Align" items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Left' }))
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders a disabled item as disabled', () => {
    render(<ToggleGroup aria-label="Align" items={items} />)
    expect(screen.getByRole('button', { name: 'Right' })).toBeDisabled()
  })

  it('renders the group with role group and its accessible name', () => {
    render(<ToggleGroup aria-label="Align" items={items} />)
    expect(screen.getByRole('group', { name: 'Align' })).toBeInTheDocument()
  })

  it('does not leak variant props onto the DOM', () => {
    render(<ToggleGroup aria-label="Align" size="lg" orientation="vertical" items={items} />)
    const group = screen.getByRole('group', { name: 'Align' })
    expect(group.hasAttribute('size')).toBe(false)
    expect(group.hasAttribute('orientation')).toBe(false)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<ToggleGroup aria-label="Align" defaultValue="left" items={items} />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <ToggleGroup aria-label="Text alignment" defaultValue="left" items={items} />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

describe('Toggle', () => {
  it('toggles aria-pressed and reports the new state', async () => {
    let last: boolean | undefined
    render(
      <Toggle
        aria-label="Bold"
        onPressedChange={(p) => {
          last = p
        }}
      >
        B
      </Toggle>,
    )
    const btn = screen.getByRole('button', { name: 'Bold' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(last).toBe(true)
  })

  it('works uncontrolled without a handler and honours defaultPressed', async () => {
    render(
      <Toggle aria-label="Pin" defaultPressed>
        P
      </Toggle>,
    )
    const btn = screen.getByRole('button', { name: 'Pin' })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('forwards ref to the button', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Toggle ref={ref} aria-label="Mute">
        M
      </Toggle>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('renders on the server', () => {
    expect(renderServer(<Toggle aria-label="Bold">B</Toggle>)).toContain('B')
  })
})

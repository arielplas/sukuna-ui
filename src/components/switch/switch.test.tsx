import { describe, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { expectAccessible } from '../../../test/axe'
import { expectHydrates, renderServer } from '../../../test/ssr'
import { Switch } from './index'

describe('Switch', () => {
  it('renders both sizes on the server with role switch', () => {
    for (const size of ['sm', 'md'] as const)
      expect(renderServer(<Switch size={size} aria-label="s" />)).toContain('role="switch"')
  })

  it('toggles when uncontrolled and flips aria-checked', async () => {
    const onCheckedChange = mock()
    render(<Switch aria-label="wifi" onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole('switch')
    expect(el).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(el)
    expect(el).toHaveAttribute('aria-checked', 'true')
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
  })

  it('respects a controlled value and drives a controlled parent', async () => {
    const onCheckedChange = mock()
    const { unmount } = render(
      <Switch aria-label="s" checked={false} onCheckedChange={onCheckedChange} />,
    )
    await userEvent.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    unmount()

    function Controlled() {
      const [on, setOn] = useState(false)
      return <Switch aria-label="s2" checked={on} onCheckedChange={setOn} />
    }
    render(<Controlled />)
    await userEvent.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('disabled blocks toggling', async () => {
    const onCheckedChange = mock()
    render(<Switch aria-label="s" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('toggles with the keyboard', async () => {
    render(<Switch aria-label="s" />)
    const el = screen.getByRole('switch')
    await userEvent.tab()
    expect(el).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(el).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Enter}')
    expect(el).toHaveAttribute('aria-checked', 'false')
  })

  it('forwards ref to the button', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch aria-label="s" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('does not leak variant props and merges className on the root', () => {
    render(<Switch aria-label="s" size="sm" className="w-20" data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el.hasAttribute('size')).toBe(false)
    expect(el.classList.contains('w-20')).toBe(true)
    expect(el.classList.contains('w-9')).toBe(false)
  })

  it('hydrates without warnings', async () => {
    await expectHydrates(<Switch aria-label="h" defaultChecked />)
  })

  it('is accessible in both themes', async () => {
    for (const theme of ['dark', 'light'] as const) {
      const { container, unmount } = render(
        <div data-theme={theme}>
          <Switch aria-label="Wi-Fi" />
          <Switch aria-label="Bluetooth" defaultChecked />
        </div>,
      )
      await expectAccessible(container)
      unmount()
    }
  })
})

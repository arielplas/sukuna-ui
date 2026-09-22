import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from './index'

function ShowButton() {
  const { toast } = useToast()
  return (
    <button
      type="button"
      onClick={() => toast({ title: 'Saved', description: 'Your changes were saved.' })}
    >
      Save
    </button>
  )
}

describe('Toast', () => {
  it('shows a toast when triggered', async () => {
    render(
      <ToastProvider>
        <ShowButton />
      </ToastProvider>,
    )
    expect(screen.queryByText('Saved')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument()
  })

  it('styles a tone like Alert and leaves untoned/custom-type toasts plain', async () => {
    function Buttons() {
      const { toast } = useToast()
      return (
        <>
          <button type="button" onClick={() => toast({ title: 'Toned', tone: 'success' })}>
            toned
          </button>
          <button type="button" onClick={() => toast({ title: 'Plain' })}>
            plain
          </button>
          <button type="button" onClick={() => toast({ title: 'Custom', type: 'promo' })}>
            custom
          </button>
        </>
      )
    }
    render(
      <ToastProvider>
        <Buttons />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'toned' }))
    await userEvent.click(screen.getByRole('button', { name: 'plain' }))
    await userEvent.click(screen.getByRole('button', { name: 'custom' }))
    // The toast root is the nearest ancestor carrying `shadow-card` (unique to the root slot).
    const root = (title: string) => screen.getByText(title).closest('.shadow-card') as HTMLElement
    expect(root('Toned').className).toContain('border-l-success')
    expect(root('Plain').className).not.toContain('border-l-4')
    expect(root('Custom').className).not.toContain('border-l-4')
  })

  // Close-button dismissal (exit animation) is covered in test/browser/toast.test.ts —
  // happy-dom doesn't complete CSS transitions, so it's not asserted here.

  it('renders provided children', () => {
    render(
      <ToastProvider>
        <span>app content</span>
      </ToastProvider>,
    )
    expect(screen.getByText('app content')).toBeInTheDocument()
  })
})

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

'use client'

import { Toast as Base } from '@base-ui-components/react/toast'
import type { ReactNode } from 'react'
import { toastStyles } from './toast.styles'

const CloseIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

/** Renders the live toasts from the manager into the viewport. */
function ToastList() {
  const { toasts } = Base.useToastManager()
  const styles = toastStyles()
  return toasts.map((toast) => (
    <Base.Root key={toast.id} toast={toast} className={styles.root()}>
      <Base.Title className={styles.title()} />
      <Base.Description className={styles.description()} />
      <Base.Close aria-label="Close" className={styles.close()}>
        <CloseIcon />
      </Base.Close>
    </Base.Root>
  ))
}

export interface ToastProviderProps {
  children: ReactNode
  /** Auto-dismiss delay in ms (default from Base UI). */
  timeout?: number
  /** Max simultaneous toasts. */
  limit?: number
}

/**
 * Wrap your app once. Renders the toast viewport (portalled). `'use client'`.
 * Components inside call `useToast()` to show toasts.
 */
export function ToastProvider({ children, timeout, limit }: ToastProviderProps) {
  const styles = toastStyles()
  return (
    <Base.Provider timeout={timeout} limit={limit}>
      {children}
      <Base.Portal>
        <Base.Viewport aria-label="Notifications" className={styles.viewport()}>
          <ToastList />
        </Base.Viewport>
      </Base.Portal>
    </Base.Provider>
  )
}

export interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  /** Passed through to Base UI as the toast `type` (for styling hooks). */
  type?: string
}

/** Returns `{ toast }` to show a toast. Must be used inside a `ToastProvider`. */
export function useToast() {
  const manager = Base.useToastManager()
  return {
    toast: (options: ToastOptions): string => manager.add(options),
  }
}

'use client'

import { Toast as Base } from '@base-ui-components/react/toast'
import type { ReactNode } from 'react'
import { toastStyles } from './toast.styles'

const CloseIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

/** Semantic tone of a toast; mirrors `Alert`'s `tone`. */
export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

const TONES: readonly string[] = ['info', 'success', 'warning', 'danger']
const asTone = (type: string | undefined): ToastTone | undefined =>
  type !== undefined && TONES.includes(type) ? (type as ToastTone) : undefined

/** Renders the live toasts from the manager into the viewport. */
function ToastList() {
  const { toasts } = Base.useToastManager()
  const styles = toastStyles()
  return toasts.map((toast) => (
    <Base.Root key={toast.id} toast={toast} className={styles.root({ tone: asTone(toast.type) })}>
      <Base.Title className={styles.title()} />
      <Base.Description className={styles.description()} />
      <Base.Close aria-label="Close" className={styles.close()}>
        <CloseIcon />
      </Base.Close>
    </Base.Root>
  ))
}

/** Props for `ToastProvider`. */
export interface ToastProviderProps {
  /** The app subtree; any component inside can call `useToast()`. */
  children: ReactNode
  /**
   * Auto-dismiss delay in ms for every toast; `0` keeps toasts until closed by the user.
   * @default 5000
   */
  timeout?: number
  /**
   * Maximum toasts shown at once; when reached, the oldest is removed for the new one.
   * @default 3
   */
  limit?: number
}

/**
 * Mounts the toast system: wrap the app once, then show toasts from anywhere with `useToast`.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Toast. `children` render on
 *   the server as usual; the viewport is portalled to `document.body` on the client and is
 *   empty until a toast is added.
 * - Accessibility: the viewport is a region labelled "Notifications" and a polite live region,
 *   so new toasts are announced without stealing focus. Each toast has a close button with
 *   `aria-label="Close"`; auto-dismiss pauses while hovered or focused, and `Escape` closes.
 * - Stacking: the viewport (bottom-right, `w-80`) sits at `--sk-z-toast` (70), above dialogs
 *   (50) and popovers (60) and below tooltips (80).
 * - Each toast renders a title, an optional description and a close icon. `tone` ('info' |
 *   'success' | 'warning' | 'danger') adds the same left accent border as `Alert`, so a
 *   notification and an inline alert for one event read the same; untoned toasts are plain. No
 *   per-toast action buttons in v1.
 *
 * @example
 * ```tsx
 * import { Button, ToastProvider, useToast } from 'sukuna-ui'
 *
 * // App root (once):
 * <ToastProvider timeout={4000} limit={3}>
 *   <App />
 * </ToastProvider>
 *
 * // Anywhere inside:
 * function SaveButton() {
 *   const { toast } = useToast()
 *   return (
 *     <Button onClick={() => toast({ title: 'Saved', description: 'Changes are live.' })}>
 *       Save
 *     </Button>
 *   )
 * }
 * ```
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

/** What `toast()` accepts; everything is optional but a `title` is expected in practice. */
export interface ToastOptions {
  /** Bold headline; the main announced text. */
  title?: ReactNode
  /** Secondary line under the title, in dim text. */
  description?: ReactNode
  /**
   * Semantic tone, styled like `Alert`'s: a left accent border in the tone's color. Omit for a
   * plain toast. Sent to Base UI as the toast `type`, so it also works for filtering.
   */
  tone?: ToastTone
  /**
   * Free-form tag passed to Base UI as the toast `type` when `tone` is not set — a hook for your
   * own styling or filtering. A value equal to a tone name is styled as that tone.
   */
  type?: string
}

/**
 * Hook that returns `{ toast }`; call `toast(options)` to show one and get back its id string.
 * Must be used inside a `ToastProvider` (it reads Base UI's toast manager from context).
 */
export function useToast() {
  const manager = Base.useToastManager()
  return {
    toast: ({ tone, type, ...options }: ToastOptions): string =>
      manager.add({ ...options, type: tone ?? type }),
  }
}

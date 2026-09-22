import { tv, type VariantProps } from '../../utils/tv'

export const toastStyles = tv({
  slots: {
    viewport:
      'fixed bottom-4 right-4 z-[var(--sk-z-toast)] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none',
    root: [
      'relative rounded-md border border-line bg-surface p-4 pr-9 shadow-card text-text',
      'transition-all motion-reduce:transition-none duration-base ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:translate-y-3',
      'data-[ending-style]:opacity-0 data-[ending-style]:translate-y-3',
    ],
    title: 'font-display text-sm font-bold tracking-tight',
    description: 'mt-1 text-sm text-text-dim',
    close: [
      'absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-sm',
      'text-text-dim hover:text-text hover:bg-line-soft cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    ],
  },
  variants: {
    // Mirrors Alert's tone map exactly (left accent border) so a notification and an inline alert
    // for the same event read the same. No default: an untoned toast is unchanged.
    tone: {
      info: { root: 'border-l-4 border-l-text-faint' },
      success: { root: 'border-l-4 border-l-success' },
      warning: { root: 'border-l-4 border-l-premium' },
      danger: { root: 'border-l-4 border-l-accent' },
    },
  },
})

export type ToastStyleProps = VariantProps<typeof toastStyles>

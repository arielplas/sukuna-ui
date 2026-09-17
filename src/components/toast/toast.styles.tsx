import { tv } from '../../utils/tv'

export const toastStyles = tv({
  slots: {
    viewport:
      'fixed bottom-4 right-4 z-[var(--sk-z-toast)] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none',
    root: [
      'relative rounded-md border border-line bg-surface p-4 pr-9 shadow-card text-text',
      'transition-all duration-base ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:translate-y-3',
      'data-[ending-style]:opacity-0 data-[ending-style]:translate-y-3',
    ],
    title: 'font-display text-sm font-bold tracking-tight',
    description: 'mt-1 text-sm text-text-dim',
    close: [
      'absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded-sm',
      'text-text-dim hover:text-text hover:bg-line-soft cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow',
    ],
  },
})

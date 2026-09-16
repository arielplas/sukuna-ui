import { tv } from '../../utils/tv'

export const dialogStyles = tv({
  slots: {
    backdrop: [
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
      'transition-opacity duration-base ease-sukuna',
      'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
    ],
    popup: [
      'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
      'w-[90vw] max-w-lg rounded-lg border border-line bg-surface p-6 shadow-card',
      'transition-[opacity,transform] duration-base ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
      'focus-visible:outline-none',
    ],
    title: 'font-display text-lg font-bold tracking-tight text-text',
    description: 'mt-1 text-sm text-text-dim',
    close: [
      'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm',
      'text-text-dim hover:text-text hover:bg-line-soft',
      'transition-colors duration-fast ease-sukuna',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    ],
  },
})

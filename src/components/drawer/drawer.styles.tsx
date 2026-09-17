import { tv } from '../../utils/tv'

export const drawerStyles = tv({
  slots: {
    backdrop:
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-base ease-sukuna data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
    popup: [
      'fixed z-50 flex flex-col gap-2 bg-surface p-6 shadow-card border-line',
      'transition-transform duration-base ease-sukuna focus-visible:outline-none',
    ],
    title: 'font-display text-lg font-bold tracking-tight text-text',
    description: 'mt-1 text-sm text-text-dim',
    close: [
      'absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md',
      'text-text-dim hover:text-text hover:bg-line-soft cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow',
    ],
  },
  variants: {
    side: {
      right: {
        popup:
          'inset-y-0 right-0 h-full w-80 max-w-[90vw] border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
      },
      left: {
        popup:
          'inset-y-0 left-0 h-full w-80 max-w-[90vw] border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
      },
      top: {
        popup:
          'inset-x-0 top-0 w-full h-64 border-b data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full',
      },
      bottom: {
        popup:
          'inset-x-0 bottom-0 w-full h-64 border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
      },
    },
  },
  defaultVariants: { side: 'right' },
})

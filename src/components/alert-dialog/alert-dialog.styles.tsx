import { tv } from '../../utils/tv'

// Mirrors the Dialog recipe (same layer, backdrop and surface) with a narrower popup; the buttons
// are real `Button`s, so they need no slot here.
export const alertDialogStyles = tv({
  slots: {
    backdrop: [
      'fixed inset-0 z-[var(--sk-z-dialog)] bg-black/60 backdrop-blur-sm',
      'transition-opacity motion-reduce:transition-none duration-base ease-sukuna',
      'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
    ],
    popup: [
      'fixed left-1/2 top-1/2 z-[var(--sk-z-dialog)] -translate-x-1/2 -translate-y-1/2',
      'w-[90vw] max-w-md rounded-lg border border-line bg-surface p-6 shadow-card',
      // `scale` (not `transform`): Tailwind v4 scale-* compiles to the standalone property.
      'transition-[opacity,scale] motion-reduce:transition-none duration-base ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
      'focus-visible:outline-none',
    ],
    title: 'font-display text-lg font-bold tracking-tight text-text',
    description: 'mt-2 text-sm text-text-dim',
    footer: 'mt-6 flex flex-wrap justify-end gap-2',
  },
})

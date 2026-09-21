import { tv } from '../../utils/tv'

export const hoverCardStyles = tv({
  slots: {
    trigger:
      'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    // z-index on the body-level portalled positioner, above the dialog layer (see Menu/Select).
    positioner: 'z-[var(--sk-z-popover)]',
    popup: [
      'max-w-xs rounded-md border border-line bg-surface p-4 text-sm text-text shadow-card outline-none',
      'origin-[var(--transform-origin)]',
      'transition-[opacity,transform] motion-reduce:transition-none duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
    ],
  },
})

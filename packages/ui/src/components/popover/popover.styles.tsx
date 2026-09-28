import { tv } from '../../utils/tv'

export const popoverStyles = tv({
  slots: {
    // z-index on the body-level portalled positioner, above the dialog layer (see Menu/Select).
    positioner: 'z-[var(--sk-z-popover)]',
    popup: [
      'w-72 max-w-[calc(100vw-2rem)] rounded-md border border-line bg-surface p-4',
      'text-sm text-text shadow-card outline-none',
      'origin-[var(--transform-origin)]',
      // Directional entrance (docs/motion.md): slide 4px in from the trigger's side. Tailwind v4
      // scale-*/translate-* compile to the `scale`/`translate` properties, so list those.
      'transition-[opacity,scale,translate] motion-reduce:transition-none duration-fast ease-sukuna',
      'data-[side=bottom]:data-[starting-style]:-translate-y-1 data-[side=top]:data-[starting-style]:translate-y-1',
      'data-[side=left]:data-[starting-style]:translate-x-1 data-[side=right]:data-[starting-style]:-translate-x-1',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
    ],
    title: 'font-display text-md font-bold tracking-tight text-text',
    description: 'mt-1 text-sm text-text-dim',
    close: [
      'inline-flex h-8 items-center justify-center rounded-md px-3 text-sm cursor-pointer',
      'text-text-dim hover:text-text hover:bg-line-soft',
      'transition-colors motion-reduce:transition-none duration-fast ease-sukuna',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    ],
  },
})

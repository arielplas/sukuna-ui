import { tv } from '../../utils/tv'

export const tooltipStyles = tv({
  slots: {
    // z-index on the Positioner (body-level portalled element); tooltips sit at the top of the
    // stack so they clear dialogs and dropdowns alike — see Select for the mechanism.
    positioner: 'z-[var(--sk-z-tooltip)]',
    popup: [
      'max-w-xs select-none',
      'rounded-md border border-line bg-surface-2 text-text shadow-card',
      'px-2.5 py-1.5 text-sm',
      'transition-[opacity,transform] motion-reduce:transition-none duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
    ],
  },
})

import { tv } from '../../utils/tv'

export const tooltipStyles = tv({
  base: [
    'z-40 max-w-xs select-none',
    'rounded-md border border-line bg-surface-2 text-text shadow-card',
    'px-2.5 py-1.5 text-sm',
    'transition-[opacity,transform] duration-fast ease-sukuna',
    'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
    'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
  ],
})

import { tv } from '../../utils/tv'

export const menuStyles = tv({
  slots: {
    popup: [
      'z-50 min-w-40 rounded-md border border-line bg-surface p-1 shadow-card outline-none',
      'transition-[opacity,transform] duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
    ],
    item: [
      'flex items-center gap-2 h-9 px-2.5 rounded-sm text-sm text-text cursor-pointer outline-none select-none',
      'data-[highlighted]:bg-line-soft',
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
  },
})

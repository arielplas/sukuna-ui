import { tv } from '../../utils/tv'

export const comboboxStyles = tv({
  slots: {
    input:
      'w-full h-10 bg-surface-2 text-text border border-line rounded-md px-3 text-md placeholder:text-text-faint transition-[border-color,box-shadow] duration-fast ease-sukuna focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:border-accent disabled:opacity-45 disabled:cursor-not-allowed',
    popup: [
      'z-50 max-h-72 min-w-48 overflow-y-auto rounded-md border border-line bg-surface p-1 shadow-card outline-none',
      'transition-[opacity,transform] duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
    ],
    item: [
      'flex h-9 items-center px-2.5 rounded-sm text-sm text-text cursor-pointer select-none outline-none',
      'data-[highlighted]:bg-line-soft data-[selected]:text-accent',
    ],
    empty: 'px-2.5 py-2 text-sm text-text-dim',
  },
})

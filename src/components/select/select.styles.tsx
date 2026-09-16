import { tv, type VariantProps } from '../../utils/tv'

export const selectStyles = tv({
  slots: {
    trigger: [
      'inline-flex items-center justify-between gap-2 min-w-40',
      'bg-surface-2 text-text border border-line rounded-md px-3 cursor-pointer',
      'transition-[border-color,box-shadow] duration-fast ease-sukuna',
      'data-[popup-open]:border-accent',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow',
      'disabled:opacity-45 disabled:cursor-not-allowed',
    ],
    icon: 'text-text-dim shrink-0',
    popup: [
      'z-50 min-w-40 max-h-96 overflow-y-auto',
      'rounded-md border border-line bg-surface p-1 shadow-card',
      'transition-[opacity,transform] duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
      'focus-visible:outline-none',
    ],
    item: [
      'flex items-center justify-between gap-2 h-9 px-2.5 rounded-sm text-sm text-text',
      'cursor-pointer select-none outline-none',
      'data-[highlighted]:bg-line-soft',
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    indicator: 'text-accent',
    placeholder: 'text-text-faint',
  },
  variants: {
    size: {
      sm: { trigger: 'h-8 text-sm' },
      md: { trigger: 'h-10 text-md' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type SelectStyleProps = VariantProps<typeof selectStyles>

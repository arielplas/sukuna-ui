import { tv, type VariantProps } from '../../utils/tv'

export const toggleGroupStyles = tv({
  slots: {
    root: 'inline-flex gap-0.5 rounded-md border border-line bg-surface-2 p-0.5',
    item: [
      'inline-flex items-center justify-center gap-2 select-none cursor-pointer',
      'font-medium text-text-dim rounded-sm',
      'transition-colors duration-fast ease-sukuna',
      'hover:text-text',
      'data-[pressed]:bg-well data-[pressed]:text-text',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring',
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed data-[disabled]:hover:text-text-dim',
    ],
  },
  variants: {
    size: {
      sm: { item: 'h-7 px-2.5 text-sm' },
      md: { item: 'h-[34px] px-3 text-md' },
      lg: { item: 'h-10 px-4 text-lg' },
    },
    orientation: {
      horizontal: { root: 'flex-row' },
      vertical: { root: 'flex-col' },
    },
  },
  defaultVariants: { size: 'md', orientation: 'horizontal' },
})

export type ToggleGroupStyleProps = VariantProps<typeof toggleGroupStyles>

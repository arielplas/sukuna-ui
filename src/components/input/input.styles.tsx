import { tv, type VariantProps } from '../../utils/tv'

export const inputStyles = tv({
  base: [
    'w-full bg-surface-2 text-text border border-line',
    'placeholder:text-text-faint',
    'transition-[border-color,box-shadow] duration-fast ease-sukuna',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:border-accent',
    'disabled:opacity-45 disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'h-8 px-3 text-sm rounded-sm',
      md: 'h-10 px-3 text-md rounded-md',
      lg: 'h-12 px-4 text-lg rounded-lg',
    },
    invalid: {
      true: 'border-accent focus-visible:ring-accent-glow',
    },
  },
  defaultVariants: { size: 'md' },
})

export type InputStyleProps = VariantProps<typeof inputStyles>

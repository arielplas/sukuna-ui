import { tv, type VariantProps } from '../../utils/tv'

export const switchStyles = tv({
  slots: {
    root: [
      'group relative inline-flex items-center rounded-pill p-0.5 border border-line bg-surface-2',
      'transition-colors duration-fast ease-sukuna cursor-pointer',
      'aria-checked:bg-gradient-accent aria-checked:border-transparent',
      'disabled:opacity-45 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    ],
    thumb: 'inline-block rounded-full bg-text transition-transform duration-fast ease-sukuna',
  },
  variants: {
    size: {
      sm: { root: 'h-5 w-9', thumb: 'size-4 group-aria-checked:translate-x-4' },
      md: { root: 'h-6 w-11', thumb: 'size-5 group-aria-checked:translate-x-5' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type SwitchStyleProps = VariantProps<typeof switchStyles>

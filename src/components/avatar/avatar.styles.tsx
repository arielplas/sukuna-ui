import { tv, type VariantProps } from '../../utils/tv'

export const avatarStyles = tv({
  slots: {
    root: 'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface-2 text-text-dim select-none align-middle',
    image: 'size-full object-cover',
    fallback: 'font-semibold uppercase',
  },
  variants: {
    size: {
      sm: { root: 'size-8 text-xs' },
      md: { root: 'size-10 text-sm' },
      lg: { root: 'size-12 text-md' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type AvatarStyleProps = VariantProps<typeof avatarStyles>

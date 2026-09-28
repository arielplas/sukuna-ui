import { tv, type VariantProps } from '../../utils/tv'

export const alertStyles = tv({
  slots: {
    root: 'flex w-full gap-3 rounded-md border border-line border-l-4 bg-surface-2 p-4',
    icon: 'shrink-0 mt-0.5',
    title: 'font-display font-bold tracking-tight text-text',
    body: 'text-sm text-text-dim',
    content: 'min-w-0 flex-1',
    dismiss: [
      '-m-1 ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-sm cursor-pointer',
      'text-text-dim hover:text-text hover:bg-line-soft',
      'transition-colors motion-reduce:transition-none duration-fast ease-sukuna',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    ],
  },
  variants: {
    tone: {
      info: { root: 'border-l-text-faint', icon: 'text-text-dim' },
      success: { root: 'border-l-success', icon: 'text-success' },
      warning: { root: 'border-l-premium', icon: 'text-premium' },
      danger: { root: 'border-l-accent', icon: 'text-accent' },
    },
  },
  defaultVariants: { tone: 'info' },
})

export type AlertStyleProps = VariantProps<typeof alertStyles>

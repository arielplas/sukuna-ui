import { tv, type VariantProps } from '../../utils/tv'

export const tableStyles = tv({
  slots: {
    wrapper: 'w-full overflow-x-auto',
    table: 'w-full border-collapse text-sm text-text',
    header: 'text-left',
    body: '',
    row: 'border-b border-line last:border-b-0 transition-colors data-[interactive]:hover:bg-line-soft',
    headerCell:
      'px-3 h-10 text-xs font-semibold uppercase tracking-eyebrow text-text-dim border-b border-line whitespace-nowrap',
    cell: 'px-3 h-11 align-middle',
  },
  // Root-level options are applied to the <table> through descendant selectors, so the sub-parts
  // (which take no context) don't need to know about them. A descendant rule (`.x td`) also beats
  // the cell's own utility (`.h-11`) on specificity, which is what makes `compact` win.
  variants: {
    density: {
      comfortable: {},
      compact: { table: '[&_th]:h-8 [&_th]:px-2 [&_td]:h-9 [&_td]:px-2' },
    },
    striped: {
      true: { table: '[&_tbody_tr:nth-child(even)]:bg-line-soft' },
    },
    // `line` (10%) rather than `line-soft` (6%) so the hover still reads over a stripe.
    hoverable: {
      true: { table: '[&_tbody_tr:hover]:bg-line' },
    },
  },
  defaultVariants: { density: 'comfortable' },
})

export type TableStyleProps = VariantProps<typeof tableStyles>

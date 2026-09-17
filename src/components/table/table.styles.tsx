import { tv } from '../../utils/tv'

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
})

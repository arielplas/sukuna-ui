import { tv } from '../../utils/tv'

// Shared with the core chrome: the player root is `group/vp` and pins data-theme="dark".
const ring =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-well'

/**
 * Slot class map for the VideoPlayer parts (panel, up next, end screen, share, skip). Pure and
 * server-safe. Parts render inside the player's parts layer, so tokens resolve to the dark palette.
 */
export const videoPlayerPartsStyles = tv({
  slots: {
    // ── side panel ──
    panel: [
      'absolute top-0 right-0 bottom-16 z-20 grid w-[min(21.25rem,44%)] grid-rows-[auto_1fr] rounded-bl-md',
      'border-b border-l border-line bg-surface/95 backdrop-blur-md',
      'transition-[translate] duration-slow ease-sukuna motion-reduce:transition-none starting:translate-x-full',
      '@max-[30rem]:bottom-14 @max-[30rem]:w-full',
    ],
    panelHead: 'flex items-center gap-1 border-b border-line-soft ps-3 pe-2 pt-2',
    tabs: 'flex min-w-0 flex-1 gap-0.5',
    tab: [
      'relative h-9.5 rounded-t-[6px] px-2.5 font-display text-md font-bold text-text-dim cursor-pointer',
      'hover:text-text aria-selected:text-text',
      "aria-selected:after:absolute aria-selected:after:inset-x-2.5 aria-selected:after:-bottom-px aria-selected:after:h-0.5 aria-selected:after:rounded-pill aria-selected:after:bg-accent aria-selected:after:content-['']",
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring',
    ],
    list: 'grid content-start gap-0.5 overflow-auto p-1.5',
    item: [
      'relative grid w-full grid-cols-[5rem_1fr] items-center gap-2.5 rounded-sm p-1.5 text-left text-text cursor-pointer',
      'hover:bg-line-soft aria-[current=true]:bg-accent/10',
      "aria-[current=true]:before:absolute aria-[current=true]:before:inset-y-2.5 aria-[current=true]:before:left-0 aria-[current=true]:before:w-[3px] aria-[current=true]:before:rounded-[3px] aria-[current=true]:before:bg-accent aria-[current=true]:before:content-['']",
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring',
    ],
    thumbWrap: 'relative',
    thumb: 'block aspect-video w-20 rounded-[6px] bg-well object-cover',
    thumbIndex:
      'grid aspect-video w-20 place-items-center rounded-[6px] bg-surface-2 font-display text-md font-bold text-text-dim',
    duration:
      'absolute right-1 bottom-1 rounded-[4px] bg-well/80 px-1 text-[10px] tabular-nums text-text',
    meta: 'grid min-w-0 gap-px',
    metaTitle: 'truncate text-md font-semibold',
    metaSub: 'text-sm tabular-nums text-text-dim',
    line: [
      'grid w-full grid-cols-[2.75rem_1fr] gap-2 rounded-sm px-2 py-1.5 text-left text-md leading-normal text-text-dim cursor-pointer',
      'hover:bg-line-soft aria-[current=true]:bg-accent/10 aria-[current=true]:text-text',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring',
    ],
    lineTime: 'pt-px text-sm tabular-nums text-accent',
    iconButton: [
      'grid size-9 shrink-0 place-items-center rounded-md text-text cursor-pointer hover:bg-line-soft [&_svg]:size-5',
      ring,
    ],
    // ── floating cards ──
    card: [
      'absolute right-4 bottom-22 z-10 rounded-md border border-line bg-surface/95 shadow-card',
      'transition-[bottom,opacity,scale] duration-base ease-sukuna motion-reduce:transition-none',
      'starting:scale-95 starting:opacity-0 group-data-[controls=hidden]/vp:bottom-5',
      // Beside an open side panel instead of under it; a full-width compact panel hides them.
      'group-data-[panel=open]/vp:right-[calc(min(21.25rem,44%)+1rem)]',
      '@max-[30rem]:bottom-18 @max-[30rem]:group-data-[panel=open]/vp:hidden',
    ],
    upNext:
      'grid w-70 grid-cols-[6rem_1fr] gap-2.5 p-2.5 @max-[30rem]:inset-x-2.5 @max-[30rem]:w-auto',
    upNextThumb: 'relative',
    upNextImage: 'block aspect-video w-24 rounded-[6px] bg-well object-cover',
    ring: 'absolute inset-0 m-auto size-7.5',
    ringTrack: 'fill-well/60 stroke-text/25',
    ringValue: 'fill-none stroke-accent',
    ringText: 'fill-text text-[11px] font-bold',
    eyebrow: 'text-xs font-bold tracking-eyebrow text-text-dim uppercase',
    upNextTitle: 'truncate font-display text-md font-bold',
    actions: 'col-span-2 flex gap-1.5 [&>*]:flex-1',
    skip: [
      'inline-flex h-9 items-center gap-2 px-3.5 font-display text-md font-bold text-text cursor-pointer',
      'hover:bg-surface-2 active:scale-[.98] [&_svg]:size-4',
      ring,
    ],
    // ── covers (end screen, share) ──
    cover:
      'absolute inset-0 z-20 grid place-items-center overflow-auto bg-well/75 p-5 backdrop-blur-sm @max-[30rem]:p-3',
    coverCard: 'grid w-full max-w-[32.5rem] gap-3.5 @max-[30rem]:gap-2.5',
    coverHead: 'flex items-center justify-between gap-2',
    heading: 'font-display text-xl font-bold tracking-tight @max-[30rem]:text-lg',
    related: 'grid grid-cols-3 gap-2.5 @max-[30rem]:grid-cols-2',
    relatedItem: [
      'grid content-start gap-1.5 rounded-sm text-left text-text cursor-pointer',
      '[&:hover_img]:ring-2 [&:hover_img]:ring-accent',
      ring,
    ],
    relatedImage: 'block aspect-video w-full rounded-sm bg-surface-2 object-cover ring-1 ring-line',
    relatedTitle: 'text-sm font-semibold leading-tight',
    relatedSub: 'text-xs tabular-nums text-text-dim',
    buttons: 'flex flex-wrap gap-1.5',
    primary: [
      'h-9 rounded-md bg-gradient-accent px-4 font-display text-md font-bold text-on-accent cursor-pointer',
      'hover:brightness-110 active:scale-[.98]',
      ring,
    ],
    secondary: [
      'h-9 rounded-md border border-line bg-surface-2 px-3.5 font-display text-md font-bold text-text cursor-pointer',
      'hover:bg-well active:scale-[.98]',
      ring,
    ],
    close: [
      'absolute top-3 right-3 grid size-9 place-items-center rounded-md text-text cursor-pointer hover:bg-line-soft [&_svg]:size-5',
      ring,
    ],
    field: 'flex gap-2',
    input: [
      'h-9 min-w-0 flex-1 rounded-md border border-line bg-surface-2 px-3 text-md text-text',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    ],
    check:
      'inline-flex items-center gap-2 text-md text-text-dim [&_input]:size-4 [&_input]:accent-accent',
    embed: [
      'h-16 w-full resize-none rounded-md border border-line bg-surface-2 px-3 py-2.5 font-mono text-sm text-text-dim',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    ],
    label: 'text-sm font-semibold text-text-dim',
    // ── overlay ──
    overlay: [
      'absolute z-10 transition-[opacity,scale] duration-base ease-sukuna motion-reduce:transition-none',
      'starting:scale-95 starting:opacity-0',
    ],
    overlayCard:
      'max-w-[min(20rem,calc(100%-2rem))] rounded-md border border-line bg-surface/95 p-3 pe-10 text-md text-text shadow-card',
    overlayBanner:
      'inset-x-0 bottom-16 border-y border-line-soft bg-well/80 px-4 py-2 text-md text-text backdrop-blur-sm',
    overlayPlain: '',
    overlayClose: [
      'absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-sm text-text-dim cursor-pointer',
      'hover:bg-line-soft hover:text-text [&_svg]:size-4',
      ring,
    ],
    // ── audio ──
    audio: [
      'pointer-events-none absolute inset-0 grid grid-cols-[auto_1fr] items-center gap-6 px-7 pt-7 pb-24',
      'bg-radial-[ellipse_at_20%_40%] from-accent-deep/40 to-well to-70%',
      '@max-[30rem]:gap-3.5 @max-[30rem]:px-4 @max-[30rem]:pt-4 @max-[30rem]:pb-18',
    ],
    art: 'aspect-square w-[clamp(5rem,26cqw,10.5rem)] rounded-md bg-surface-2 object-cover shadow-card',
    artFallback:
      'grid aspect-square w-[clamp(5rem,26cqw,10.5rem)] place-items-center rounded-md bg-gradient-accent font-display text-3xl font-black text-on-accent shadow-[0_20px_40px_-12px_var(--sk-accent-glow)]',
    audioMeta: 'grid min-w-0 content-center gap-3.5',
    audioTitle: 'truncate font-display text-xl font-bold tracking-tight @max-[30rem]:text-lg',
    audioArtist: 'truncate text-md text-text-dim',
    visualizer: 'h-[clamp(3rem,22cqw,8rem)] w-full',
  },
  variants: {
    placement: {
      'top-left': { overlay: 'top-16 left-4' },
      'top-right': { overlay: 'top-16 right-4' },
      'bottom-left': { overlay: 'bottom-22 left-4' },
      'bottom-right': { overlay: 'right-4 bottom-22' },
      center: { overlay: 'top-1/2 left-1/2 -translate-1/2' },
    },
  },
})

import { tv, type VariantProps } from '../../utils/tv'

// Shared focus ring for every control on the dark chrome.
const ring =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-well'

// Chrome that fades with the controls (`data-controls="hidden"` on the root, group `vp`).
const fades =
  'transition-opacity duration-base ease-sukuna motion-reduce:transition-none group-data-[controls=hidden]/vp:pointer-events-none group-data-[controls=hidden]/vp:opacity-0'

/**
 * Slot class map for {@link VideoPlayer}. Pure and server-safe. The root pins
 * `data-theme="dark"`, so every token below resolves to the dark palette even in a light app.
 * Positional values (played / buffered widths, preview offset, sprite position) are inline styles;
 * everything themable is a token utility.
 */
export const videoPlayerStyles = tv({
  slots: {
    root: [
      'group/vp @container relative w-full max-w-full overflow-hidden select-none',
      // Native scrollbars and form controls inside the chrome follow the dark palette too.
      'rounded-lg bg-well text-text shadow-card font-sans text-sm [color-scheme:dark]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      'data-[controls=hidden]:cursor-none',
    ],
    video: 'absolute inset-0 size-full object-contain bg-well',
    scrimTop: `pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-linear-to-b from-well/70 to-transparent ${fades}`,
    scrimBottom: `pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-linear-to-t from-well/90 via-well/40 to-transparent ${fades}`,
    top: `absolute inset-x-0 top-0 flex items-start gap-3 px-5 pt-3.5 @max-[30rem]:px-3.5 @max-[30rem]:pt-2.5 ${fades}`,
    titleWrap: 'min-w-0 flex-1 pt-0.5',
    title: 'truncate font-display text-lg font-bold tracking-tight text-text @max-[30rem]:text-md',
    info: 'truncate text-sm text-text-dim',
    logo: 'block h-6 w-auto opacity-80 transition-opacity duration-fast hover:opacity-100',
    logoLink: `shrink-0 rounded-sm ${ring}`,
    center: 'pointer-events-none absolute inset-0 grid place-items-center',
    bigPlay: [
      'pointer-events-auto grid size-16 place-items-center rounded-full cursor-pointer',
      'bg-gradient-accent text-on-accent shadow-[0_0_28px_6px_var(--sk-accent-glow)]',
      'transition-[scale,filter] duration-fast ease-sukuna motion-reduce:transition-none',
      'hover:scale-105 hover:brightness-110 active:scale-[.98] [&_svg]:ml-0.5 [&_svg]:size-7',
      '@max-[30rem]:size-13 @max-[30rem]:[&_svg]:size-5.5',
      ring,
    ],
    // Indeterminate ring (the wrapper is the role=status live region); the spin stops under
    // reduced motion, the static ring stays.
    spinner:
      'inline-flex text-accent [&_svg]:size-10 [&_svg]:animate-spin motion-reduce:[&_svg]:animate-none',
    errorPanel:
      'pointer-events-auto grid max-w-80 justify-items-center gap-3 px-5 text-center [&>svg]:size-8',
    errorTitle: 'font-display text-md font-bold',
    errorBody: 'text-sm text-text-dim',
    retry: [
      'h-8 rounded-sm border border-line bg-surface-2 px-3 cursor-pointer',
      'font-display text-sm font-bold text-text hover:bg-well',
      ring,
    ],
    captionWrap: [
      'pointer-events-none absolute inset-x-0 bottom-22 flex justify-center px-[10%] text-center',
      'transition-[bottom] duration-base ease-sukuna motion-reduce:transition-none',
      'group-data-[controls=hidden]/vp:bottom-6 @max-[30rem]:bottom-18',
    ],
    caption:
      'whitespace-pre-line rounded-[6px] px-2.5 py-0.5 leading-[1.35] [box-decoration-break:clone]',
    parts: 'pointer-events-none absolute inset-0 [&>*]:pointer-events-auto',
    bar: `absolute inset-x-0 bottom-0 grid gap-0.5 px-3 pb-2.5 @max-[30rem]:px-1.5 @max-[30rem]:pb-1.5 ${fades}`,
    seek: [
      'group/seek relative mx-1.5 flex h-5 cursor-pointer touch-none items-center rounded-sm outline-none',
      'focus-visible:ring-2 focus-visible:ring-focus-ring',
    ],
    segments: 'flex h-2 w-full items-center gap-[3px]',
    segment: [
      'relative h-1 overflow-hidden rounded-pill bg-text/20',
      'transition-[height] duration-fast ease-sukuna motion-reduce:transition-none',
      'group-hover/seek:h-[5px] group-data-[dragging]/seek:h-[5px]',
    ],
    buffered: 'absolute inset-y-0 left-0 bg-text/35',
    loopRange:
      'pointer-events-none absolute top-1/2 -mt-1.5 h-3 rounded-[3px] border-x-2 border-premium bg-premium/15',
    played: 'absolute inset-y-0 left-0 bg-accent',
    thumb: [
      'pointer-events-none absolute top-1/2 -mt-[7px] -ml-[7px] size-3.5 rounded-full bg-accent scale-0',
      'transition-[scale,box-shadow] duration-fast ease-sukuna motion-reduce:transition-none',
      'group-hover/seek:scale-100 group-focus-visible/seek:scale-100 group-data-[dragging]/seek:scale-100',
      'group-data-[dragging]/seek:shadow-[0_0_0_5px_var(--sk-accent-glow)]',
    ],
    preview: [
      'pointer-events-none absolute bottom-6.5 grid -translate-x-1/2 justify-items-center gap-1 opacity-0',
      'transition-opacity duration-fast motion-reduce:transition-none',
      'group-hover/seek:opacity-100 group-data-[dragging]/seek:opacity-100',
    ],
    previewImage:
      'h-[90px] w-40 rounded-sm bg-well bg-no-repeat shadow-card @max-[30rem]:h-[68px] @max-[30rem]:w-30',
    previewChapter:
      'max-w-44 truncate text-center font-display text-sm font-bold [text-shadow:0_1px_4px_var(--sk-well)]',
    previewTime: 'rounded-[6px] border border-line bg-surface-2 px-1.5 py-px text-xs tabular-nums',
    row: 'flex min-w-0 items-center gap-0.5',
    spacer: 'min-w-1 flex-1',
    button: [
      'relative grid size-9 shrink-0 place-items-center rounded-md text-text cursor-pointer',
      'transition-[background-color,scale] duration-fast ease-sukuna motion-reduce:transition-none',
      'hover:bg-line-soft active:scale-95 [&_svg]:size-5',
      '@max-[30rem]:size-8 @max-[30rem]:[&_svg]:size-4.5',
      "aria-pressed:after:absolute aria-pressed:after:inset-x-2.5 aria-pressed:after:bottom-1.5 aria-pressed:after:h-0.5 aria-pressed:after:rounded-pill aria-pressed:after:bg-accent aria-pressed:after:content-['']",
      ring,
    ],
    compactHidden: '@max-[30rem]:hidden',
    midHidden: '@max-[40rem]:hidden',
    hdBadge:
      'absolute top-1 right-0.5 rounded-[3px] bg-accent px-0.5 font-display text-[8px] leading-[11px] font-black text-on-accent',
    time: 'whitespace-nowrap ps-2 pe-1 text-sm tabular-nums @max-[30rem]:ps-1 @max-[30rem]:text-xs',
    timeDim: 'text-text-dim',
    chapterButton: [
      'inline-flex h-7.5 min-w-0 items-center gap-1 rounded-sm ps-2 pe-1.5 text-sm cursor-pointer @max-[30rem]:hidden',
      'hover:bg-line-soft [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-text-dim',
      ring,
    ],
    chapterName: 'truncate font-semibold',
    chapterDot: 'text-text-dim',
    volumeGroup: 'group/vol flex items-center',
    volumeSlide: [
      'flex h-9 w-0 items-center overflow-hidden',
      'transition-[width] duration-base ease-sukuna motion-reduce:transition-none',
      'group-hover/vol:w-20 group-focus-within/vol:w-20 @max-[30rem]:hidden',
    ],
    volumeTrack: [
      'relative ms-1.5 me-2.5 h-1 w-16 shrink-0 cursor-pointer rounded-pill bg-text/20 outline-none',
      'focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-well',
    ],
    volumeFill: 'absolute inset-y-0 left-0 rounded-pill bg-text',
    volumeThumb: 'absolute top-1/2 -mt-1.5 -ml-1.5 size-3 rounded-full bg-text',
    menu: [
      'absolute right-3 bottom-16 z-10 grid w-65 max-h-[calc(100%-5.25rem)] content-start overflow-auto p-1',
      'rounded-md border border-line bg-surface/95 shadow-card',
      'origin-bottom-right transition-[opacity,scale] duration-fast ease-sukuna motion-reduce:transition-none',
      'starting:scale-95 starting:opacity-0',
      '@max-[30rem]:inset-x-1.5 @max-[30rem]:bottom-14 @max-[30rem]:w-auto',
    ],
    menuHead: 'mb-1 flex items-center gap-1.5 border-b border-line-soft px-1 pt-1 pb-1.5',
    menuHeadTitle: 'font-display text-md font-bold',
    menuBack: [
      'grid size-7 place-items-center rounded-sm cursor-pointer hover:bg-line-soft [&_svg]:size-4',
      ring,
    ],
    menuLabel: 'px-2.5 pt-2 pb-1 text-xs font-bold tracking-eyebrow text-text-dim uppercase',
    menuItem: [
      'flex min-h-8.5 w-full items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-left text-md tabular-nums text-text cursor-pointer',
      'hover:bg-line-soft focus-visible:bg-line-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring',
      '[&>svg]:size-4.5 [&>svg]:shrink-0 [&>svg]:text-text-dim',
    ],
    menuValue:
      'ms-auto inline-flex items-center gap-1 text-sm text-text-dim [&_svg]:size-3.5 [&_svg]:text-text-dim',
    menuTick:
      'invisible w-3.5 shrink-0 text-accent [&_svg]:size-3.5 group-aria-checked/item:visible',
    hdTag: 'font-display text-[9px] font-black text-accent',
    chips: 'flex flex-wrap gap-1.5 px-2.5 pt-1 pb-2',
    chip: [
      'h-6.5 rounded-pill border border-line px-2.5 text-sm text-text cursor-pointer',
      'aria-checked:border-accent aria-checked:bg-accent/15',
      ring,
    ],
    swatch: 'mx-auto block size-3.5 rounded-full ring-1 ring-line',
    switch: [
      'relative ms-auto h-4.5 w-7.5 shrink-0 rounded-pill bg-text/20 transition-colors duration-fast',
      'group-aria-checked/item:bg-accent',
      "after:absolute after:top-0.5 after:left-0.5 after:size-3.5 after:rounded-full after:bg-text after:content-['']",
      'after:transition-[translate] after:duration-base after:ease-spring motion-reduce:after:transition-none',
      'group-aria-checked/item:after:translate-x-3',
    ],
    toast: [
      'pointer-events-none absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-md border border-line',
      'bg-surface/95 px-3.5 py-2 text-md text-text shadow-card',
      'transition-[opacity,scale] duration-base ease-sukuna motion-reduce:transition-none starting:scale-95 starting:opacity-0',
    ],
    live: [
      'ms-1.5 inline-flex h-6 items-center gap-1.5 rounded-[6px] px-2 text-xs font-extrabold tracking-[0.12em] cursor-pointer',
      'bg-line-soft text-text-dim hover:text-text data-[edge]:text-text',
      "before:size-[7px] before:rounded-full before:bg-text-dim before:content-['']",
      'data-[edge]:before:bg-accent data-[edge]:before:shadow-[0_0_8px_var(--sk-accent-glow)]',
      'data-[edge]:before:animate-pulse motion-reduce:data-[edge]:before:animate-none',
      ring,
    ],
    contextMenu: [
      'absolute z-20 grid w-58 p-1 rounded-md border border-line bg-surface/95 shadow-card',
      'transition-[opacity,scale] duration-fast ease-sukuna motion-reduce:transition-none',
      'starting:scale-95 starting:opacity-0',
    ],
    separator: 'my-1 border-t border-line-soft',
    touchRow: 'pointer-events-auto flex items-center gap-7',
    touchButton: [
      'grid size-12 place-items-center rounded-full bg-well/45 text-text cursor-pointer [&_svg]:size-6',
      ring,
    ],
    flash: [
      'pointer-events-none absolute inset-y-0 grid w-[38%] place-items-center text-sm font-bold',
      '[&_svg]:mx-auto [&_svg]:mb-1 [&_svg]:size-7',
    ],
    flashLeft:
      'left-0 rounded-r-[50%] bg-radial-[ellipse_at_left] from-text/15 to-transparent to-70%',
    flashRight:
      'right-0 rounded-l-[50%] bg-radial-[ellipse_at_right] from-text/15 to-transparent to-70%',
    unmute: [
      'pointer-events-auto absolute top-16 left-4 inline-flex h-9 items-center gap-2 rounded-md px-3.5 cursor-pointer',
      'border border-line bg-surface/90 font-display text-md font-bold text-text [&_svg]:size-4',
      ring,
    ],
    cover:
      'absolute inset-0 z-20 grid place-items-center overflow-auto bg-well/75 p-5 backdrop-blur-sm',
    shortcuts: 'grid w-full max-w-md gap-3',
    shortcutsGrid: 'grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm',
    kbd: 'justify-self-start rounded-[5px] border border-b-2 border-line bg-surface px-1.5 font-mono text-xs',
    close: [
      'absolute top-3 right-3 grid size-9 place-items-center rounded-md cursor-pointer hover:bg-line-soft [&_svg]:size-5',
      ring,
    ],
    host: 'relative w-full',
    primary: [
      'h-8 rounded-sm bg-gradient-accent px-3 font-display text-sm font-bold text-on-accent cursor-pointer',
      'transition-[filter,scale] duration-fast ease-sukuna motion-reduce:transition-none hover:brightness-110 active:scale-[.98]',
      ring,
    ],
    resume: [
      'pointer-events-auto absolute bottom-22 left-4 z-10 flex items-center gap-2.5 rounded-md border border-line',
      'bg-surface/95 py-2 ps-3.5 pe-2 text-md text-text shadow-card',
      'transition-[bottom] duration-base ease-sukuna motion-reduce:transition-none group-data-[controls=hidden]/vp:bottom-5',
      '@max-[30rem]:inset-x-2.5 @max-[30rem]:bottom-18 @max-[30rem]:text-sm',
    ],
    dockClose: [
      'absolute top-2 right-2 z-30 grid size-8 place-items-center rounded-full bg-well/70 text-text cursor-pointer',
      'hover:bg-well [&_svg]:size-4',
      ring,
    ],
    srOnly: 'sr-only',
  },
  variants: {
    aspectRatio: {
      '16/9': { root: 'aspect-video' },
      '4/3': { root: 'aspect-[4/3]' },
      '1/1': { root: 'aspect-square' },
      '21/9': { root: 'aspect-[21/9]' },
      '9/16': { root: 'aspect-[9/16]' },
    },
    fullscreen: { true: { root: 'aspect-auto rounded-none' } },
    docked: {
      true: {
        root: 'fixed right-4 bottom-4 z-40 aspect-video w-[min(22.5rem,calc(100vw-2rem))] max-w-none',
      },
    },
    hot: { true: { segment: 'h-2 group-hover/seek:h-2 group-data-[dragging]/seek:h-2' } },
    captionSize: {
      S: { caption: 'text-sm' },
      M: { caption: 'text-lg' },
      L: { caption: 'text-2xl' },
    },
    captionColor: {
      text: { caption: 'text-text' },
      premium: { caption: 'text-premium' },
    },
    captionBg: {
      solid: { caption: 'bg-well/80' },
      soft: { caption: 'bg-well/45' },
      none: {
        caption: 'bg-transparent [text-shadow:0_1px_3px_var(--sk-well),0_0_8px_var(--sk-well)]',
      },
    },
  },
  defaultVariants: {
    aspectRatio: '16/9',
    captionSize: 'M',
    captionColor: 'text',
    captionBg: 'solid',
  },
})

export type VideoPlayerStyleProps = VariantProps<typeof videoPlayerStyles>

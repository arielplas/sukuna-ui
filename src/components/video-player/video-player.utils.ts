// Pure helpers for VideoPlayer: time formatting, WebVTT parsing, chapter / cue / thumbnail lookup
// and source selection. No DOM, no React — safe on the server and trivially unit-testable.

/** One timed text cue parsed from a WebVTT file (captions, chapters or thumbnails). */
export interface VttCue {
  /** Start time in seconds. */
  start: number
  /** End time in seconds. */
  end: number
  /** Cue payload: caption text, chapter title, or a thumbnail URL (with optional `#xywh=`). */
  text: string
  /** Optional cue identifier line. Nuevo-style chapter VTTs put a thumbnail URL here. */
  id?: string
}

/** A chapter: where it starts and what it's called. */
export interface Chapter {
  /** Start time in seconds. */
  start: number
  /** Visible chapter title. */
  title: string
  /** Optional 16:9 thumbnail URL shown in the chapters list. */
  thumb?: string
}

/** A preview thumbnail for a time range: a whole image or one tile of a sprite sheet. */
export interface ThumbnailCue {
  /** Start time in seconds. */
  start: number
  /** End time in seconds. */
  end: number
  /** Image URL (sprite sheet or single frame). */
  url: string
  /** Sprite tile rectangle in pixels; omitted for a single-frame image. */
  x?: number
  y?: number
  w?: number
  h?: number
}

/** One selectable rendition of the video. */
export interface VideoSource {
  /** Media URL. */
  src: string
  /** MIME type, e.g. `video/mp4`. */
  type?: string
  /** Vertical resolution (`1080`) or an `'SD'` / `'HD'` label. Drives the quality menu. */
  res?: number | 'SD' | 'HD'
  /** Menu label; defaults to `${res}p` (or the SD/HD label). */
  label?: string
  /** Play this rendition first. */
  default?: boolean
}

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** `75` → `1:15`; `3725` → `1:02:05` (hours only when the reference duration needs them). */
export function formatTime(seconds: number, reference = seconds): string {
  if (!Number.isFinite(seconds)) return '--:--'
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  if (h > 0 || reference >= 3600) return `${h}:${String(m).padStart(2, '0')}:${sec}`
  return `${m}:${sec}`
}

/** Screen-reader time: `83` → `1 minute 23 seconds`. */
export function spokenTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return 'unknown'
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const part = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`
  const out: string[] = []
  if (h) out.push(part(h, 'hour'))
  if (m) out.push(part(m, 'minute'))
  if (r || out.length === 0) out.push(part(r, 'second'))
  return out.join(' ')
}

/** `00:01:02.500` / `01:02.5` → seconds. */
export function parseTimestamp(ts: string): number {
  const parts = ts.trim().split(':').map(Number)
  return parts.reduce((acc, n) => acc * 60 + n, 0)
}

/**
 * Minimal WebVTT parser: cue blocks with an optional id line and a `start --> end` timing line.
 * Headers, NOTE/STYLE/REGION blocks and cue settings are skipped; inline tags are stripped.
 */
export function parseVtt(text: string): VttCue[] {
  const cues: VttCue[] = []
  for (const block of text.replace(/\r\n?/g, '\n').split(/\n{2,}/)) {
    const lines = block.split('\n').filter((l) => l.trim() !== '')
    const timingAt = lines.findIndex((l) => l.includes('-->'))
    if (timingAt < 0) continue
    const [startRaw = '', rest = ''] = (lines[timingAt] as string).split('-->')
    const endRaw = rest.trim().split(/\s+/)[0] ?? ''
    const body = lines
      .slice(timingAt + 1)
      .join('\n')
      .replace(/<[^>]+>/g, '')
    cues.push({
      start: parseTimestamp(startRaw),
      end: parseTimestamp(endRaw),
      text: body,
      ...(timingAt > 0 ? { id: (lines[timingAt - 1] as string).trim() } : {}),
    })
  }
  return cues
}

/** The cue active at `t`, if any (start inclusive, end exclusive). */
export const cueAt = <T extends { start: number; end: number }>(cues: T[], t: number) =>
  cues.find((c) => t >= c.start && t < c.end)

/** Chapters from a parsed chapters VTT; a URL-looking cue id becomes the thumbnail (Nuevo format). */
export const chaptersFromCues = (cues: VttCue[]): Chapter[] =>
  cues.map((c) => ({
    start: c.start,
    title: c.text,
    ...(c.id && /^(https?:)?\/\/|^\//.test(c.id) ? { thumb: c.id } : {}),
  }))

/** Index of the chapter containing `t` (the last one whose start is ≤ t). -1 with no chapters. */
export function chapterIndexAt(chapters: Chapter[], t: number): number {
  let index = chapters.length ? 0 : -1
  chapters.forEach((c, i) => {
    if (t >= c.start) index = i
  })
  return index
}

/** End of chapter `i`: the next chapter's start, or the media duration for the last one. */
export const chapterEnd = (chapters: Chapter[], i: number, duration: number) =>
  chapters[i + 1]?.start ?? duration

/**
 * Thumbnail cues from a thumbnails VTT. Relative URLs resolve against the VTT's own URL; a
 * `#xywh=x,y,w,h` fragment selects a sprite tile.
 */
export function thumbnailsFromCues(cues: VttCue[], vttUrl: string): ThumbnailCue[] {
  const base = vttUrl.slice(0, vttUrl.lastIndexOf('/') + 1)
  return cues.map((c) => {
    const [path = '', frag] = c.text.trim().split('#xywh=')
    const url = /^(https?:)?\/\/|^\/|^data:/.test(path) ? path : base + path
    if (!frag) return { start: c.start, end: c.end, url }
    const [x = 0, y = 0, w = 0, h = 0] = frag.split(',').map(Number)
    return { start: c.start, end: c.end, url, x, y, w, h }
  })
}

/** Numeric rank for sorting / HD detection. `'HD'` counts as 720, `'SD'` as 480. */
export const resRank = (res: VideoSource['res']) =>
  typeof res === 'number' ? res : res === 'HD' ? 720 : res === 'SD' ? 480 : 0

export const sourceLabel = (s: VideoSource) =>
  s.label ?? (typeof s.res === 'number' ? `${s.res}p` : (s.res ?? s.src))

export const isHd = (s: VideoSource) => resRank(s.res) >= 720

/** The rendition to start with: the one marked `default`, else the first. */
export const defaultSourceIndex = (sources: VideoSource[]) =>
  Math.max(
    0,
    sources.findIndex((s) => s.default),
  )

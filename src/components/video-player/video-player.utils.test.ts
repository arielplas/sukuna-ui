import { describe, expect, it } from 'bun:test'
import { defaultLabels } from './video-player.labels'
import {
  chapterEnd,
  chapterIndexAt,
  chaptersFromCues,
  cueAt,
  defaultSourceIndex,
  formatTime,
  isHd,
  parseTimestamp,
  parseVtt,
  resRank,
  sourceLabel,
  spokenTime,
  thumbnailsFromCues,
} from './video-player.utils'

describe('VideoPlayer utils', () => {
  it('formats clock time, switching to hours when the reference needs them', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(75.9)).toBe('1:15')
    expect(formatTime(3725)).toBe('1:02:05')
    expect(formatTime(65, 4000)).toBe('0:01:05')
    expect(formatTime(Number.NaN)).toBe('--:--')
    expect(formatTime(-3)).toBe('0:00')
  })

  it('speaks time for screen readers', () => {
    expect(spokenTime(0)).toBe('0 seconds')
    expect(spokenTime(1)).toBe('1 second')
    expect(spokenTime(83)).toBe('1 minute 23 seconds')
    expect(spokenTime(120)).toBe('2 minutes')
    expect(spokenTime(3661)).toBe('1 hour 1 minute 1 second')
    expect(spokenTime(Number.POSITIVE_INFINITY)).toBe('unknown')
  })

  it('parses timestamps with and without hours', () => {
    expect(parseTimestamp('00:01:02.500')).toBe(62.5)
    expect(parseTimestamp('01:02.5')).toBe(62.5)
  })

  it('parses WebVTT cues, ids, settings and tags; skips headers and notes', () => {
    const cues = parseVtt(
      [
        'WEBVTT',
        '',
        'NOTE a comment',
        '',
        'intro',
        '00:00:00.000 --> 00:00:05.000 align:start',
        '<v Narrator>Shibuya</v>, <i>11:40</i>',
        'second line',
        '',
        '00:05.000 --> 00:10.000',
        'Next',
      ].join('\r\n'),
    )
    expect(cues).toEqual([
      { start: 0, end: 5, text: 'Shibuya, 11:40\nsecond line', id: 'intro' },
      { start: 5, end: 10, text: 'Next' },
    ])
  })

  it('finds the active cue', () => {
    const cues = [
      { start: 0, end: 5, text: 'a' },
      { start: 5, end: 9, text: 'b' },
    ]
    expect(cueAt(cues, 5)?.text).toBe('b')
    expect(cueAt(cues, 9)).toBeUndefined()
  })

  it('builds chapters, taking a URL cue id as the thumbnail', () => {
    const chapters = chaptersFromCues([
      { start: 0, end: 30, text: 'One', id: 'https://cdn.test/1.jpg' },
      { start: 30, end: 60, text: 'Two', id: 'chapter-2' },
      { start: 60, end: 90, text: 'Three', id: '/img/3.jpg' },
    ])
    expect(chapters).toEqual([
      { start: 0, title: 'One', thumb: 'https://cdn.test/1.jpg' },
      { start: 30, title: 'Two' },
      { start: 60, title: 'Three', thumb: '/img/3.jpg' },
    ])
    expect(chapterIndexAt(chapters, 45)).toBe(1)
    expect(chapterIndexAt(chapters, 0)).toBe(0)
    expect(chapterIndexAt([], 10)).toBe(-1)
    expect(chapterEnd(chapters, 1, 120)).toBe(60)
    expect(chapterEnd(chapters, 2, 120)).toBe(120)
  })

  it('reads sprite and single-frame thumbnails, resolving relative URLs', () => {
    const thumbs = thumbnailsFromCues(
      [
        { start: 0, end: 5, text: 'sprite.jpg#xywh=0,90,160,90' },
        { start: 5, end: 10, text: '/abs/frame.jpg' },
        { start: 10, end: 15, text: 'data:image/png;base64,AA' },
      ],
      'https://cdn.test/v/thumbs.vtt',
    )
    expect(thumbs[0]).toEqual({
      start: 0,
      end: 5,
      url: 'https://cdn.test/v/sprite.jpg',
      x: 0,
      y: 90,
      w: 160,
      h: 90,
    })
    expect(thumbs[1]).toEqual({ start: 5, end: 10, url: '/abs/frame.jpg' })
    expect(thumbs[2]?.url).toBe('data:image/png;base64,AA')
  })

  it('ranks and labels renditions', () => {
    expect(resRank(1080)).toBe(1080)
    expect(resRank('HD')).toBe(720)
    expect(resRank('SD')).toBe(480)
    expect(resRank(undefined)).toBe(0)
    expect(sourceLabel({ src: 'a', res: 720 })).toBe('720p')
    expect(sourceLabel({ src: 'a', res: 'HD' })).toBe('HD')
    expect(sourceLabel({ src: 'a', label: '4K' })).toBe('4K')
    expect(sourceLabel({ src: 'a' })).toBe('a')
    expect(isHd({ src: 'a', res: 720 })).toBe(true)
    expect(isHd({ src: 'a', res: 'SD' })).toBe(false)
    expect(defaultSourceIndex([{ src: 'a' }, { src: 'b', default: true }])).toBe(1)
    expect(defaultSourceIndex([{ src: 'a' }])).toBe(0)
    expect(defaultSourceIndex([])).toBe(0)
  })

  it('default labels format their parameters', () => {
    expect(defaultLabels.playTitle('Demo')).toBe('Play Demo')
    expect(defaultLabels.seekValue(83, 250, 'Intro')).toBe(
      '1 minute 23 seconds of 4 minutes 10 seconds, Intro',
    )
    expect(defaultLabels.seekValue(0, 10)).toBe('0 seconds of 10 seconds')
    expect(defaultLabels.back(10)).toBe('Back 10 seconds')
    expect(defaultLabels.forward(5)).toBe('Forward 5 seconds')
    expect(defaultLabels.copyLinkAt('1:23')).toBe('Copy link at 1:23')
    expect(defaultLabels.shortcutList(15)[3]).toEqual(['J L', 'Back / forward 15 seconds'])
    expect(defaultLabels.playlistPosition(2, 5)).toBe('2 of 5')
    expect(defaultLabels.startAt('0:42')).toBe('Start at 0:42')
    expect(defaultLabels.upNextIn(7)).toBe('Up next in 7')
    expect(defaultLabels.resumeFrom('2:14')).toBe('Resume from 2:14?')
  })
})

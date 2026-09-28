// Every visible and accessible string VideoPlayer renders, so apps can translate the player by
// passing `labels`. English defaults. Pure data + tiny formatters; server-safe.
import { spokenTime } from './video-player.utils'

/** Strings used by {@link VideoPlayer}. Override any subset through the `labels` prop. */
export interface VideoPlayerLabels {
  play: string
  pause: string
  replay: string
  /** Big start button; receives the video title. */
  playTitle: (title: string) => string
  mute: string
  unmute: string
  volume: string
  seek: string
  /** `aria-valuetext` of the seek slider. */
  seekValue: (current: number, duration: number, chapter?: string) => string
  back: (seconds: number) => string
  forward: (seconds: number) => string
  captionsOn: string
  captionsOff: string
  settings: string
  quality: string
  auto: string
  speed: string
  normal: string
  subtitles: string
  off: string
  captionStyle: string
  size: string
  small: string
  medium: string
  large: string
  textColor: string
  white: string
  champagne: string
  background: string
  solid: string
  soft: string
  outline: string
  backToSettings: string
  chapters: string
  enterFullscreen: string
  exitFullscreen: string
  pip: string
  airplay: string
  loading: string
  errorTitle: string
  errorBody: string
  retry: string
  tapToUnmute: string
  copyLink: string
  copyLinkAt: (time: string) => string
  shortcuts: string
  videoOptions: string
  close: string
  /** Rows of the keyboard-shortcuts sheet: `[keys, action]`. */
  shortcutList: (skipSeconds: number) => [string, string][]
  previous: string
  next: string
  panel: string
  closePanel: string
  playlist: string
  transcript: string
  playlistPosition: (index: number, total: number) => string
  nowPlaying: string
  share: string
  shareTitle: string
  videoLink: string
  startAt: (time: string) => string
  embedCode: string
  copyEmbed: string
  copied: string
  theater: string
  upNext: string
  upNextIn: (seconds: number) => string
  playNow: string
  cancel: string
  watchNext: string
  skipIntro: string
  resumeFrom: (time: string) => string
  resume: string
  startOver: string
  closeMiniPlayer: string
  picture: string
  pictureDefault: string
  pictureAdjusted: string
  zoom: string
  mirror: string
  brightness: string
  contrast: string
  saturation: string
  resetPicture: string
  sleepTimer: string
  sleepMinutes: (minutes: number) => string
  endOfVideo: string
  loop: string
  loopVideo: string
  loopChapter: string
  loopCustom: (a: string, b: string) => string
  setLoopStart: (time: string) => string
  setLoopEnd: (time: string) => string
  snapshot: string
  snapshotSaved: string
  snapshotBlocked: string
  download: string
  live: string
  goLive: string
  behindLive: (time: string) => string
  roleDescription: string
}

export const defaultLabels: VideoPlayerLabels = {
  play: 'Play',
  pause: 'Pause',
  replay: 'Replay',
  playTitle: (title) => `Play ${title}`,
  mute: 'Mute',
  unmute: 'Unmute',
  volume: 'Volume',
  seek: 'Seek',
  seekValue: (current, duration, chapter) =>
    `${spokenTime(current)} of ${spokenTime(duration)}${chapter ? `, ${chapter}` : ''}`,
  back: (s) => `Back ${s} seconds`,
  forward: (s) => `Forward ${s} seconds`,
  captionsOn: 'Turn on captions',
  captionsOff: 'Turn off captions',
  settings: 'Settings',
  quality: 'Quality',
  auto: 'Auto',
  speed: 'Speed',
  normal: 'Normal',
  subtitles: 'Subtitles / CC',
  off: 'Off',
  captionStyle: 'Caption style',
  size: 'Size',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  textColor: 'Text color',
  white: 'White',
  champagne: 'Champagne',
  background: 'Background',
  solid: 'Solid',
  soft: 'Soft',
  outline: 'Outline',
  backToSettings: 'Back to settings',
  chapters: 'Chapters',
  enterFullscreen: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  pip: 'Picture-in-picture',
  airplay: 'AirPlay',
  loading: 'Loading',
  errorTitle: "This video couldn't be loaded.",
  errorBody: 'Check the link or your connection, then try again.',
  retry: 'Retry',
  tapToUnmute: 'Tap to unmute',
  copyLink: 'Copy video link',
  copyLinkAt: (time) => `Copy link at ${time}`,
  shortcuts: 'Keyboard shortcuts',
  videoOptions: 'Video options',
  close: 'Close',
  shortcutList: (skip) => [
    ['Space / K', 'Play or pause'],
    ['← →', 'Back / forward 5 seconds'],
    ['Shift + ← →', 'Previous / next chapter'],
    ['J L', `Back / forward ${skip} seconds`],
    ['↑ ↓', 'Volume'],
    ['M', 'Mute'],
    ['C', 'Captions'],
    ['F', 'Fullscreen'],
    ['I', 'Picture-in-picture'],
    [', .', 'Previous / next frame (paused)'],
    ['< >', 'Slower / faster'],
    ['0–9', 'Jump to 0–90%'],
    ['Shift + N / P', 'Next / previous video'],
    ['T', 'Theater mode'],
    ['?', 'This list'],
  ],
  previous: 'Previous video',
  next: 'Next video',
  panel: 'Chapters and playlist',
  closePanel: 'Close panel',
  playlist: 'Playlist',
  transcript: 'Transcript',
  playlistPosition: (i, n) => `${i} of ${n}`,
  nowPlaying: 'Now playing',
  share: 'Share',
  shareTitle: 'Share this video',
  videoLink: 'Video link',
  startAt: (t) => `Start at ${t}`,
  embedCode: 'Embed code',
  copyEmbed: 'Copy embed code',
  copied: 'Copied',
  theater: 'Theater mode',
  upNext: 'Up next',
  upNextIn: (n) => `Up next in ${n}`,
  playNow: 'Play now',
  cancel: 'Cancel',
  watchNext: 'Watch next',
  skipIntro: 'Skip intro',
  resumeFrom: (t) => `Resume from ${t}?`,
  resume: 'Resume',
  startOver: 'Start over',
  closeMiniPlayer: 'Close mini player',
  picture: 'Picture',
  pictureDefault: 'Default',
  pictureAdjusted: 'Adjusted',
  zoom: 'Zoom',
  mirror: 'Mirror view',
  brightness: 'Brightness',
  contrast: 'Contrast',
  saturation: 'Saturation',
  resetPicture: 'Reset picture',
  sleepTimer: 'Sleep timer',
  sleepMinutes: (m) => `${m} minutes`,
  endOfVideo: 'End of video',
  loop: 'Loop',
  loopVideo: 'Whole video',
  loopChapter: 'This chapter',
  loopCustom: (a, b) => `${a} – ${b}`,
  setLoopStart: (t) => `Set loop start at ${t}`,
  setLoopEnd: (t) => `Set loop end at ${t}`,
  snapshot: 'Snapshot',
  snapshotSaved: 'Snapshot saved',
  snapshotBlocked: "Snapshots aren't available for this video",
  download: 'Download',
  live: 'Live',
  goLive: 'Jump to live',
  behindLive: (t) => `${t} behind live`,
  roleDescription: 'video player',
}

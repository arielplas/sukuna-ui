import { VideoPlayer, VideoPlayerOverlay } from '@sukuna-ui/video'
import type { CSSProperties } from 'react'

const V = 'video/'

export function App() {
  return (
    <main>
      <h1>A page that isn't built with sukuna-ui</h1>
      <p>
        Global Georgia type, blue buttons with red borders, padded lists — the player ignores it.
      </p>
      <div style={{ maxWidth: 820 }}>
        <VideoPlayer
          title="Last Train, Shibuya"
          info="Night walk · Episode 1"
          poster={`${V}poster.jpg`}
          sources={[
            { src: `${V}night-360.webm`, type: 'video/webm', res: 360, default: true },
            { src: `${V}night-180.webm`, type: 'video/webm', res: 180 },
          ]}
          tracks={[
            {
              kind: 'captions',
              src: `${V}captions-en.vtt`,
              srclang: 'en',
              label: 'English',
              default: true,
            },
            { kind: 'subtitles', src: `${V}captions-es.vtt`, srclang: 'es', label: 'Español' },
            { kind: 'chapters', src: `${V}chapters.vtt` },
          ]}
          thumbnails={`${V}thumbs.vtt`}
        >
          {/* App content inside the player keeps the host's styles (the button stays blue). */}
          <VideoPlayerOverlay aria-label="Offer" showOn="pause" variant="card">
            Enjoying it? <button type="button">Subscribe</button>
          </VideoPlayerOverlay>
        </VideoPlayer>
      </div>
      {/* Re-theme through the --vp-* variables: this one is teal instead of crimson. */}
      <div
        style={
          {
            maxWidth: 520,
            marginTop: 24,
            '--vp-color-accent': '#14b8a6',
            '--vp-color-accent-deep': '#0f766e',
            '--vp-color-accent-glow': 'rgba(20, 184, 166, 0.55)',
            '--vp-gradient-accent': 'linear-gradient(135deg, #14b8a6, #0f766e)',
            '--vp-radius-lg': '4px',
          } as CSSProperties
        }
      >
        <VideoPlayer title="Re-themed" src={`${V}night-360.webm`} poster={`${V}poster.jpg`} />
      </div>
    </main>
  )
}

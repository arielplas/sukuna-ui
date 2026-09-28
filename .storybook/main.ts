import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../packages/*/src/**/*.mdx', '../packages/*/src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  typescript: { reactDocgen: 'react-docgen-typescript' },
  core: { disableTelemetry: true },
  // Media fixtures for VideoPlayer stories and browser tests (served at /video/*).
  staticDirs: ['./public'],
  // Stories exercise the same Tailwind utilities a consumer's build generates.
  viteFinal: async (cfg) => {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()]
    // `sukuna-ui` re-exports the VideoPlayer from its workspace package (Q27): resolve it to
    // source so `bun run storybook` works without a prior build and there's one player copy.
    const src = (rel: string) =>
      fileURLToPath(new URL(`../packages/video/src/${rel}`, import.meta.url))
    cfg.resolve ??= {}
    cfg.resolve.alias = [
      ...(Array.isArray(cfg.resolve.alias)
        ? cfg.resolve.alias
        : Object.entries(cfg.resolve.alias ?? {}).map(([find, replacement]) => ({
            find,
            replacement,
          }))),
      { find: /^@sukuna-ui\/video\/hls$/, replacement: src('hls.ts') },
      { find: /^@sukuna-ui\/video$/, replacement: src('index.ts') },
    ]
    return cfg
  },
}

export default config

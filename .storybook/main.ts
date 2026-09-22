import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  // Serve the brand kit's Storybook logo (see brand/storybook) for the manager theme's brandImage.
  staticDirs: [{ from: '../brand/storybook', to: '/brand' }],
  typescript: { reactDocgen: 'react-docgen-typescript' },
  core: { disableTelemetry: true },
  // Stories exercise the same Tailwind utilities a consumer's build generates.
  viteFinal: async (cfg) => {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()]
    return cfg
  },
}

export default config

import type { StorybookConfig } from '@storybook/react-vite'

// Tailwind (`@tailwindcss/vite` in viteFinal) and `theme.css` arrive in Phase 3;
// until then Storybook loads the raw tokens via src/styles/index.css in preview.tsx.
const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  typescript: { reactDocgen: 'react-docgen-typescript' },
  core: { disableTelemetry: true },
}

export default config

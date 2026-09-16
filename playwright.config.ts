import { defineConfig, devices } from '@playwright/test'

// Real-browser tests for the headless-backed components (focus traps, portals, positioning,
// typeahead) — the things happy-dom can't do. Runs under Node via @playwright/test rather than
// `bun test`, because Playwright's browser transport hangs under Bun (see docs/ai-decisions.md).
// Drives the built Storybook served by scripts/serve-storybook.ts.
export default defineConfig({
  testDir: './test/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:6007',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'bun run scripts/serve-storybook.ts',
    url: 'http://localhost:6007',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

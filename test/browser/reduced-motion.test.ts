import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`
const spinnerAnimation = (page: import('@playwright/test').Page) =>
  page
    .locator('.animate-spin')
    .first()
    .evaluate((el) => getComputedStyle(el).animationName)

test('honors prefers-reduced-motion: reduce (spinner stops)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(story('components-spinner--sizes'))
  // motion-reduce:animate-none must win, so the spin animation is disabled.
  expect(await spinnerAnimation(page)).toBe('none')
})

test('animates normally without the preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(story('components-spinner--sizes'))
  expect(await spinnerAnimation(page)).not.toBe('none')
})

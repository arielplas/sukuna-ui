import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('overflowing content scrolls and the thumb tracks it', async ({ page }) => {
  await page.goto(story('components-scrollarea--vertical'))

  const viewport = page.locator('[data-id$="-viewport"]')
  await expect(viewport).toBeVisible()
  // Exact match: "Line 1" would otherwise also match "Line 10", "Line 11", … (strict-mode error).
  await expect(page.getByText('Line 1', { exact: true })).toBeVisible()

  await expect.poll(() => viewport.evaluate((el) => el.scrollTop)).toBe(0)
  await viewport.evaluate((el) => {
    el.scrollTop = 200
  })
  await expect.poll(() => viewport.evaluate((el) => el.scrollTop)).toBeGreaterThan(0)

  // A vertical scrollbar thumb is present.
  await expect(page.locator('[data-orientation="vertical"]').first()).toBeVisible()
})

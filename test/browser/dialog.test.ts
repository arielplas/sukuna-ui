import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

const focusInsideDialog = () => document.activeElement?.closest('[role="dialog"]') != null

test('opens, moves focus inside, and closes on Escape', async ({ page }) => {
  await page.goto(story('components-dialog--default'))
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  // Focus moves into the dialog on open (Base UI traps it there while open).
  await expect.poll(() => page.evaluate(focusInsideDialog)).toBe(true)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('closes on outside (backdrop) click', async ({ page }) => {
  await page.goto(story('components-dialog--default'))
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  // Click the backdrop, away from the centered popup.
  await page.mouse.click(10, 10)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

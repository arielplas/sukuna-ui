import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('opens, traps focus, and closes on Escape', async ({ page }) => {
  await page.goto(story('components-dialog--default'))
  await page.getByRole('button', { name: 'Open dialog' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  // Focus is inside the dialog and stays there while tabbing.
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  const focusInside = await page.evaluate(
    () => document.activeElement?.closest('[role="dialog"]') !== null,
  )
  expect(focusInside).toBe(true)

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

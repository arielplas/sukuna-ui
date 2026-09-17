import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('opens from the side and closes on Escape', async ({ page }) => {
  await page.goto(story('components-drawer--right'))
  await page.getByRole('button', { name: /open right/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText('Filters')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

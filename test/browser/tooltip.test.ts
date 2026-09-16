import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`
const CONTENT = 'Saved to your library'

test('shows the content on hover and hides on Escape', async ({ page }) => {
  await page.goto(story('components-tooltip--default'))
  await page.getByRole('button', { name: /hover or focus/i }).hover()
  await expect(page.getByText(CONTENT)).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByText(CONTENT)).toHaveCount(0)
})

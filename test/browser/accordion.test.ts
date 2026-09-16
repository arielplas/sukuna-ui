import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('expands and collapses a section on click', async ({ page }) => {
  await page.goto(story('components-accordion--default'))
  const trigger = page.getByRole('button', { name: 'Shipping' })
  await expect(page.getByText(/Orders ship within/)).toHaveCount(0)

  await trigger.click()
  await expect(page.getByText(/Orders ship within/)).toBeVisible()

  await trigger.click()
  await expect(page.getByText(/Orders ship within/)).toHaveCount(0)
})

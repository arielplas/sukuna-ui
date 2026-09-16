import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('navigates tabs with the arrow keys (manual activation)', async ({ page }) => {
  await page.goto(story('components-tabs--default'))
  await page.getByRole('tab', { name: 'Account' }).focus()
  // Base UI tabs use manual activation: arrow moves focus, Enter/Space selects.
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('Update your billing details.')).toBeVisible()
})

import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('selects with the arrow keys', async ({ page }) => {
  await page.goto(story('components-radiogroup--with-default'))
  // Default selected is "bank"; focus it, arrow up to "card".
  await page.getByRole('radio', { name: 'Bank transfer' }).focus()
  await page.keyboard.press('ArrowUp')
  await expect(page.getByRole('radio', { name: 'Card' })).toBeChecked()
})

test('clicking the option label text selects it', async ({ page }) => {
  await page.goto(story('components-radiogroup--default'))
  // Click the text, not the circle — the whole row is the control.
  await page.getByText('Bank transfer', { exact: true }).click()
  await expect(page.getByRole('radio', { name: 'Bank transfer' })).toBeChecked()
})

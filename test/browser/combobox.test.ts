import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('filters and selects a suggestion', async ({ page }) => {
  await page.goto(story('components-combobox--default'))
  const input = page.getByRole('combobox', { name: 'Framework' })
  await input.fill('sv')
  await page.getByRole('option', { name: 'Svelte' }).click()
  await expect(input).toHaveValue('Svelte')
})

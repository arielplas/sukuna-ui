import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('opens, selects an item, and reflects it on the trigger', async ({ page }) => {
  await page.goto(story('components-select--default'))
  const trigger = page.getByRole('combobox', { name: 'Framework' })
  await expect(trigger).toContainText('Choose a framework')

  await trigger.click()
  await page.getByRole('option', { name: 'Svelte' }).click()

  await expect(trigger).toContainText('Svelte')
  await expect(page.getByRole('listbox')).toHaveCount(0)
})

test('selects with the keyboard', async ({ page }) => {
  await page.goto(story('components-select--default'))
  const trigger = page.getByRole('combobox', { name: 'Framework' })
  await trigger.click()
  await page.getByRole('option', { name: 'React' }).click()
  await expect(trigger).toContainText('React')
})

import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('click opens; Escape closes and returns focus to the trigger', async ({ page }) => {
  await page.goto(story('components-popover--default'))
  const trigger = page.getByRole('button', { name: 'Filters' })

  await trigger.click()
  await expect(page.getByRole('dialog', { name: 'Filter results' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('an outside click closes it', async ({ page }) => {
  await page.goto(story('components-popover--default'))
  await page.getByRole('button', { name: 'Filters' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.mouse.click(5, 5)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

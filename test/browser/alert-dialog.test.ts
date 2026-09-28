import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('an outside click does NOT close it; Escape does and focus returns', async ({ page }) => {
  await page.goto(story('components-alertdialog--default'))
  const trigger = page.getByRole('button', { name: 'Delete project' })
  await trigger.click()
  const dialog = page.getByRole('alertdialog', { name: 'Delete project?' })
  await expect(dialog).toBeVisible()

  await page.mouse.click(5, 5)
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('alertdialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('Cancel closes it', async ({ page }) => {
  await page.goto(story('components-alertdialog--default'))
  await page.getByRole('button', { name: 'Delete project' }).click()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByRole('alertdialog')).toHaveCount(0)
})

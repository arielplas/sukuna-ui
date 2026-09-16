import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('opens on trigger click and closes after selecting an item', async ({ page }) => {
  await page.goto(story('components-menu--default'))
  await page.getByRole('button', { name: 'Options' }).click()

  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeVisible()

  await page.getByRole('menuitem', { name: 'Duplicate' }).click()
  await expect(page.getByRole('menu')).toHaveCount(0)
})

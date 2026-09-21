import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('right-click opens the menu; choosing an item closes it', async ({ page }) => {
  await page.goto(story('components-contextmenu--default'))

  await page.getByText('Right-click me').click({ button: 'right' })

  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Rename' })).toBeVisible()

  await page.getByRole('menuitem', { name: 'Rename' }).click()
  await expect(page.getByRole('menu')).toHaveCount(0)
})

test('Escape closes the menu', async ({ page }) => {
  await page.goto(story('components-contextmenu--default'))
  await page.getByText('Right-click me').click({ button: 'right' })
  await expect(page.getByRole('menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
})

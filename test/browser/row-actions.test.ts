import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('opens from a table row; arrow + Enter picks an item; Escape returns focus', async ({
  page,
}) => {
  await page.goto(story('components-table--with-actions'))
  const trigger = page.getByRole('button', { name: 'Actions for Jordan' })

  await trigger.click()
  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Edit' }).locator('svg')).toBeVisible()

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(menu).toHaveCount(0)

  await trigger.click()
  await expect(page.getByRole('menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('the actions column hugs the right edge of the table', async ({ page }) => {
  await page.goto(story('components-table--with-actions'))
  const table = await page.getByRole('table').boundingBox()
  const trigger = await page.getByRole('button', { name: 'Actions for Ariel' }).boundingBox()
  if (!table || !trigger) throw new Error('missing boxes')
  // Right-aligned cell with px-3 padding: the button ends within ~16px of the table edge.
  expect(table.x + table.width - (trigger.x + trigger.width)).toBeLessThan(16)
})

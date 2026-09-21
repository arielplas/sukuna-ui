import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('opens on hover and closes on mouse-out', async ({ page }) => {
  await page.goto(story('components-hovercard--default'))

  const trigger = page.getByRole('link', { name: '@sukuna' })
  await expect(page.getByText('King of Curses', { exact: false })).toHaveCount(0)

  await trigger.hover()
  await expect(page.getByText('King of Curses', { exact: false })).toBeVisible()

  // Move the pointer well away; the card closes after the close delay.
  await page.mouse.move(0, 0)
  await expect(page.getByText('King of Curses', { exact: false })).toHaveCount(0)
})

test('opens on keyboard focus', async ({ page }) => {
  await page.goto(story('components-hovercard--default'))
  await page.getByRole('link', { name: '@sukuna' }).focus()
  await expect(page.getByText('King of Curses', { exact: false })).toBeVisible()
})

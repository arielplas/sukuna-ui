import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('clicking the label text toggles the box', async ({ page }) => {
  await page.goto(story('components-checkbox--with-label'))
  const box = page.getByRole('checkbox', { name: 'Email me product updates' })
  await expect(box).not.toBeChecked()
  const text = page.getByText('Email me product updates')
  await expect(text).toHaveCSS('cursor', 'pointer')
  await text.click()
  await expect(box).toBeChecked()
  await page.getByText('Email me product updates').click()
  await expect(box).not.toBeChecked()
})

test('Enter toggles the box like Space does', async ({ page }) => {
  await page.goto(story('components-checkbox--with-label'))
  const box = page.getByRole('checkbox', { name: 'Email me product updates' })
  await box.focus()
  await page.keyboard.press('Enter')
  await expect(box).toBeChecked()
  await page.keyboard.press('Space')
  await expect(box).not.toBeChecked()
  await page.keyboard.press('Enter')
  await expect(box).toBeChecked()
})

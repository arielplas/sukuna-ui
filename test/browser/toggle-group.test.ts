import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('click selects and arrow keys move roving selection', async ({ page }) => {
  await page.goto(story('components-togglegroup--segmented'))

  const left = page.getByRole('button', { name: 'Left' })
  const center = page.getByRole('button', { name: 'Center' })
  await expect(left).toHaveAttribute('aria-pressed', 'true')

  await center.click()
  await expect(center).toHaveAttribute('aria-pressed', 'true')
  await expect(left).toHaveAttribute('aria-pressed', 'false')

  // Roving focus: arrow to the next button and select with the keyboard.
  await center.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Right' })).toHaveAttribute('aria-pressed', 'true')
})

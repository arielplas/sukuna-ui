import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('changes value with the arrow keys', async ({ page }) => {
  await page.goto(story('components-slider--with-value'))
  const slider = page.getByRole('slider')
  await slider.focus()
  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuenow', '66')
})

import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('steppers and arrow keys change the value', async ({ page }) => {
  await page.goto(story('components-numberfield--with-min-max'))

  const input = page.getByRole('textbox', { name: 'Between 1 and 5' })
  await expect(input).toHaveValue('1')

  await page.getByRole('button', { name: 'Increase' }).click()
  await expect(input).toHaveValue('2')

  await input.focus()
  await page.keyboard.press('ArrowUp')
  await expect(input).toHaveValue('3')
  await page.keyboard.press('ArrowDown')
  await expect(input).toHaveValue('2')

  // Clamps at the lower bound; the decrement stepper disables there.
  await page.getByRole('button', { name: 'Decrease' }).click()
  await expect(input).toHaveValue('1')
  await expect(page.getByRole('button', { name: 'Decrease' })).toBeDisabled()
})

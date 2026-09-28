import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('Enter and Space toggle the panel and aria-expanded', async ({ page }) => {
  await page.goto(story('components-collapsible--default'))
  const trigger = page.getByRole('button', { name: 'Advanced options' })
  const content = page.getByText('Webhook retries', { exact: false })

  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(content).toBeVisible()

  await page.keyboard.press('Space')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(content).toHaveCount(0)
})

test('a disabled trigger is visibly dimmed', async ({ page }) => {
  await page.goto(story('components-collapsible--disabled'))
  const trigger = page.getByRole('button', { name: 'Locked section' })
  await expect(trigger).toHaveCSS('opacity', '0.45')
})

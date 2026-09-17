import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

test('shows a toast when triggered', async ({ page }) => {
  await page.goto(story('components-toast--with-description'))
  await page.getByRole('button', { name: 'Show toast' }).click()

  // Base UI renders the text twice (visible + an aria-live announcement copy).
  await expect(page.getByText('Saved').first()).toBeVisible()
  await expect(page.getByText('Your changes were saved to the cloud.').first()).toBeVisible()
})

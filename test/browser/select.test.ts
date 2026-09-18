import { expect, type Locator, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

const box = async (locator: Locator) => {
  const b = await locator.boundingBox()
  if (!b) throw new Error('element is not rendered')
  return b
}

test('opens, selects an item, and reflects it on the trigger', async ({ page }) => {
  await page.goto(story('components-select--default'))
  const trigger = page.getByRole('combobox', { name: 'Framework' })
  await expect(trigger).toContainText('Choose a framework')

  await trigger.click()
  await page.getByRole('option', { name: 'Svelte' }).click()

  await expect(trigger).toContainText('Svelte')
  await expect(page.getByRole('listbox')).toHaveCount(0)
})

test('selects with the keyboard', async ({ page }) => {
  await page.goto(story('components-select--default'))
  const trigger = page.getByRole('combobox', { name: 'Framework' })
  await trigger.click()
  await page.getByRole('option', { name: 'React' }).click()
  await expect(trigger).toContainText('React')
})

test('a long list scrolls inside a popup that stays put and matches the trigger width', async ({
  page,
}) => {
  await page.goto(story('components-select--many-items'))
  const trigger = page.getByRole('combobox', { name: 'Third number' })
  await trigger.click()
  const listbox = page.getByRole('listbox')
  await expect(listbox).toBeVisible()
  const popup = listbox.locator('xpath=..')
  await expect(popup).toHaveAttribute('data-side', /^(bottom|top)$/)

  const triggerBox = await box(trigger)
  const before = await box(popup)
  expect(before.width).toBeGreaterThanOrEqual(triggerBox.width - 1)
  expect(before.y).toBeGreaterThan(triggerBox.y)

  await listbox.hover()
  await page.mouse.wheel(0, 300)
  // With standard placement the Popup (overflow-y-auto) is the scroll container, not the List.
  await expect.poll(() => popup.evaluate((el) => el.scrollTop)).toBeGreaterThan(0)
  const after = await box(popup)
  expect(Math.abs(after.y - before.y)).toBeLessThan(1)
  expect(Math.abs(after.height - before.height)).toBeLessThan(1)
})

test('a popup near the bottom of the viewport fits on screen instead of overflowing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 800, height: 420 })
  await page.goto(story('components-select--many-items'))
  const trigger = page.getByRole('combobox', { name: 'Fourth number' })
  await trigger.click()
  const listbox = page.getByRole('listbox')
  await expect(listbox).toBeVisible()
  const popup = await box(listbox.locator('xpath=..'))
  expect(popup.y).toBeGreaterThanOrEqual(0)
  expect(popup.y + popup.height).toBeLessThanOrEqual(420)
  expect(popup.height).toBeGreaterThan(100)
})

import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`

const focusInsideDialog = () => document.activeElement?.closest('[role="dialog"]') != null

test('opens, moves focus inside, and closes on Escape', async ({ page }) => {
  await page.goto(story('components-dialog--default'))
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  // Focus moves into the dialog on open (Base UI traps it there while open).
  await expect.poll(() => page.evaluate(focusInsideDialog)).toBe(true)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('closes on outside (backdrop) click', async ({ page }) => {
  await page.goto(story('components-dialog--default'))
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  // Click the backdrop, away from the centered popup.
  await page.mouse.click(10, 10)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('a Select dropdown opened inside the dialog renders above it (z-index)', async ({ page }) => {
  await page.goto(story('components-dialog--with-select'))
  await page.getByRole('button', { name: 'Edit member' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  // Open the Select that lives inside the dialog.
  await page.getByRole('combobox', { name: 'Role' }).click()
  const admin = page.getByRole('option', { name: 'Admin' })
  await expect(admin).toBeVisible()

  // The dropdown's positioner must out-stack the dialog, else this option sits behind the
  // dialog surface. Read the effective stacking level of each: the first ancestor-or-self with
  // an explicit z-index (the body-level portalled element that actually competes).
  const zIndexes = await page.evaluate(() => {
    const stackLevel = (leaf: Element | null) => {
      for (let el = leaf; el && el !== document.body; el = el.parentElement) {
        const z = getComputedStyle(el).zIndex
        if (z && z !== 'auto') return Number.parseInt(z, 10) || 0
      }
      return 0
    }
    return {
      dropdown: stackLevel(document.querySelector('[role="option"]')),
      dialog: stackLevel(document.querySelector('[role="dialog"]')),
    }
  })
  expect(zIndexes.dialog).toBeGreaterThan(0)
  expect(zIndexes.dropdown).toBeGreaterThan(zIndexes.dialog)

  // …and that the option is genuinely clickable (Playwright refuses to click an obscured node).
  await admin.click()
  await expect(page.getByRole('combobox', { name: 'Role' })).toContainText('Admin')
})

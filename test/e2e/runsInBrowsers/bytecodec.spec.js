import { test, expect } from '@playwright/test'

test('urn-anbs browser suite', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => window.__URN_ANBS_RESULTS__)
  const results = await page.evaluate(() => window.__URN_ANBS_RESULTS__)
  expect(
    results.ok,
    results.errors ? JSON.stringify(results.errors, null, 2) : 'unknown error'
  ).toBe(true)
})

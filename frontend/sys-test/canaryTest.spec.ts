import { test, expect } from './fixtures';

test.describe('ST-1 Login', () => {
  test('1. Canary test', async ({ page }) => {
    await page.locator('center').getByRole('heading', { name: 'Planering' }).click();
  });
});
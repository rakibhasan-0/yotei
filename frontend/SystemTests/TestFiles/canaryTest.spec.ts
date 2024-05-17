import { test, expect } from '../fixtures'

/**
 * A canary test for testing the system test environment. Verifies that fixtures for login as an admin works.
 * Can be deleted later on when other tests are implemented. 
 *
 *  @author Team Mango (Group 4)
 *  @since 2024-05-17
 *  @version 2.0
 */
test.describe('Canary test', () => {
  test('1. Planering title should be visible if the fixtures work', async ({ page }) => {
    await expect(page.locator('center').getByRole('heading', { name: 'Planering' })).toBeVisible()
  });
}); 
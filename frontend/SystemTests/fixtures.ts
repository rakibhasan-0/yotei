import { test as base, expect } from '@playwright/test'
import { Account, Role } from './Types/systemTestsTypes'
import { UserApi } from './ApiUtils/UserApi'

/**
 * This file is a fixture for a page, read more about fixture here: https://playwright.dev/docs/test-fixtures
 * It creates and logs in to a new admin account for each worker, this needs to be done in another way if one in the 
 * future wants to test the system with different permissions. 
 * The newly created accounts are deleted after the tests.
 */
export const test = base.extend<{}, { account: Account }>({
  account: [async ({ browser }, use, workerInfo) => {
		const username = Math.random().toString(36).slice(2, 7) + workerInfo.workerIndex // Will generate a random string of 5 characters
    const password = 'verysecure'
    const role = Role.admin

    // Create the account with userApi.
		const response = await UserApi.register_user({username: username, password: password, role: role})
		const userId = response.userId

    // Use the account value.
    await use({ username, password, role, userId })
    // Teardown after test
    await UserApi.remove_user(userId)
  }, { scope: 'worker' }],

  page: async ({ page, account }, use) => {
    // Sign in with our account.
    await page.goto('/');
		await page.locator('input[type="user"]').fill(account.username)
		await page.locator('input[type="password"]').fill(account.password)
    await page.locator('#login-button').click()

    // Verify logged in
		await expect(page).toHaveURL(/\**\/plan/)

    // Use signed-in page in the test.
    await use(page)
  },
});
export { expect } from '@playwright/test';
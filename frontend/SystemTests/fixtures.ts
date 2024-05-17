import { test as base, expect } from '@playwright/test'
import { Account, Role } from './Types/systemTestsTypes'
import { UserApi } from './ApiUtils/UserApi'

// Note that we pass worker fixture types as a second template parameter.
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
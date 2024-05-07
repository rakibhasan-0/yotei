import { test as base, expect } from '@playwright/test';
import { Account, Role } from 'types/systemTestsTypes';
import { UserApi } from '@fixtures/UserApi';

// Note that we pass worker fixture types as a second template parameter.
export const test = base.extend<{}, { account: Account }>({
  account: [async ({ browser }, use, workerInfo) => {
    // Unique username.
    const username = 'account' + workerInfo.workerIndex;
    const password = 'verysecure';
    const role = Role.admin;

    // Create the account with userApi.
		const response = await UserApi.register_user({username: username, password: password, role: role})
		const userId = response.userId

    // Use the account value.
    await use({ username, password, role, userId });
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
	  await UserApi.remove_user(account.userId)

  },
});
export { expect } from '@playwright/test';
import { expect, test } from "@playwright/test"
import { UserApi } from "@fixtures/UserApi"

/**
 * Some basic system test for login and registry of a new user.
 *
 *  @author Team Durian (Group 3)
 *  @since 2024-05-2
 *  @version 1.0
 */

test.describe('ST-1 inloggning', () => {
	/**
	 * Testar att logga in med en ny användare.
	 */
	test('.1 korrekt inloggning lyckas', async ({ page }) => {
		let response
		try {
			// Setup. Registrera en ny användare
			response = await UserApi.register_user('kalle', 'anka', true)
			// 2. Fyll i användarnamn och lösenord
			await page.goto('/');
			await page.locator('input[type="user"]').fill('kalle');
   		await page.locator('input[type="password"]').fill('anka');

			// 3. Tryck logga in och säkerställ att vi kommer till /home
			await page.locator('#login-button').click();
			await page.waitForURL(/\**\/plan/);
		} finally {
			// Cleanup. Ta bort den nya användaren
			await UserApi.remove_user(response.userId);
		}
	});

	/**
	 * Testar att logga in med en ogiltig användare.
	 */
	test('.2 inkorrekt inloggning misslyckas', async ({ page }) => {
		// 1. Fyll i användarnamn och lösenord
		await page.goto('/');
		await page.locator('input[type="user"]').fill('anna');
   	await page.locator('input[type="password"]').fill('book');

		// 2. Tryck logga in och säkerställ att vi inte lyckas logga in
		await page.locator('#login-button').click();
		await expect(page.getByText('Felaktigt')).toBeVisible();
	});
});
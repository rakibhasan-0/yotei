import { expect, test } from "@playwright/test"
import { UserApi } from "@fixtures/UserApi"

test.describe('ST-1 inloggning', () => {
	/**
	 * Testar att logga in med en ny användare.
	 */
	test('.1 korrekt inloggning lyckas', async ({ page }) => {
		try {
			// Setup. Registrera en ny användare
			await UserApi.register_user('kalle', 'anka', true);

			// 2. Fyll i användarnamn och lösenord
			await page.goto('/');
			await page.getByPlaceholder('Användarnamn').fill('kalle');
			await page.getByPlaceholder('Lösenord').fill('anka');

			// 3. Tryck logga in och säkerställ att vi kommer till /home
			await page.getByRole('button', {name: 'Logga in'}).click();
			await page.waitForURL(/\**\/plan/);
		} finally {
			// Cleanup. Ta bort den nya användaren
			await UserApi.remove_user('kalle');
		}
	});

	/**
	 * Testar att logga in med en ogiltig användare.
	 */
	test('.2 inkorrekt inloggning misslyckas', async ({ page }) => {
		// 1. Fyll i användarnamn och lösenord
		await page.goto('/');
		await page.getByPlaceholder('Användarnamn').fill('anna');
		await page.getByPlaceholder('Lösenord').fill('book');

		// 2. Tryck logga in och säkerställ att vi inte lyckas logga in
		await page.getByRole('button', {name: 'Logga in'}).click();
		await expect(page.getByText('Felaktigt')).toBeVisible();
	});

	/**
	 * Testar att registrera och ta bort en ny användare via admin.
	 */
	/*
	test('.3 Ta bort registrerad användare', async ({ page }) => {
		try {
			await page.goto('/');
			await page.getByPlaceholder('Användarnamn').fill('admin');
			await page.getByPlaceholder('Lösenord').fill('admin');

			await page.getByRole('button', {name: 'Logga in'}).click();
			await page.waitForURL(/\**\/plan/);
			await page.getByRole('button', { name: 'menu icon' }).click();
			await page.getByRole('link', { name: 'Admin', exact: true }).click();
			await page.waitForURL(/\**\/admin/);
			

			await page.locator('input[type="user"]').fill('kalle');
			await page.locator('#register-user-password-input').fill('anka');
			await page.getByRole('button', { name: 'Lägg till användare' }).click();
			await page.locator('#confirm-user-input').fill('anka');
			await page.getByRole('button', { name: 'Bekräfta' }).click();

			await page.locator('#choose-user-select svg').click();
			await page.getByText('kalle', { exact: true }).click();
			await page.getByRole('button', { name: 'Ta bort användare' }).click();
			await page.locator('#confirm-user-input').click();
			await page.locator('#confirm-user-input').fill('kalle');
			await page.getByRole('button', { name: 'Bekräfta' }).click();

			// Logga ut
			await page.goto('/admin')
			await page.getByRole('link', { name: 'admin' }).click();
			await page.waitForURL(/\**\/profile/);
			await page.getByRole('button', { name: 'Logga ut'}).click();
			await page.waitForURL(/\**\//);


			// Försök logga in på borttagen användare
			await page.getByPlaceholder('Användarnamn').fill('kalle');
			await page.getByPlaceholder('Lösenord').fill('anka');
			await page.getByRole('button', { name: 'Logga in'}).click();

			await expect(page.getByText('Felaktigt användarnamn eller lösenord.')).toBeVisible();
		} finally {
			await UserApi.remove_user('kalle');
		}
	});
	*/
});
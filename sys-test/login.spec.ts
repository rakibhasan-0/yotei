import { expect, test } from '@playwright/test';
import { UserApi } from './fixtures/UserApi';

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
  test('.3 Ta bort registrerad användare', async ({ page }) => {
    try {
      // Registrera en ny användare
      await UserApi.register_user('kalle', 'anka', true);

      // Logga in som ny användare och säkerställ att vi kommer till /home
      await page.goto('/');
      await page.getByPlaceholder('Användarnamn').fill('kalle');
      await page.getByPlaceholder('Lösenord').fill('anka');
      await page.getByRole('button', {name: 'Logga in'}).click();
      await page.waitForURL(/\**\/plan/);

      // Logga ut
      await page.goto('/profile')
      await page.getByRole('button', { name: 'Logga ut'}).click

      // Gå till admin sida och ta bort tillagd användare
      await page.goto('/admin')
      await page.locator('#choose-user-select svg').click();
      await page.getByText('kalle', { exact: true }).click();
      await page.getByRole('button', { name: 'Ta bort användare' }).click();
      await page.locator('#confirm-user-input').click();
      await page.locator('#confirm-user-input').fill('kalle');
      await page.getByRole('button', { name: 'Bekräfta' }).click();

      // Logga ut
      await page.goto('/profile')
      await page.getByRole('button', { name: 'Logga ut'}).click

      // Försök logga in på borttagen användare
      await page.getByPlaceholder('Användarnamn').fill('kalle');
      await page.getByPlaceholder('Lösenord').fill('anka');
      await page.getByRole('button', { name: 'Logga in'}).click

      await expect(page.getByText('Felaktigt användarnamn eller lösenord.')).toBeVisible();
    } finally {
      await UserApi.remove_user('kalle');
    }
  });
});

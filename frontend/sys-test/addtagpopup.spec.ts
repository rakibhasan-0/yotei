import { expect } from "@playwright/test"
import { test } from "@fixtures/login_page"



test.describe("AddTagPopup tests", () => {
	test.beforeEach(async ({ loginPage }) => {
		await loginPage.login_admin()
    	await loginPage.page.goto("/technique/138/edit")
	})

	test('.1 Lägg till en tagg', async ({ page }) => {
		await page.getByRole('button', { name: 'Hantera tagg' }).click();
		await page.getByPlaceholder('Sök eller skapa tagg').click();
		await page.getByPlaceholder('Sök eller skapa tagg').fill('testtagg');
		await page.locator('#tag-add-button').click();
		await page.locator('#checkbox-element').getByRole('img').click();
		await page.getByPlaceholder('Sök eller skapa tagg').dblclick();
		await page.getByPlaceholder('Sök eller skapa tagg').fill('kan ej ta bort');
		await page.locator('#tag-add-button').click();
		await page.locator('#save-and-close-button').click();
		await page.getByRole('button', { name: 'Spara' }).click();
		await page.goto('technique/138');
		await expect(page.getByText("kan ej ta bort")).toHaveCount(1);
		await expect(page.getByText("testtagg")).toHaveCount(0);
	})

	test('.2 Redigera tagg', async({ page }) => {
		await page.getByRole('button', { name: 'Hantera tagg' }).click();
		await page.getByPlaceholder('Sök eller skapa tagg').click();
		await page.getByPlaceholder('Sök eller skapa tagg').fill('testtagg');
		await page.locator('#pencil-icon').click();
		await page.locator('#edit-element').fill('test');
		await page.locator('#accept-icon').click();
		await page.getByTestId('EditableListItem-link').getByLabel('').check();
		await page.locator('#save-and-close-button').click();
		await expect(page.getByText("test")).toHaveCount(1);
	})

	test('.3 Kan inte ta bort tagg som används', async({ page }) => {
		await page.getByRole('button', { name: 'Hantera tagg' }).click();
		await page.getByPlaceholder('Sök eller skapa tagg').click();
		await page.getByPlaceholder('Sök eller skapa tagg').fill('kan ej ta bort');
		await page.locator('#close-icon').click();
		await expect(page.getByText("Taggen kan inte tas bort")).toHaveCount(1);
	})

	test('.4 Ta bort taggar', async({ page }) => {
		await page.getByRole('button', { name: 'Hantera tagg' }).click();
		await page.getByPlaceholder('Sök eller skapa tagg').click();
		await page.getByPlaceholder('Sök eller skapa tagg').fill('test');
		await page.locator('#close-icon').click();
		await page.getByRole('button', { name: 'Ta bort', exact: true }).click();
		await page.getByPlaceholder('Sök eller skapa tagg').click();
		await page.getByPlaceholder('Sök eller skapa tagg').fill('kan ej ta bort');
		await page.locator('#checkbox-element').getByRole('img').click();
		await page.locator('#save-and-close-button').click();
		await page.getByRole('button', { name: 'Spara' }).click();
		await page.goto('technique/138');
		await page.getByRole('link').click();
		await page.getByRole('button', { name: 'Hantera tagg' }).click();
		await page.getByPlaceholder('Sök eller skapa tagg').click();
		await page.getByPlaceholder('Sök eller skapa tagg').fill('kan ej ta bort');
		await page.locator('#close-icon').click();
		await page.getByRole('button', { name: 'Ta bort' }).click();
		await page.locator('#save-and-close-button').click();
		await page.getByRole('button', { name: 'Spara' }).click();
		await page.goto('technique/138');
		await expect(page.getByText("test")).toHaveCount(0);
		await expect(page.getByText("kan ej ta bort")).toHaveCount(0);
	})

	
})

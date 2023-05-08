import { expect } from "@playwright/test"
import { test } from "@fixtures/login_page"
/*
test.describe("ST-4 övningar-sida", () => {

	test.beforeEach(async ({ loginPage, page }) => {
		// Start. Logga in som admin
		await loginPage.login_admin();
		await page.goto("/exercise"); 
		//Klicka på lägg till ny övning
		await page.locator('div:nth-child(3) > .btn').click();
	});

	test('.1 Fylla i formulär för övning och rensa det',async ({ page }) => {
		const övningsNamn = "Övning som är rolig";
		const övningsBeskrivning = "Rolig övning"

		//Lägg till ny övning
		await page.getByPlaceholder("Namn").fill(övningsNamn);
		await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivning);

		//Rensa formuläret
		await page.getByRole('button', {name: "Rensa allt"}).click();
		await page.getByRole('dialog').getByText('Rensa allt').nth(2).click();

		//Kontrollera att det inte finns något kvar i formuläret
		await expect(page.getByText(övningsNamn)).not.toBeVisible();
		await expect(page.getByText(övningsBeskrivning)).not.toBeVisible();
	});

	test('.2 Lägga till och ta bort en övning',async ({ page }) => {
		const övningsNamn = "Kan tas bort och är rolig";
		const övningsBeskrivning = "Rolig övning"

		//Lägg till ny övning
		await page.getByPlaceholder("Namn").fill(övningsNamn);
		await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivning);

		await page.getByRole('button', {name: "Lägg till"}).click();

		//Kontrollera övningen finns tillagd
		await expect(page.getByText(övningsNamn)).toBeVisible();

		//Ta bort övningen
		await page.getByRole('link', {name: övningsNamn}).click();
		await page.getByRole('img', {name: "trashcan icon"}).click();
		await page.getByText('Ta bort övning').nth(2).click();

		//Kolla så att de är bortagna
		await expect(page.getByText(övningsNamn)).not.toBeVisible();
	});

	test('.3 Lägga till, redigera och ta bort en övning',async ({ page }) => {
		const övningsNamn = "Redigerbar övning";
		const övningsBeskrivning = "Rolig övning"

		//Lägg till ny övning
		await page.getByPlaceholder("Namn").fill(övningsNamn);
		await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivning);

		await page.getByRole('button', {name: "Lägg till"}).click();

		//Kontrollera övningen finns tillagd
		await expect(page.getByText(övningsNamn)).toBeVisible();

		await page.getByRole('link', {name: övningsNamn}).click();
		await page.getByRole('img', {name: "edit icon"}).click();

		const övningsNamnNy = "Nytt namn på övning"; 
		const övningsBeskrivningNy = "Ännu roligare övning"

		//Uppdatera information om övning
		//Lägg till ny övning
		await page.getByPlaceholder("Namn").fill(övningsNamnNy);
		await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivningNy);

		//Spara redigeringar
		await page.getByRole('button', {name: "Spara"}).click();

		//Gå till översikts sida
		await page.getByRole('button', {name: "Tillbaka"}).click();
		await page.getByText('Lämna sida').nth(2).click();

		await expect(page.getByText(övningsNamnNy)).toBeVisible();
		await expect(page.getByText(övningsBeskrivningNy)).toBeVisible();

		//Ta bort övningen
		await page.getByRole('img', {name: "trashcan icon"}).click();
		await page.getByText('Ta bort övning').nth(2).click();

		//Kolla så att de är bortagna
		await expect(page.getByText(övningsNamnNy)).not.toBeVisible();
	});
})
*/
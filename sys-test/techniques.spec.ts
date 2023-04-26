import { expect } from "@playwright/test"
import { test } from "./fixtures/login_page"

test.describe("ST-3 teknik-sida", () => {

	test.beforeEach(async ({ loginPage }) => {
		// Start. Logga in och ta bort all gamla workouts (trasigt för stunden).
		await loginPage.login_admin()
		// await WorkoutApi.delete_all_workouts();
	})

	test(".1 Fylla i formulär och rensa det",async ({ page }) => {

		//Gå till sidan för tekniker.
		await page.getByRole("link", {name: "Tekniker"}).click()
		await (page).waitForURL(/\**\/technique/)
    
		//Klicka på lägg till ny teknik
		await page.getByRole("link", {name: "+"}).click()

		const teknikNamn = "Teknik1"
		const teknikBeskrivning = "Rolig teknik"

		//Lägg till ny tekink
		await page.getByPlaceholder("Namn").fill(teknikNamn)
		await page.getByPlaceholder("Beskrivning").fill(teknikBeskrivning)

		//Rensa formuläret
		await page.getByRole("button", {name: "Rensa allt"}).click()
		await page.getByRole("dialog").getByRole("button", {name: "Rensa allt"}).click()

		//Kontrollera att det inte finns något kvar i formuläret
		await expect(page.getByText(teknikNamn)).not.toBeVisible()
		await expect(page.getByText(teknikBeskrivning)).not.toBeVisible()
	})

  
	test(".2 Lägga till och ta bort en teknik",async ({ page }) => {

		//Gå till sidan för tekniker.
		await page.getByRole("link", {name: "Tekniker"}).click()
		await (page).waitForURL(/\**\/technique/)
    
		//Klicka på lägg till ny teknik
		await page.getByRole("link", {name: "+"}).click()

		const teknikNamn = "Teknik1"
		const teknikBeskrivning = "Rolig teknik"

		//Lägg till ny tekink
		await page.getByPlaceholder("Namn").fill(teknikNamn)
		await page.getByPlaceholder("Beskrivning").fill(teknikBeskrivning)

		await page.getByRole("button", {name: "Lägg till"}).click()

		//Kontrollera tekniken finns tillagd
		await expect(page.getByText(teknikNamn)).toBeVisible()

		//Ta bort tekniken
		await page.getByRole("link", {name: teknikNamn}).click()
		await page.getByRole("img", {name: "trashcan icon"}).click()
		await page.getByRole("button", {name: "Ta bort teknik"}).click()

		//Kolla så att de är bortagna
		await expect(page.getByText(teknikNamn)).not.toBeVisible()
	})

    
	test(".3 Lägga till, redigera och ta bort en teknik",async ({ page }) => {

		//Gå till sidan för tekniker.
		await page.getByRole("link", {name: "Tekniker"}).click()
		await (page).waitForURL(/\**\/technique/)
    
		//Klicka på lägg till ny teknik
		await page.getByRole("link", {name: "+"}).click()

		const teknikNamn = "Teknik1"
		const teknikBeskrivning = "Rolig teknik"

		//Lägg till ny tekink
		await page.getByPlaceholder("Namn").fill(teknikNamn)
		await page.getByPlaceholder("Beskrivning").fill(teknikBeskrivning)

		await page.getByRole("button", {name: "Lägg till"}).click()

		//Kontrollera tekniken finns tillagd
		await expect(page.getByText(teknikNamn)).toBeVisible()

		await page.getByRole("link", {name: teknikNamn}).click()
		await page.getByRole("img", {name: "edit icon"}).click()

		const teknikNamnNy = "Teknik2"
		const teknikBeskrivningNy = "Ännu roligare teknik"

		//Uppdatera information om teknik
		//Lägg till ny tekink
		await page.getByPlaceholder("Namn").fill(teknikNamnNy)
		await page.getByPlaceholder("Beskrivning").fill(teknikBeskrivningNy)

		//Spara redigeringar
		await page.getByRole("button", {name: "Spara"}).click()

		//Gå till översikts sida
		await page.getByRole("button", {name: "Tillbaka"}).click()
		await page.getByRole("button", {name: "Lämna sida"}).click()

		await expect(page.getByText(teknikNamnNy)).toBeVisible()
		await expect(page.getByText(teknikBeskrivningNy)).toBeVisible()

		//Ta bort tekniken
		await page.getByRole("img", {name: "trashcan icon"}).click()
		await page.getByRole("button", {name: "Ta bort teknik"}).click()

		//Kolla så att de är bortagna
		await expect(page.getByText(teknikNamnNy)).not.toBeVisible()
	})

})

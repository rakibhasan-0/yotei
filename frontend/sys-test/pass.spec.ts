import { expect } from "@playwright/test"
import { test } from "@fixtures/login_page"
import { WorkoutApi } from "@fixtures/WorkoutApi"

/*
test.describe("ST-2 pass-sida", () => {

	test.beforeEach(async ({ loginPage }) => {
		// Start. Logga in och ta bort all gamla workouts (trasigt för stunden).
		await loginPage.login_admin()
		await WorkoutApi.delete_all_workouts()
	})

	test(".5 favoritmarkera skapat pass och se att det syns på \"mina pass\"", async ({ page }) => {
		// 1. Lägger in en workout via workout-api
		const pass_title = "Favoritpass";
		const pass_description = "Ett väldigt bra pass"
		const pass_id = await WorkoutApi.add_workout({
			name: pass_title,
			desc: "",
			duration: 10,
			hidden: false,
		})

		await page.goto('/workout/create');
		// Skapa pass och favoritmarkera det.
		await page.getByPlaceholder("Namn").fill(pass_title)
		await page.getByPlaceholder("Beskrivning av pass").fill(pass_description)
		await page.getByRole("button", { name: "Spara" }).click()
		await page.getByRole('button', { name: '' }).click()

		await page.goto("/profile")
		await page.getByRole('listitem').filter({ hasText: 'Favoritpass' }).click()
		await expect(page.getByRole('link', { name: pass_title })).toBeVisible()

		// Cleanup. Ta bort passet
		await WorkoutApi.delete_workout(pass_id)
	})

	test(".4 borttagning av skapade pass via gränssnitt",async ({ page }) => {
		// 1. Lägger in en workout via workout-api
		const pass_title = "Skapat pass";
		const pass_id = await WorkoutApi.add_workout({
			name: pass_title,
			desc: "",
			duration: 10,
			hidden: false,
		})

		await page.goto("/workout/" + pass_id)
		await expect(page.getByRole("heading", { name: pass_title })).toBeVisible()

		await page.locator("#dropdown-split-basic").click()
		await page.getByRole("button", { name: "trashcan icon" }).click()
		await page.getByText('Ta bort pass').nth(2).click()

		await expect(page.getByRole("heading", { name: pass_title })).toBeHidden()
	})

  
	
   * Testar att skapade pass är synliga under mina pass. 
   
	test(".3 skapat pass är synligt under mina pass", async ({ page }) => {
		// 1. Lägger in en workout via workout-api
		const pass_title = "Synligt under mina pass";
		const pass_id = await WorkoutApi.add_workout({
			name: pass_title,
			desc: "",
			duration: 10,
			hidden: false,
		})

		// 2. Gå till profile och "mina pass", säkerställ att namnet på passet syns.
		await page.goto("/profile")
		await page.getByText("Mina pass").click()
		await expect(page.getByRole("link", { name: pass_title })).toBeVisible()

		// Cleanup. Ta bort passet
		await WorkoutApi.delete_workout(pass_id)
	})

	
   * Testar att pass är synliga.
   
	test(".2 skapat pass är synligt", async ({ page }) => {
		// 1. Lägger in en workout via workout-api
		const pass_title = "Synligt";
		const pass_id = await WorkoutApi.add_workout({
			name: pass_title,
			desc: "",
			duration: 10,
			hidden: false,
		})

		// 2. Gå till workout och säkerställ att namnet syns.
		await page.goto("/workout")
		await expect(page.getByRole("heading", { name: pass_title })).toBeVisible()

		// Cleanup. Ta bort passet
		await WorkoutApi.delete_workout(pass_id)
	})

	
   * testar att skapa ett nytt pass via gränssnittet.
   
	test(".1 skapa pass med gränssnitt", async ({ page }) => {
		// 1. Gå till workout och tryck för att lägga till nytt pass
		await page.goto("/workout")
		await page.locator('div:nth-child(6)').click()

		// 2. Fyll i namn och beskrivning
		const t1 = "Synligt pass"
		const t2 = "En lång beskrivning av ett pass"
		await page.getByPlaceholder("Namn").fill(t1)
		await page.getByPlaceholder("Beskrivning av pass").fill(t2)

		// 3. Tryck spara
		await page.getByRole("button", { name: "Spara" }).click()

		// 4. Vi är nu på det nya passets sida.
		//    Säkerställ att namn och beskrivning syns.
		await expect(page.getByRole("heading", { name: t1 })).toBeVisible()
		await expect(page.getByText(t2)).toBeVisible()

		// 5. Gå tillbaka till alla pass-vyn
		await page.goto("/workout")

		// 6. Säkerställ att det skapade passet syns och att det enbart finns ett.
		//let pass_locator = page.getByRole('link', { name: t1 });
		const workoutName = page.locator("#root .activity-list .workout-name a").nth(0)
		await expect(workoutName).toBeVisible()

		// Cleanup. Ta bort det nya passet
		const url = await workoutName.getAttribute("href")
		expect(url).toBeTruthy()
		const id = Number.parseInt((url || "").split("/").pop() || "")
		await WorkoutApi.delete_workout(id)
	})
})
*/
import { expect } from "@playwright/test"
import { test } from "./fixtures/login_page"
const throws = ['Flamingo Hurl', 'Penguin Plunge', 'Butterfly Bomb', 'Turtle Tumble', 'Kangaroo Kick', 'Giraffe Grasp', 'Llama Launch', 'Hippo Heave', 'Squirrel Sling', 'Crab Claw'];
const chokes = ['Giraffe Gag', 'Kangaroo Chokehold', 'Sloth Strangle', 'Walrus Wham', 'Anteater Attack', 'Elephant Embrace', 'Horse Halt', 'Mongoose Maul', 'Octopus Ooze', 'Zebra Zigzag'];
const locks = ['Penguin Pinch', 'Turtle Twist', 'Hippo Halt', 'Crab Clamp', 'Llama Lock', 'Giraffe Grip', 'Elephant Ender', 'Kangaroo Knead', 'Squirrel Squeeze', 'Anteater Anchor'];

function generateJudoTechnique(): string {
  const category = Math.floor(Math.random() * 3);
  if (category === 0) {
    return throws[Math.floor(Math.random() * throws.length)];
  } else if (category === 1) {
    return chokes[Math.floor(Math.random() * chokes.length)];
  } else {
    return locks[Math.floor(Math.random() * locks.length)];
  }
}
test.describe("ST-3 teknik-sida", () => {

	test.beforeEach(async ({page, loginPage }) => {
		// Start. Logga in och ta bort all gamla workouts (trasigt för stunden).
		await loginPage.login_admin()
		await page.getByRole('button', { name: 'menu icon' }).click()
		// await WorkoutApi.delete_all_workouts();
	})

	test(".1 Fylla i formulär och rensa det",async ({ page }) => {
		//Gå till sidan för tekniker.
		await page.getByRole("link", {name: "Tekniker"}).click()
		await (page).waitForURL(/\**\/technique/)
    
		//Klicka på lägg till ny teknik
		await page.locator('div:nth-child(5)').click()

		const teknikNamn = generateJudoTechnique(); 
		const teknikBeskrivning = "Rolig teknik"

		//Lägg till ny tekink
		await page.getByPlaceholder("Namn").fill(teknikNamn)
		await page.getByPlaceholder("Beskrivning").fill(teknikBeskrivning)

		//Rensa formuläret
		await page.getByRole("button", {name: "Rensa allt"}).click()
		await page.getByText('Rensa allt').nth(3).click()

		//Kontrollera att det inte finns något kvar i formuläret
		await expect(page.getByText(teknikNamn)).not.toBeVisible()
		await expect(page.getByText(teknikBeskrivning)).not.toBeVisible()
	})

  
	test(".2 Lägga till och ta bort en teknik",async ({ page }) => {
		//Gå till sidan för tekniker.
		await page.getByRole("link", {name: "Tekniker"}).click()
		await (page).waitForURL(/\**\/technique/)
    
		//Klicka på lägg till ny teknik
		await page.locator('div:nth-child(5)').click()

		const teknikNamn = generateJudoTechnique(); 
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
		await page.getByText('Ta bort teknik').nth(2).click()

		//Kolla så att de är bortagna
		await expect(page.getByText(teknikNamn)).not.toBeVisible()
	})

    
	test(".3 Lägga till, redigera och ta bort en teknik",async ({ page }) => {
		//Gå till sidan för tekniker.
		await page.getByRole("link", {name: "Tekniker"}).click()
		await (page).waitForURL(/\**\/technique/)
    
		//Klicka på lägg till ny teknik
		await page.locator('div:nth-child(3) > .btn').click()

		const teknikNamn = generateJudoTechnique(); 
		const teknikBeskrivning = "Rolig teknik"

		//Lägg till ny tekink
		await page.getByPlaceholder("Namn").fill(teknikNamn)
		await page.getByPlaceholder("Beskrivning").fill(teknikBeskrivning)

		await page.getByRole("button", {name: "Lägg till"}).click()

		//Kontrollera tekniken finns tillagd
		await expect(page.getByText(teknikNamn)).toBeVisible()

		await page.getByRole("link", {name: teknikNamn}).click()
		await page.getByRole("img", {name: "edit icon"}).click()

		const teknikNamnNy = generateJudoTechnique(); 
		const teknikBeskrivningNy = "Ännu roligare teknik"

		//Uppdatera information om teknik
		//Lägg till ny tekink
		await page.getByPlaceholder("Namn").fill(teknikNamnNy)
		await page.getByPlaceholder("Beskrivning").fill(teknikBeskrivningNy)

		//Spara redigeringar
		await page.getByRole("button", {name: "Spara"}).click()

		//Gå till översikts sida
		await page.getByRole("button", {name: "Tillbaka"}).click()
		await page.getByText('Lämna sida').nth(2).click()

		//Ta bort tekniken
		await page.getByRole("img", {name: "trashcan icon"}).click()
		await page.getByText('Ta bort teknik').nth(2).click()

		//Kolla så att de är bortagna
		await expect(page.getByText(teknikNamnNy)).not.toBeVisible()
	})
})

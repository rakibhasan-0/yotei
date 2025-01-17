import { test, expect } from "../fixtures"
import { WorkoutPage } from "../PageObjectModels/workoutPage"


/**
 *  
 *  Test file for the workout page.
 * 
 *  @author Team Coconut (Group 7)
 *  @since 2024-05-15
 *  @version 1.0
 */
test.describe("Workout", () => {
	let workoutPage

	test.beforeEach("navigate to workout page", async ({page}) => {
		workoutPage = new WorkoutPage(page)
		await workoutPage.visit()
		await expect(page.getByPlaceholder("Sök efter pass")).toBeVisible()
	})

	test("Workout is created and then deleted, should display success toast", async ({ page }) => {

		// Will generate a random string of 5 characters
		const name = Math.random().toString(36).slice(2, 7) 
            
		// workout object for test
		const workout = {
			description: "description description description", 
			name: name, 
			techniques: [
				{ name: "Tsuri ashi" },
				{ name: "Ayumi ashi" },
				{ name: "Taisabaki kort" },
			],
			exercises: [
				{ name: "Armhävningar" },
				{ name: "Armhävningar med bred handposition" },
				{ name: "Armhävningar med handklapp" },
			],
		}

		// Creates a new workout with a randomized name, a sample description,
		// and adds 6 different activities, 3 exercises and 3 techniques.
		await workoutPage.createWorkout(workout)

		// Asserts the existence of the confirmation message and that the workout was created correctly.
		await expect(page.getByRole("alert")).toContainText("Träningspasset skapades!")
		await expect(page.locator("#root")).toContainText("description description description")
		for(const technique of workout.techniques) {
			await expect(page.locator("#WorkoutActivityList-1")).toContainText(`${technique.name}`)
		}
		for(const exercise of workout.exercises) {
			await expect(page.locator("#WorkoutActivityList-1")).toContainText(`${exercise.name}`)
		}

		// Waits for the next page to load
		await page.waitForSelector("h1")

		// Deletes the created workout
		await workoutPage.deleteWorkout(name)

		// Asserts that the workout was deleted
		await expect(page.getByRole("link", { name: `${name}`})).toBeHidden()
	})

	test("Workout is created, then edited, then deleted", async ({ page }) => {

		// Generates a random string of five characters
		const name = Math.random().toString(36).slice(2, 7) // Will generate a random string of 5 characters

		// workout object for test
		const workout = {
			description: "description description description", 
			name: name, 
			techniques: [
				{ name: "Tsuri ashi" },
				{ name: "Ayumi ashi" },
				{ name: "Taisabaki kort" },
			],
			exercises: [
				{ name: "Armhävningar" },
				{ name: "Armhävningar med bred handposition" },
				{ name: "Armhävningar med handklapp" },
			],
		}

		// Creates a new workout with a randomized name, a sample description,
		// and adds 6 different activities, 3 exercises and 3 techniques.
		await workoutPage.createWorkout(workout)

		// Asserts the existence of the confirmation message and that the workout was created correctly.
		await expect(page.getByRole("alert")).toContainText("Träningspasset skapades!")
		await expect(page.locator("#root")).toContainText("description description description")
		for(const technique of workout.techniques) {
			await expect(page.locator("#WorkoutActivityList-1")).toContainText(`${technique.name}`)
		}
		for(const exercise of workout.exercises) {
			await expect(page.locator("#WorkoutActivityList-1")).toContainText(`${exercise.name}`)
		}
        
		await page.waitForSelector("h1")

		// Edits the page
		await workoutPage.editWorkout([
			{
				name: "Taisabaki lång",
				time: 10,
			}
		])

		// Asserts that the workout was updated successfully
		await expect(page.getByText("Träningen uppdaterades!")).toBeVisible()
		await page.waitForSelector("h1")

		// Deletes the created workout and asserts that it was deleted
		await workoutPage.deleteWorkout(name)
		await expect(page.getByRole("link", { name: `${name}`})).toBeHidden()
	})
})
import { test, expect } from '../fixtures'
import { WorkoutPage } from '../PageObjectModels/workoutPage'

test.describe('Workout', () => {
	let workoutPage

	test.beforeEach('navigate to workout page', async ({page}) => {
		workoutPage = new WorkoutPage(page)
		await workoutPage.visit()
		await expect(page.getByPlaceholder('Sök efter pass')).toBeVisible()
	})

    test('Workout is created and then deleted', async ({ page }) => {

        // Will generate a random string of 5 characters
		const name = Math.random().toString(36).slice(2, 7) 
		
        // Creates a new workout with a randomized name, a sample description,
        // and adds 6 different activities, 3 exercises and 3 techniques.
        await workoutPage.createWorkout(
            {
                description: 'description description description', 
                name: name, 
                techniques: [
                    { name: "Kamae, neutral (5 Kyu)" },
                    { name: "Kamae, beredd (5 Kyu)" },
                    { name: "Kamae, gard (5 Kyu)" },
                ],
                exercises: [
                    { name: "Armhävningar" },
                    { name: "Armhävningar med bred handposition" },
                    { name: "Armhävningar med handklapp" },
                ],
            }
        )

        // Asserts the existence of the confirmation message
		await expect(page.getByText(`Träningspasset skapades!`)).toBeVisible()

        // Waits for the next page to load
    	await page.waitForSelector('h1')

        // Deletes the created workout
		await workoutPage.deleteWorkout(name)

        // Asserts that the workout was deleted
    	await page.getByRole('link', { name: `${name}`}).isHidden()
    })

    test('Workout is created, then edited, then deleted', async ({ page }) => {

        // Generates a random string of five characters
        const name = Math.random().toString(36).slice(2, 7) // Will generate a random string of 5 characters

        // Creates a new workout with a randomized name, a sample description,
        // and adds 6 different activities, 3 exercises and 3 techniques.
        await workoutPage.createWorkout(
            {
                description: 'description description description', 
                name: name, 
                techniques: [
                    { name: "Kamae, neutral (5 Kyu)" },
                    { name: "Kamae, beredd (5 Kyu)" },
                    { name: "Kamae, gard (5 Kyu)" },
                ],
                exercises: [
                    { name: "Armhävningar" },
                    { name: "Armhävningar med bred handposition" },
                    { name: "Armhävningar med handklapp" },
                ],
            }
        )

        // Asserts the existence of the confirmation message
		await expect(page.getByText(`Träningspasset skapades!`)).toBeVisible()
    	await page.waitForSelector('h1')

        // Edits the page
        await workoutPage.editWorkout()

        // Asserts that the workout was updated successfully
        await expect(page.getByText('Träningen uppdaterades!')).toBeVisible()
        await page.waitForSelector('h1')

        // Deletes the created workout and asserts that it was deleted
		await workoutPage.deleteWorkout(name)
    	await expect(page.getByRole('link', { name: `${name}`})).toBeHidden()
    })
})
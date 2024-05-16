import { test, expect } from '../fixtures';
import { WorkoutPage } from '../PageObjectModels/workoutPage';

test.describe('ST-4 Workout', () => {
	let workoutPage

	test.beforeEach('navigate to workout page', async ({page}) => {
		workoutPage = new WorkoutPage(page)
		await workoutPage.visit()
		await expect(page.getByPlaceholder('Sök efter pass')).toBeVisible()
	})

  test('1. Create workout', async ({ page }) => {
		const name = Math.random().toString(36).slice(2, 7) // Will generate a random string of 5 characters
		await workoutPage.createWorkout(
            {
                description: 'description description description', 
                name: name, 
            }
        )
		await expect(page.getByText(`Träningspasset skapades!`)).toBeVisible()
    	await page.waitForSelector('h1')
		await workoutPage.deleteWorkout(name)
    	await page.getByRole('link', { name: `${name}`}).isHidden()
  })
})

// activities: [
//     {
//         name: 'Upp och ner',
//         description: 'Gå på händer',
//         time: 60
//     }, {
//         name: 'Ner och upp',
//         description: 'Gå på fötter',
//         time: 60
//     }, {
//         name: 'Livershot',
//         description: 'Vänster uppercut mot lever',
//         time: 10
//     }, {
//         name: 'Check hook',
//         description: 'Främre hook, med samtidig sidestep',
//         time: 10
//     }
// ],
// tags: ['Akrobatik', 'Boxning']
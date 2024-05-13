import { test, expect } from './fixtures';
import { ExercisePage } from 'pageObjectModels/exercise_page';

/**
 *
 *  @author Team Mango (Group 4)
 *  @since 2024-05-8
 *  @version 2.0
 */
test.describe('ST-2 Exercise', () => {
	let exercisePage

	test.beforeEach('navigate to exercise section', async ({page}) => {
		exercisePage = new ExercisePage(page)
		await exercisePage.visit()
		await expect(page.getByPlaceholder('Sök efter tekniker')).toBeVisible()
	})

  test('1. Create exercise', async ({ page }) => {
		const name = Math.random().toString(36).slice(2, 7) // Will generate a random string of 5 characters
		await exercisePage.createExercise({description: 'description description description', name: name, time: 12})
		await expect(page.getByText(`Tekniken ${name} skapades`)).toBeVisible()
    await page.waitForURL('**/activity')
		await exercisePage.deleteExercise(name)
    await page.getByRole('link', { name: `${name}`}).isHidden()
  })
})
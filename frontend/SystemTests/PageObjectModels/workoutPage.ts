import { type Page } from '@playwright/test';
import { Workout } from '../Types/systemTestsTypes'
import { Activity } from '../Types/systemTestsTypes'

/**
 *  
 *  Page Object Model for the workout page with url '/workout'.
 * 
 *  @author Team Coconut (Group 7)
 *  @since 2024-05-15
 *  @version 1.0
 */
export class WorkoutPage {
    readonly page: Page
    readonly url: string = '/workout'

    /**
     * @param page this.page that calls the method. 
     */
    public constructor(page: Page) {
        this.page = page
    }

    /**
     * Redirects to '/workout'.
     */
    async visit() {
        await this.page.goto(this.url)
    }

    async createWorkout(workout: Workout) {
        await this.page.locator('#CreateWorkoutButton').getByRole('img').click()

        workout.name && await this.page.getByPlaceholder('Namn').fill(workout.name)
        workout.description && await this.page.getByPlaceholder('Beskrivning av pass').fill(workout.description)
        
        if (workout.techniques || workout.exercises) {

            await this.page.getByRole('button', { name: '+ Aktivitet' }).click()
            workout.techniques && await this.checkAllActivities(workout.techniques, 3)
            
            if (workout.exercises) {
                await this.page.getByRole('tab', { name: 'Övningar' }).click()
                await this.checkAllActivities(workout.exercises, 4)
            }

            // Adds selected activities to workout
            await this.page.locator('#AddCheckedActivitiesButton').click()
            await this.page.locator('div').filter({ hasText: /^Uppvärmning$/ }).click()
            await this.page.getByRole('button', { name: 'Lägg till' }).click()
        }

        // Saves Workout
        await this.page.getByRole('button', { name: 'Spara' }).click()
    }

    /**
     * Since the list elements for techniques and exercises differ, 
     * to locate their respective checkboxes from an input string, 
     * the locator needs to traverse up the DOM tree either 3 or 4 times.
     * 
     * For an array of Techniques : Call with levelsUp = 3
     * For an array of Exercises : Call with levelsUp = 4
     */
    async checkAllActivities(activities, levelsUp) {
        for (const activity of activities) {
            let locator = this.page.getByText(`${activity.name}`, { exact: true })
            
            // Traverse up the DOM tree the specified number of levels
            for (let i = 0; i < levelsUp; i++) {
                locator = locator.locator('..')
            }
            
            // Locate and check the checkbox
            await locator.locator('input[type="checkbox"]').check()
        }
    }
    

    async editWorkout(activities: Activity[]) {

        // Clicks the pen icon to edit the created workout
        await this.page.locator('#edit_pencil').click();

        // Updates the workouts description
        await this.page.getByPlaceholder('Beskrivning av pass').click();
        await this.page.getByPlaceholder('Beskrivning av pass').fill('Description description description more description');

        // Adds another activity to the workout
        await this.page.getByRole('button', { name: '+ Aktivitet' }).click();
        await this.page.getByRole('tab', { name: 'Tekniker' }).click()
        await this.checkAllActivities(activities, 3)
        await this.page.locator('#AddCheckedActivitiesButton').getByRole('img').click();

        // Sets the newly added activitys duration to five minutes
        await this.page.locator('#minute-picker-0').click();
        await this.page.locator('#minute-picker-0').fill(`${activities[0].time}`);

        // Adds the new technique and saves the workout
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
        await this.page.getByRole('button', { name: 'Spara' }).click();        
    }

    async deleteWorkout() {
        await this.page.locator('#delete_trashcan').click()
        await this.page.getByRole('button', { name: 'Ta bort' }).click()
    }
}
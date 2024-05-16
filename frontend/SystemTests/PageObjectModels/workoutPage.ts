import { test, expect, Page } from '@playwright/test';
import { Workout } from '../Types/systemTestsTypes';


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
     * Redirects to '/activity' and opens the 'Övningar' tab.
     */
    async visit() {
        await this.page.goto(this.url)
    }

    async createWorkout(workout: Workout) {
        await this.page.getByRole('img').nth(4).click();
        await this.page.getByPlaceholder('Namn').click();
        await this.page.getByPlaceholder('Namn').fill(workout.name);
        await this.page.getByPlaceholder('Namn').press('Tab');
        await this.page.getByPlaceholder('Beskrivning av pass').fill(workout.description);
        await this.page.getByRole('button', { name: '+ Aktivitet' }).click();
        await this.page.locator('#technique-list-item-138').getByLabel('').check();
        await this.page.locator('#technique-list-item-139').getByLabel('').check();
        await this.page.locator('#technique-list-item-140').getByLabel('').check();
        await this.page.getByRole('tab', { name: 'Övningar' }).click();
        await this.page.locator('._exercise-list-header_4ly7v_10 > ._checkboxLabel_2jy17_1 > #undefined-checkbox').first().check();
        await this.page.locator('div:nth-child(2) > ._exercise-list-header_4ly7v_10 > ._checkboxLabel_2jy17_1 > #undefined-checkbox').check();
        await this.page.locator('div:nth-child(3) > ._exercise-list-header_4ly7v_10 > ._checkboxLabel_2jy17_1 > #undefined-checkbox').check();
        await this.page.locator('._btnAddActivity_1qfu5_1 > svg').click();
        await this.page.locator('div').filter({ hasText: /^Uppvärmning$/ }).click();
        await this.page.locator('div').filter({ hasText: /^Tekniker$/ }).click();
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
        await this.page.getByRole('button', { name: 'Spara' }).click();
    }

    async deleteWorkout(name: String) {
      await this.page.getByRole('img').nth(3).click();
      await this.page.getByRole('button', { name: 'Ta bort' }).click();
    }
}
import { type Page } from '@playwright/test';
import { Exercise } from 'types/systemTestsTypes';

/**
 *  
 *  Page Object Model for the exercise tab at the page with url '/activity'.
 * 
 *  @author Team Mango (Group 4)
 *  @since 2024-05-8
 *  @version 1.0
 */
export class ExercisePage {
  readonly page: Page
  readonly url: string = '/activity'
  
  /**
   * 
   * @param page page that calls the method. 
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

  /**
   * Creates an exercise based on the passed exercise data.
   * @param exercise Can consist of name, description, time, tag and media link
   */
  async createExercise(exercise: Exercise) {
		await this.page.locator('#technique-add-button').getByRole('img').click()

    exercise.name && await this.page.getByPlaceholder('Namn').fill(exercise.name)
    exercise.description && await this.page.getByPlaceholder('Beskrivning av teknik').fill(exercise.description)
    await this.page.locator('#create-technique-beltpicker-header').click()
    await this.page.locator('#belt-adult-Gult-checkbox').check()

    // if(exercise.tag) {
    //   await this.page.getByRole('button', { name: 'Hantera tagg' }).click()
    //   await this.page.getByPlaceholder('Sök efter taggar').fill(exercise.tag)
    //   await this.page.getByRole('button', { name: `${exercise.tag}` }).click()
    //   await this.page.getByRole('button', { name: 'Stäng' }).click()
    //   await this.page.getByRole('button', { name: 'Lägg till' }).click()
    // }

    // if(exercise.mediaLink) {
    //   await this.page.getByRole('button', { name: '+ Media' }).click()
    //   await this.page.getByPlaceholder('Klistra in länk').fill(exercise.mediaLink)
    //   await this.page.getByRole('button', { name: 'Länka Till Media' }).click()
    // }

    await this.page.getByRole('button', { name: 'Lägg till' }).click();
    // _________
    // await this.page.waitForURL('**/activity/exercise/create')
    // exercise.name && await this.page.getByPlaceholder('Namn').fill(exercise.name)
    // exercise.description && await this.page.getByPlaceholder('Beskrivning').fill(exercise.description)
    // exercise.time && await this.page.locator('#minute-picker-undefined').fill(exercise.time.toString())
    // if(exercise.mediaLink) {
    //   await this.page.getByRole('button', { name: '+ Media' }).click()
    //   await this.page.getByPlaceholder('Klistra in länk').fill('https://www.youtube.com/watch?v=2ybLD6_2gKM')
    //   await this.page.getByRole('button', { name: 'Länka Till Media' }).click()
    // }
    //await this.page.getByRole('button', { name: 'Lägg till' }).click()
    // ______________
  }

  async deleteExercise(name: string) {
    await this.page.waitForSelector('.infinite-scroll-component__outerdiv', {timeout: 30000})
    await this.page.getByPlaceholder('Sök efter tekniker').fill(`${name}`)
    await this.page.getByRole('link', { name: `${name}`}).click()
    await this.page.waitForSelector('._technique-detail-actions-container_1dw3s_11')
    await this.page.locator('#technique-delete-button').click()
    await this.page.getByRole('button', { name: 'Ta bort' }).click()
  }
}
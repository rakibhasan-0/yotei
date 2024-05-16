import { type Page } from '@playwright/test';
import { Technique } from '../Types/systemTestsTypes';

/**
 *  
 *  Page Object Model for the technique tab at the page with url '/activity'.
 * 
 *  @author Team Mango (Group 4)
 *  @since 2024-05-8
 *  @version 1.0
 */
export class TechniquePage {
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
   * Creates an technique based on the passed technique data.
   * @param technique Can consist of name, description, time, tag and media link
   */
  async createTechnique(technique: Technique) {
		await this.page.locator('#technique-add-button').getByRole('img').click()

    technique.name && await this.page.getByPlaceholder('Namn').fill(technique.name)
    technique.description && await this.page.getByPlaceholder('Beskrivning av teknik').fill(technique.description)
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

  async deleteTechnique(name: string) {
    await this.page.waitForSelector('.infinite-scroll-component__outerdiv', {timeout: 30000})
    await this.page.getByPlaceholder('Sök efter tekniker').fill(`${name}`)
    await this.page.getByRole('link', { name: `${name}`}).click()
    await this.page.waitForSelector('[data-testid="technique-detail-actions-container"]')
    await this.page.locator('#technique-delete-button').click()
    await this.page.getByRole('button', { name: 'Ta bort' }).click()
  }
}
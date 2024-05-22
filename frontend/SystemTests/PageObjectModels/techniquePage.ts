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

    // Searches for the string in the technique.tag prop and adds it, assumes input technique tag exists.
    // Creating a new tag during test has been tested but removed since there is no cleanup function to remove created tags. 
    if(technique.tag) {
      await this.page.getByRole('button', { name: 'Hantera tagg' }).click()
      await this.page.getByPlaceholder('Sök eller skapa tagg').click()
      await this.page.getByPlaceholder('Sök eller skapa tagg').fill(`${technique.tag}`)

      // Retrieve checkbox for the passed tag.
      const locator = this.page.getByText(`${technique.tag}`, {exact: true})
      const checkBox = await locator.locator('../..')

      await checkBox.locator('input[type="checkbox"]').check()
      await this.page.locator('#save-and-close-button').getByRole('img').click()
    }

    // Adds the input techniques mediaLink prop as a URL in the technique.
    if(technique.mediaLink) {
      await this.page.getByRole('button', { name: '+ Media' }).click()
      await this.page.getByPlaceholder('Klistra in länk').fill(technique.mediaLink)
      await this.page.getByRole('button', { name: 'Länka Till Media' }).click()
    }

    await this.page.getByRole('button', { name: 'Lägg till' }).click()
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
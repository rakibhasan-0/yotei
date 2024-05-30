import { type Page } from '@playwright/test';

/**
 * TODO: If more tests are to be created for GradingBefore, the user should create a Type for a Grading and also 
 * adapt the POM functions which handles it.  
 */

/**
 *  
 *  Page Object Model for the grading before tab at the page with url '/grading/{gradingId}/1'.
 * 
 *  @author Team Pomegrade (Group 1)
 *  @since 2024-05-28
 *  @version 1.0
 */
export class GradingBefore {
  readonly page: Page
  readonly url: string = '/grading/create'
  
  /**
   * 
   * @param page page that calls the method. 
   */
  public constructor(page: Page) {
    this.page = page
  }

  /**
   * Redirects to '/grading/create'
   */
  async visit() {
    await this.page.goto(this.url)
  }

 
  /**
   * Add an examinee
   * @param name The name of the examinee
   */
  async addExaminee(name : string) {
    await this.page.getByPlaceholder('Lägg till ny deltagare').click()
    await this.page.getByPlaceholder('Lägg till ny deltagare').fill(name)
    await this.page.getByPlaceholder('Lägg till ny deltagare').press('Enter')
		
  }

  /**
   * Create a pair
   * @param name1 The name of the examinee
   * @param name2 The name of the examinee
   */
  async createPair(name1 : string, name2 : string) {
    await this.clickElement(name1, '#checkbox-element')
    await this.clickElement(name2, '#checkbox-element')
    await this.page.locator('#create-pair-button').click()
  }

  /**
   * Remove an examinee
   * @param name The name of the examinee
   */
  async removeExaminee(name : string) {
    await this.clickElement(name, '#close-icon')
  }

  /**
   * Set the name of the grading
   * @param name The name of the grading
   */
  async setGradingName(name : string) {
    let locator = this.page.locator("#grading-name-text-field")
		for (let i = 0 ; i < 2 ; i++) {
			locator = locator.locator("..")
		}
    await locator.locator('#edit-clickable').click()
		await locator.locator("#edit-element").fill(name)
    await locator.locator('#edit-element').press('Enter')
  }

  /**
   * Deleting the grading
   * @param name The name of the grading
   */
  async deleteGrading(name : string) {
    await this.page.goto('/grading')
    await this.page.locator('#close-icon-' + name + '0').click()
  }

	/**
	 * Finds the component to click
	 * Component is located by searching for the name, then navigating
	 * to it's parent components moving up the DOM hierarchy.
	 * @param tag The tag that exist in the EditableListTagItem. 
	 * @param name The name of the component to be clicked. 
	 */
	async clickElement(tag : string, name : string) {
		let locator = this.page.getByText(tag, { exact: true })
		for (let i = 0 ; i < 2 ; i++) {
			locator = locator.locator("..")
		}
		await locator.locator(name).click()
	}
}


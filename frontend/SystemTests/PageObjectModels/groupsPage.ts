import { type Page } from '@playwright/test'
import { Group } from 'Types/systemTestsTypes'

/**
 *  
 *  Page Object Model for the group index page with url '/groups'.
 * 
 *  @author Team Mango (Group 4)
 *  @since 2024-05-27
 *  @version 1.0
 */
export class GroupsPage {
  readonly page: Page
  readonly url: string = '/groups'

  public constructor(page: Page) {
    this.page = page
  }

  /**
   * Redirect to /groups.
   */
  async visit() {
    await this.page.goto(this.url)
  }

  /**
   * Create a new group conditionally based on the passed properties.
   * @param group properties (possibly name, start date, end date, days and time) related to the group to be created. 
   */
  async createGroup(group: Group) {
    await this.page.locator('.plus-icon').click()
    group.name && await this.page.getByPlaceholder('Namn').fill(group.name)

    // Fill checkboxes based on the passed belt ids in group object.
    if(group.beltIds) {
      await this.page.locator('#form-belt-picker-dropdown').click()
      for(const belt of group.beltIds) {
        await this.page.locator(`#belt-${belt}`).check()
      }
    }

    group.startDate && await this.page.locator('#start-date-picker').fill(group.startDate)
    group.endDate && await this.page.locator('#end-date-picker').fill(group.endDate)

    // Fill in all passed days and there time slots. 
    if(group.days) {
      for(const day of group.days) {
        await this.page.locator(`#${day.name}CheckBox-checkbox`).check()
        await this.page.locator(`#${day.name}TimePicker`).fill(day.time)
      }
    }

    await this.page.getByRole('button', { name: 'Gå vidare' }).click()
  }

  /**
   * Delete a created group based on its name. 
   * @param name name of group
   */
  async deleteGroup(name: string) {
    const groupContainer = await this.page.getByText(`${name}`, { exact: true }).locator('..')
    await groupContainer.locator('#edit-group-button').click()
    await this.page.locator('#trashcan_button').click()
    await this.page.getByRole('button', { name: 'Ta bort grupp' }).click()
  }
}
import { type Page } from '@playwright/test'
import { Group } from 'Types/systemTestsTypes'

export class GroupsPage {
  readonly page: Page
  readonly url: string = '/groups'

  public constructor(page: Page) {
    this.page = page
  }

  async visit() {
    await this.page.goto(this.url)
  }

  async createGroup(group: Group) {
    await this.page.locator('.plus-icon').click()
    await this.page.getByPlaceholder('Namn').fill(group.name)
    await this.page.locator('#form-belt-picker-dropdown').click()
    await this.page.locator('#belt-adult-Vitt-checkbox').check()
    await this.page.locator('#start-date-picker').fill(group.startDate)
    await this.page.locator('#end-date-picker').fill(group.endDate)
    await this.page.locator('#TisCheckBox-checkbox').check()
    await this.page.locator('#TisTimePicker').click()
    await this.page.locator('#TisTimePicker').fill('18:00')
    await this.page.getByRole('button', { name: 'Gå vidare' }).click()
  }

  async deleteSomething(name: String) {
    // generate code with codegen in the next step
  }
}
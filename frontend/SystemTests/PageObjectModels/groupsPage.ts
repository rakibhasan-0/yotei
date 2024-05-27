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
    group.name && await this.page.getByPlaceholder('Namn').fill(group.name)
    // Choice of belt should be changed to be dynamically´.
    await this.page.locator('#form-belt-picker-dropdown').click()
    await this.page.locator('#belt-adult-Vitt-checkbox').check()
    group.startDate && await this.page.locator('#start-date-picker').fill(group.startDate)
    group.endDate && await this.page.locator('#end-date-picker').fill(group.endDate)

    if(group.days) {
      for(const day of group.days) {
        await this.page.locator(`#${day.name}CheckBox-checkbox`).check()
        await this.page.locator(`#${day.name}TimePicker`).fill(day.time)
      }
    }

    await this.page.getByRole('button', { name: 'Gå vidare' }).click()
  }

  async deleteGroup(name: string) {
    // await this.page.locator('role=alert', { hasText: `${name}` }).waitFor({ state: 'hidden' })

    const locator = await this.page.getByText(`${name}`, { exact: true })
    const parent = await locator.locator('..')
    await parent.locator('#pencil-button').click()
    //const parentHtml = await pencil.innerHTML()
    //console.log(parentHtml)

    //.locator('#edit-group-button').click()
    // await this.page.getByTestId('#trashcan_button').click()
    // await this.page.getByRole('button', { name: 'Ta bort grupp' }).click()
  }
}
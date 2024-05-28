import { test, expect } from '../fixtures'
import { GroupsPage } from '../PageObjectModels/groupsPage'
import { GroupsDay, Group } from 'Types/systemTestsTypes'

/**
 *  Tests related to the page /groups.  
 *  @author Team Mango (Group 4)
 *  @since 2024-05-28
 *  @version 1.0
 */
test.describe('Groups test', () => {
  let groupsPage
  
  test.beforeEach('navigate to groups page', async ({page}) => {
    groupsPage = new GroupsPage(page)
    await groupsPage.visit()
    await expect(page.locator('#root')).toContainText('Grupper')
  })
  
  test('1. Create group with name, start date, end date and two days, should display success toast', async ({ page }) => {
    // Generate data for a group object
		const name = Math.random().toString(36).slice(2, 7) 
    const monday: GroupsDay = { name: 'Tis', time: '18:00' }
    const wednesday: GroupsDay = { name: 'Ons', time: '17:30' }
    const group: Group = {
      name: name,
      startDate: '2025-01-01',
      endDate: '2025-06-01',
      days: [ monday, wednesday ]
    }

    // Create a group and assert that it was done successfully
    await groupsPage.createGroup(group)
    await expect(page.locator('#root')).toContainText(`Gruppen ${name} lades till`)
    await expect(page.locator('#root')).toContainText('Tillfällen lades till.')

    // Delete the new group and asserts deletion
    await groupsPage.deleteGroup(name)
    await expect(page.getByText('Ändringar sparade.')).toBeVisible()
  })
})
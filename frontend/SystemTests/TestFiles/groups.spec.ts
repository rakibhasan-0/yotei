import { test, expect } from '../fixtures'
import { GroupsPage } from '../PageObjectModels/groupsPage'
import { GroupsDay, Group, Belt } from 'Types/systemTestsTypes'

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
    const tuesday: GroupsDay = { name: 'Tis', time: '18:00' }
    const wednesday: GroupsDay = { name: 'Ons', time: '17:30' }
    const group: Group = {
      name: name,
      startDate: '2025-01-01',
      endDate: '2025-06-01',
      days: [ tuesday, wednesday ],
      // 'adult-1', 'adult-2', 'adult-3', 
      beltIds: ['adult-Vitt-checkbox', 'adult-Gult-checkbox', 'adult-Orange-checkbox', 'adult-Grönt-checkbox', 
                'adult-Blått-checkbox', 'adult-Brunt-checkbox', 'adult-Svart-checkbox', 'adult-2\\ Dan-checkbox',
                'adult-3\\ Dan-checkbox', 'child-Gult-checkbox', 'child-Orange-checkbox', 'child-Grönt-checkbox',
                'inverted-Gult-checkbox', 'inverted-Orange-checkbox', 'inverted-Grönt-checkbox']
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

// await page.locator('#belt-adult-Vitt-checkbox').check();
// await page.locator('#belt-child-Gult-checkbox').check();
// await page.locator('#belt-inverted-Gult-checkbox').check();
// await page.locator('#belt-adult-Gult-checkbox').check();
// await page.locator('#belt-child-Orange-checkbox').check();
// await page.locator('#belt-inverted-Orange-checkbox').check();
// await page.locator('#belt-adult-Orange-checkbox').check();
// await page.locator('#belt-adult-Grönt-checkbox').check();
// await page.locator('#belt-inverted-Grönt-checkbox').check();
// await page.locator('#belt-child-Grönt-checkbox').check();
// await page.locator('#belt-adult-Blått-checkbox').check();
// await page.locator('#belt-adult-Brunt-checkbox').check();
// await page.locator('#belt-adult-Svart-checkbox').check();
// await page.locator('#belt-adult-1').check();
// await page.locator('#belt-adult-2').check();
// await page.locator('#belt-adult-3').check();
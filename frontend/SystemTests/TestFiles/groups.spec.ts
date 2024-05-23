import { test, expect } from '../fixtures'
import { GroupsPage } from '../PageObjectModels/groupsPage'

test.describe('Groups', () => {
  let groupsPage
  
  test.beforeEach('navigate to groups page', async ({page}) => {
    groupsPage = new GroupsPage(page)
    await groupsPage.visit()
    await expect(page.locator('#root')).toContainText('Grupper')
  })
  
  test('Create group', async ({ page }) => {
    // Will generate a random string of 5 characters
		const name = Math.random().toString(36).slice(2, 7) 
    await groupsPage.createGroup({name: name, startDate: '2025-01-01', endDate: '2025-06-01'})
    await expect(page.locator('#root')).toContainText(`Gruppen ${name} lades till`)
    await expect(page.locator('#root')).toContainText('Tillfällen lades till.')
  })
})
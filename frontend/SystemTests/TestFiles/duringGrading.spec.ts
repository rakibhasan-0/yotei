import { test, expect } from '../fixtures'
import { DuringGradingPage } from '../PageObjectModels/duringGradingPage'

test.describe('Name of test suite', () => {
    let duringGradingPage
    
    test.beforeEach('navigate to technique section', async ({page}) => {
        duringGradingPage = new DuringGradingPage(page)
        await duringGradingPage.visit()
        await expect(page.getByPlaceholder('KIHON WAZA - ATEMI WAZA')).toBeVisible()
    })
    
    test('1. Should set result for technique to pass.', async ({ page }) => {
        // Act by calling methods in POM and assert by using expect.
        // Do not forget to delete data in the database that was created during the test.
        await duringGradingPage.setPassResultForExaminee(
            {
                examineeId: "1",
                name: "TestPerson1"
            }
        )
    })
})
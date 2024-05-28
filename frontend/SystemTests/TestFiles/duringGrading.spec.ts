import { test, expect } from '../fixtures'
import { DuringGradingPage } from '../PageObjectModels/duringGradingPage'

test.describe('Name of test suite', () => {
    let duringGradingPage: DuringGradingPage
    
    test.beforeEach('navigate to technique section', async ({ page }) => {
        duringGradingPage = new DuringGradingPage(page)
        await duringGradingPage.createGrading()
        const gradingId = await duringGradingPage.getCurrentUrl()
        console.log("GradingId is: " + gradingId)
        await duringGradingPage.visit(`grading/${gradingId}/2`)
        expect(page.getByTestId("infoPanel"))
    })
    
    test('1. Should set result for technique to pass and fail to half of the examinees.', async ({ page }) => {
        // Act by calling methods in POM and assert by using expect.
        // Do not forget to delete data in the database that was created during the test.
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson1" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson2" })
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson3" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson4" })
        
        const backgroundColor1 = await page.$eval('[data-testid="TestPerson1systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });
        const backgroundColor2 = await page.$eval('[data-testid="TestPerson2systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });
        const backgroundColor3 = await page.$eval('[data-testid="TestPerson3systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });
        const backgroundColor4 = await page.$eval('[data-testid="TestPerson4systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });

        expect(backgroundColor1).toBe('rgb(144, 238, 144)');
        expect(backgroundColor2).toBe('rgb(240, 128, 128)');
        expect(backgroundColor3).toBe('rgb(144, 238, 144)');
        expect(backgroundColor4).toBe('rgb(240, 128, 128)');
    
    })
    
    test('2. Should go to next technique.', async ({ page }) => {
        await duringGradingPage.moveToNextTechnique()
    })
})
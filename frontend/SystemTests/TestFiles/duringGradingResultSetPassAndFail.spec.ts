import { test, expect } from '../fixtures'
import { DuringGradingPage } from '../PageObjectModels/duringGradingPage'

/**
 * A test for the during grading page where it tests the different components functionality and verifies 
 * that correct fetches of data from backend has been made. 
 * 
 * This test covers results, stepping back and forth and posting and fetching
 * comments for Group, Pair And Individial comments.
 *
 *  @author Team Orange (Group 5, c19jen, ens21ljn)
 *  @since 2024-05-29
 *  @version 1.0
 */
test.describe('Systest for DuringGrading page.', () => {
    let duringGradingPage: DuringGradingPage
    
    /**
     * This is run to set up a new grading for each test.
     */
    test.beforeEach('navigate to technique section', async ({ page }) => {
        duringGradingPage = new DuringGradingPage(page)
        await duringGradingPage.createGrading()
        const gradingId = await duringGradingPage.getCurrentUrl()
        await duringGradingPage.visit(`grading/${gradingId}/2`)
        expect(page.getByTestId("infoPanel"))
    })

    /**
     * This is run after each test to remove grading that are created
     * to test the during grading functionality.
     */
    test.afterEach('delete created grading', async ({}) => {
        const gradingId = await duringGradingPage.getCurrentUrl()
        await duringGradingPage.visit(`grading/${gradingId}/2`)
        await duringGradingPage.saveGrading()
        await duringGradingPage.visit(`grading`)
        await duringGradingPage.removeGrading()
    })
    
    /**
     * This test is to check that during a grading that an examinator can click the EamineeBox to 
     * cycle through pass/fail/reset to see that it actually works as intended
     */
    test('1. Should set result for technique to pass and fail to half of the examinees.', async ({ page }) => {
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson1" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson2" })
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson3" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson4" })
        
        const backgroundColor1 = await page.$eval('[data-testid="TestPerson1systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })
        const backgroundColor2 = await page.$eval('[data-testid="TestPerson2systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })
        const backgroundColor3 = await page.$eval('[data-testid="TestPerson3systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })
        const backgroundColor4 = await page.$eval('[data-testid="TestPerson4systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })

        expect(backgroundColor1).toBe('rgb(144, 238, 144)')
        expect(backgroundColor2).toBe('rgb(240, 128, 128)')
        expect(backgroundColor3).toBe('rgb(144, 238, 144)')
        expect(backgroundColor4).toBe('rgb(240, 128, 128)')
    })
})
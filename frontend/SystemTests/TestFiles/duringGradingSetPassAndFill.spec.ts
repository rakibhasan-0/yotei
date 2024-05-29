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
     * This test is used to show that when you have graded a technique and navigated to the next technique
     * and then back to the previous that the correct colors should load from the database for each examinee.
     */
    test('3. Should fill out the first technique for all examinees and move to next and then back to see if they are filled.', async ({ page }) => {
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson1" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson2" })
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson3" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson4" })

        await duringGradingPage.moveToNextTechnique()

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

        expect(backgroundColor1).toBe('rgb(255, 255, 255)')
        expect(backgroundColor2).toBe('rgb(255, 255, 255)')
        expect(backgroundColor3).toBe('rgb(255, 255, 255)')
        expect(backgroundColor4).toBe('rgb(255, 255, 255)')

        await duringGradingPage.moveToPreviousTechnique()

        const backgroundColor11 = await page.$eval('[data-testid="TestPerson1systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })
        const backgroundColor22 = await page.$eval('[data-testid="TestPerson2systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })
        const backgroundColor33 = await page.$eval('[data-testid="TestPerson3systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })
        const backgroundColor44 = await page.$eval('[data-testid="TestPerson4systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor
        })

        expect(backgroundColor11).toBe('rgb(144, 238, 144)')
        expect(backgroundColor22).toBe('rgb(240, 128, 128)')
        expect(backgroundColor33).toBe('rgb(144, 238, 144)')
        expect(backgroundColor44).toBe('rgb(240, 128, 128)')
    })
})
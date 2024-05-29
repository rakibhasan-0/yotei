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
     * This test is used to show that the color of the ExamineeBox component actually resets when going
     * to a new technique.
     */
    test('2. Should go to next technique. and the colors should be set to default.', async ({ page }) => {
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
    })
})
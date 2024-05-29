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
     * this is run to set up a new grading for each test.
     */
    test.beforeEach('navigate to technique section', async ({ page }) => {
        duringGradingPage = new DuringGradingPage(page)
        await duringGradingPage.createGrading()
        const gradingId = await duringGradingPage.getCurrentUrl()
        await duringGradingPage.visit(`grading/${gradingId}/2`)
        expect(page.getByTestId("infoPanel"))
    })

    /**
     * this is run after each test to remove grading that are created
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
     * this test is to check that during a grading that an examinator can click the EamineeBox to 
     * cycle through pass/fail/reset to see that it actually works as intended
     */
    test('1. Should set result for technique to pass and fail to half of the examinees.', async ({ page }) => {
        // Act by calling methods in POM and assert by using expect.
        // Do not forget to delete data in the database that was created during the test.
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
    /**
     * this test is used to show that the color of the ExamineeBox component actually resets when going
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

    /**
     * this test is used to show that when you have graded a technique and navigated to the next technique
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

    /**
     * this test works by adding comment to the examinees then navigate to the next technique and then
     * back to the previous technique it actually loads the comments correctly fron the database.
     */
    test('4. Should add Examinee Comment and load it.', async ({ page }) => {
        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson1" })
        await duringGradingPage.addExamineeComment({content: "Systest Kommentar Personlig1" })

        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson2" })
        await duringGradingPage.addExamineeComment({content: "Systest Kommentar Personlig2" })

        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson3" })
        await duringGradingPage.addExamineeComment({content: "Systest Kommentar Personlig3" })
        
        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson4" })
        await duringGradingPage.addExamineeComment({content: "Systest Kommentar Personlig4" })

        await duringGradingPage.moveToNextTechnique()
        await duringGradingPage.moveToPreviousTechnique()

        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson1" })
        const textAreaValue1 = await page.$eval('#TextareaTestId', (el) =>(el as HTMLTextAreaElement).value)
        expect(textAreaValue1).toBe("Systest Kommentar Personlig1")
        await duringGradingPage.closeExamineePopup()

        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson2" })
        const textAreaValue2 = await page.$eval('#TextareaTestId', (el) => (el as HTMLTextAreaElement).value)
        expect(textAreaValue2).toBe("Systest Kommentar Personlig2")
        await duringGradingPage.closeExamineePopup()

        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson3" })
        const textAreaValue3 = await page.$eval('#TextareaTestId', (el) =>(el as HTMLTextAreaElement).value)
        expect(textAreaValue3).toBe("Systest Kommentar Personlig3")
        await duringGradingPage.closeExamineePopup()

        await duringGradingPage.navigateToExamineeComment({ examineeName: "TestPerson4" })
        const textAreaValue4 = await page.$eval('#TextareaTestId', (el) =>(el as HTMLTextAreaElement).value)
        expect(textAreaValue4).toBe("Systest Kommentar Personlig4")
        await duringGradingPage.closeExamineePopup() 
    })

    /**
     * this test works by adding a comment to a pair then navigate to the next technique and then
     * back to the previous technique it actually loads the comment correctly fron the database.
     */
    test('5. Should add Pair Comment and load it.', async ({ page }) => {
        await duringGradingPage.navigateToPairComment({pairId: "P1systest"})
        await duringGradingPage.addPairComment({content: "Systest Kommentar Par1" })
        await duringGradingPage.navigateToPairComment({pairId: "P2systest"})
        await duringGradingPage.addPairComment({content: "Systest Kommentar Par2" })

        await duringGradingPage.moveToNextTechnique()
        await duringGradingPage.moveToPreviousTechnique()

        await duringGradingPage.navigateToPairComment({pairId: "P1systest"})
        const textAreaValue1 = await page.$eval('#TextareaTestId', (el) =>(el as HTMLTextAreaElement).value)
        expect(textAreaValue1).toBe("Systest Kommentar Par1")
        await duringGradingPage.closePairPopup()

        await duringGradingPage.navigateToPairComment({pairId: "P2systest"})
        const textAreaValue2 = await page.$eval('#TextareaTestId', (el) => (el as HTMLTextAreaElement).value)
        expect(textAreaValue2).toBe("Systest Kommentar Par2")
        await duringGradingPage.closePairPopup()
    })

    /**
     * this test works by adding a comment to the group then navigate to the next technique and then
     * back to the previous technique it actually loads the comment correctly fron the database.
     */
    test('6. Should add Group Comment and load it.', async ({ page }) => {
        await duringGradingPage.navigateToGroupComment()
        await duringGradingPage.addGroupComment({content: "Systest Kommentar grupp" })

        await duringGradingPage.moveToNextTechnique()
        await duringGradingPage.moveToPreviousTechnique()

        await duringGradingPage.navigateToGroupComment()
        const textAreaValue1 = await page.$eval('#TextareaTestId', (el) =>(el as HTMLTextAreaElement).value)
        expect(textAreaValue1).toBe("Systest Kommentar grupp")
        await duringGradingPage.closeGroupPopup()
    })
})
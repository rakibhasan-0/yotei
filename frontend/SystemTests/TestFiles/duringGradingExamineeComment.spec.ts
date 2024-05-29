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
     * This test works by adding comment to the examinees then navigate to the next technique and then
     * back to the previous technique it actually loads the comments correctly from the database.
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
})
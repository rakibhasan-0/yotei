import { test, expect } from '../fixtures'
import { DuringGradingPage } from '../PageObjectModels/duringGradingPage'

test.describe('Systest for DuringGrading page.', () => {
    let duringGradingPage: DuringGradingPage
    
    test.beforeEach('navigate to technique section', async ({ page }) => {
        duringGradingPage = new DuringGradingPage(page)
        await duringGradingPage.createGrading()
        const gradingId = await duringGradingPage.getCurrentUrl()
        await duringGradingPage.visit(`grading/${gradingId}/2`)
        expect(page.getByTestId("infoPanel"))
    })
    test.afterEach('delete created grading', async ({}) => {

        const gradingId = await duringGradingPage.getCurrentUrl()
        await duringGradingPage.visit(`grading/${gradingId}/2`)
        await duringGradingPage.saveGrading()
        await duringGradingPage.visit(`grading`)
        await duringGradingPage.removeGrading()

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
    
    test('2. Should go to next technique. and the colors should be set to default.', async ({ page }) => {
        await duringGradingPage.moveToNextTechnique()

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

        expect(backgroundColor1).toBe('rgb(255, 255, 255)');
        expect(backgroundColor2).toBe('rgb(255, 255, 255)');
        expect(backgroundColor3).toBe('rgb(255, 255, 255)');
        expect(backgroundColor4).toBe('rgb(255, 255, 255)');
    })

    test('3. Should fill out the first technique for all examinees and move to next and then back to see if they are filled.', async ({ page }) => {
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson1" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson2" })
        await duringGradingPage.setPassResultForExaminee({ examineeId: 1, name: "TestPerson3" })
        await duringGradingPage.setFailResultForExaminee({ examineeId: 1, name: "TestPerson4" })

        await duringGradingPage.moveToNextTechnique()

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

        expect(backgroundColor1).toBe('rgb(255, 255, 255)');
        expect(backgroundColor2).toBe('rgb(255, 255, 255)');
        expect(backgroundColor3).toBe('rgb(255, 255, 255)');
        expect(backgroundColor4).toBe('rgb(255, 255, 255)');

        await duringGradingPage.moveToPreviousTechnique()

        const backgroundColor11 = await page.$eval('[data-testid="TestPerson1systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });
        const backgroundColor22 = await page.$eval('[data-testid="TestPerson2systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });
        const backgroundColor33 = await page.$eval('[data-testid="TestPerson3systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });
        const backgroundColor44 = await page.$eval('[data-testid="TestPerson4systest"]', (element) => {
            return window.getComputedStyle(element).backgroundColor;
        });

        expect(backgroundColor11).toBe('rgb(144, 238, 144)');
        expect(backgroundColor22).toBe('rgb(240, 128, 128)');
        expect(backgroundColor33).toBe('rgb(144, 238, 144)');
        expect(backgroundColor44).toBe('rgb(240, 128, 128)');

    })

})
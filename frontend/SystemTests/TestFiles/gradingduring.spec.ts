import { test, expect } from '../fixtures';

/**
 * Some basic system test for testing the grading flow of the grading.
 *
 *  @author Team Orange (Group 5)
 *  @since 2024-05-17
 *  @version 1.0
 */

test.describe("Correct protocol grading flow tests", () => {
    /**
     * Navigera till steget där man väljer ett protokoll innan varje test
     * i den här kategorin
     */
    test.beforeEach(async ({page}) => {
        await page.locator('#hamburger-button').click();
        await page.getByRole('button', { name: 'Gradering' }).click();
        await page.locator('._btnAddActivity_1qfu5_1').click();
	})

    /**
     * Testar flödet för gult protokoll, kollar framförallt att
     * de tekniker som visas på skärmen är korrekt utifrån när testet var skrivet
     */
    test('Test yellow belt correct protocol', async ({ page }) => {
        await page.getByRole('button', { name: 'KYU GULT BÄLTE' }).click();
        await page.getByPlaceholder('Lägg till ny deltagare').click();
        await page.getByPlaceholder('Lägg till ny deltagare').fill('Noa');
        await page.locator('#plus-icon').click();
        await page.getByPlaceholder('Lägg till ny deltagare').click();
        await page.getByPlaceholder('Lägg till ny deltagare').fill('Lars');
        await page.locator('#plus-icon path').click();
        await page.getByRole('button', { name: 'Forsätt' }).click();
        await expect(page.locator('#root')).toContainText('1. Shotei uchi, jodan, rak stöt med främre och bakre handen');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('2. Shotei uchi, chudan, rak stöt med främre och bakre handen');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('3. Gedan geri, rak spark med främre och bakre benet');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('1. O soto osae, utan grepp, nedläggning snett bakåt');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('1. Koshi otoshi, utan grepp, nedläggning snett bakåt');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('1. Grepp i två handleder framifrån Frigöring');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('2. Grepp i två handleder bakifrån Frigöring');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('3. Grepp i håret bakifrån Tettsui uchi, frigöring');
        await page.locator('#next_technique path').click();
        await expect(page.locator('#root')).toContainText('4. Försök till stryptag framifrån Jodan soto uke');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('5. Stryptag framifrån Kawashi, frigöring');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('6. Stryptag bakifrån Maesabaki, kawashi, frigöring');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('7. Stryptag med armen Maesabaki, kuzure ude osae, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('8. Försök till kravattgrepp från sidan Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('9. Grepp i ärmen med drag O soto osae, ude henkan gatame');
        await page.locator('#next_technique path').click();
        await expect(page.locator('#root')).toContainText('10. Livtag under armarna framifrån Tate hishigi, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('11. Stryptag mot liggande sittande vid sidan Frigöring, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('12. Hotfullt närmande mot liggande Uppgång bakåt');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('13. Hotfullt närmande Hejda med tryck');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('14. Kort svingslag Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('15. Långt svingslag Morote jodan uke, o soto osae, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('16. Påkslag mot huvudet Ju morote jodan uke');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('17. Påkslag mot huvudet, backhand Ju morote jodan uke');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('18. Knivhot mot magen Grepp, shotei uchi jodan');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('1. Försök till stryptag framifrån - Försök till kravattgrepp från sidan Jodan soto uke - Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('1. Försvar mot en motståndare');
    });

    /**
     * Testar flödet för grönt protokoll, kollar framförallt att
     * de tekniker som visas på skärmen är korrekt utifrån när testet var skrivet
     */
    test('Test green belt correct protocol', async ({ page }) => {
        await page.getByRole('button', { name: 'KYU GRÖNT BÄLTE' }).click();
        await page.getByPlaceholder('Lägg till ny deltagare').click();
        await page.getByPlaceholder('Lägg till ny deltagare').fill('Noa');
        await page.locator('#plus-icon').click();
        await page.getByPlaceholder('Lägg till ny deltagare').click();
        await page.getByPlaceholder('Lägg till ny deltagare').fill('Lars');
        await page.locator('#plus-icon').click();
        await page.getByRole('button', { name: 'Forsätt' }).click();
        await expect(page.locator('#root')).toContainText('1. Shotei uchi, jodan, rak stöt med främre och bakre handen');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('2. Shotei uchi, chudan, rak stöt med främre och bakre handen');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('3. Gedan geri, rak spark med främre och bakre benet');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('4. Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('5. Chudan tski, stöt snett uppåt med bakre handen');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('6. Hiza geri, chudan, rak knästöt med bakre benet');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('7. Mawashi seiken tski, jodan, cirkulärt slag med främre och bakre handen');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('8. Kin geri, gedan, spark snett uppåt med främre och bakre benet');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('9. Mae geri, chudan, rak spark med främre och bakre benet');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('1. O soto osae, utan grepp, nedläggning snett bakåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('2. Kote gaeshi, grepp i handleden, nedläggning snett framåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('3. Kote gaeshi, grepp i handleden, nedläggning snett bakåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('4. Ude osae, grepp i kragen med tryck, nedläggning framåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('5. Ude osae, i rörelse, cirkulär nedläggning');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('1. Koshi otoshi, utan grepp, nedläggning snett bakåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('2. Uki otoshi, i rörelse, nedläggning snett framåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('3. O soto otoshi, grepp i kragen med drag, nedläggning snett bakåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('4. O soto otoshi, utan grepp, nedläggning snett bakåt');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('1. Grepp i två handleder framifrån Shiho nage, shiho nage gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('2. Stryptag framifrån O soto otoshi, ude hishigi hiza gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('3. Stryptag bakifrån med vänster arm Maesabaki, kuzure ude gatami, kote gaeshi, ude hishigi hiza gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('4. Grepp i kläderna med tryck Ude osae, ude osae gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('5. Grepp i kläderna med drag O soto otoshi, ude hishigi hiza gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('6. Grepp om nacken och en knästöt Gedan juji uke, kawashi, koshi otoshi, ude henkan gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('7. Livtag under armarna bakifrån Ude osae, ude osae gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('8. Högt livtag över armarna bakifrån Maesabaki, kuzure ude osae, ude henkan gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('9. Stryptag mot liggande sittande mellan benen Frigöring');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('10. Svingslag mot liggande mot huvudet Jodan chikai uke, hiza kansetsu waza');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('11. Rakt slag mot huvudet Jodan soto uke, o soto otoshi, ude hishigi hiza gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('12. Cirkulär spark mot benen San ren uke, o soto osae, ude henkan gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('13. Påkslag mot huvudet, backhand Ju morote jodan uke, ude osae, ude osae gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('14. Knivhot mot halsen, vänster sida Grepp, kin geri');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('15. Knivhot mot halsen, höger sida Grepp, kin geri');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('1. Grepp i två handleder bakifrån - Rak spark mot magen Frigöring - Gedan uchi uke, koshi otoshi, ude henkan gatame');
        await page.locator('#next_technique').getByRole('img').click();
        await expect(page.locator('#root')).toContainText('2. Hotfullt närmande mot liggande - Långt svingslag Uppgång bakåt - Ju jodan uchi uke, uki otoshi ude henkan gatame');
        await page.locator('#next_technique').click();
        await expect(page.locator('#root')).toContainText('1. Försvar mot en motståndare');
    });
})
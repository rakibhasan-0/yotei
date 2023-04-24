import { expect } from '@playwright/test';
import { test } from './fixtures/login_page';

test.describe('ST-3 övningar-sida', () => {

  test.beforeEach(async ({ loginPage }) => {
    // Start. Logga in som admin
    await loginPage.login_admin();
  });

  test('.1 Fylla i formulär för övning och rensa det',async ({ page }) => {

    //Gå till sidan för övningar.
    await page.getByRole('link', {name: "Övningar"}).click();
    await (page).waitForURL(/\**\/exercise/)
    
    //Klicka på lägg till ny övning
    await page.getByRole('link', {name: "+"}).click();

    const övningsNamn = "övning1"
    const övningsBeskrivning = "Rolig övning"

    //Lägg till ny övning
    await page.getByPlaceholder("Namn").fill(övningsNamn);
    await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivning);

    //Rensa formuläret
    await page.getByRole('button', {name: "Rensa allt"}).click();
    await page.getByRole('dialog').getByRole('button', {name: "Rensa allt"}).click();

    //Kontrollera att det inte finns något kvar i formuläret
    await expect(page.getByText(övningsNamn)).not.toBeVisible();
    await expect(page.getByText(övningsBeskrivning)).not.toBeVisible();
  });

  test('.2 Lägga till och ta bort en övning',async ({ page }) => {

    //Gå till sidan för övningar.
    await page.getByRole('link', {name: "Övningar"}).click();
    await (page).waitForURL(/\**\/exercise/)
    
    //Klicka på lägg till ny övning
    await page.getByRole('link', {name: "+"}).click();

    const övningsNamn = "Övning1"
    const övningsBeskrivning = "Rolig övning"

    //Lägg till ny övning
    await page.getByPlaceholder("Namn").fill(övningsNamn);
    await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivning);

    await page.getByRole('button', {name: "Lägg till"}).click();

    //Kontrollera övningen finns tillagd
    await expect(page.getByText(övningsNamn)).toBeVisible();

    //Ta bort övningen
    await page.getByRole('link', {name: övningsNamn}).click();
    await page.getByRole('img', {name: "trashcan icon"}).click();
    await page.getByRole('button', {name: "Ta bort övning"}).click();

    //Kolla så att de är bortagna
    await expect(page.getByText(övningsNamn)).not.toBeVisible();
  });

  test('.3 Lägga till, redigera och ta bort en övning',async ({ page }) => {

    //Gå till sidan för övningar.
    await page.getByRole('link', {name: "övningar"}).click();
    await (page).waitForURL(/\**\/exercise/)
    
    //Klicka på lägg till ny övning
    await page.getByRole('link', {name: "+"}).click();

    const övningsNamn = "övning1"
    const övningsBeskrivning = "Rolig övning"

    //Lägg till ny övning
    await page.getByPlaceholder("Namn").fill(övningsNamn);
    await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivning);

    await page.getByRole('button', {name: "Lägg till"}).click();

    //Kontrollera övningen finns tillagd
    await expect(page.getByText(övningsNamn)).toBeVisible();

    await page.getByRole('link', {name: övningsNamn}).click();
    await page.getByRole('img', {name: "edit icon"}).click();

    const övningsNamnNy = "övning2"
    const övningsBeskrivningNy = "Ännu roligare övning"

    //Uppdatera information om övning
    //Lägg till ny övning
    await page.getByPlaceholder("Namn").fill(övningsNamnNy);
    await page.getByPlaceholder("Beskrivning").fill(övningsBeskrivningNy);

    //Spara redigeringar
    await page.getByRole('button', {name: "Spara"}).click();

    //Gå till översikts sida
    await page.getByRole('button', {name: "Tillbaka"}).click();
    await page.getByRole('button', {name: "Lämna sida"}).click();

    await expect(page.getByText(övningsNamnNy)).toBeVisible();
    await expect(page.getByText(övningsBeskrivningNy)).toBeVisible();

    //Ta bort övningen
    await page.getByRole('img', {name: "trashcan icon"}).click();
    await page.getByRole('button', {name: "Ta bort övning"}).click();

    //Kolla så att de är bortagna
    await expect(page.getByText(övningsNamnNy)).not.toBeVisible();
  });

});
# Systemtest

Här dokumenteras systemtest.

Enligt [beslutet](https://git.cs.umu.se/courses-project/5dv214vt23/docs/-/blob/main/Chapters/QA/beslut.md) används [playwright](https://playwright.dev/) för systemtest. Systemtesten finns för att få översiktliga
tester på hela systemet, och hjälper oss att garantera att allt fungerar som det ska. Playwright simulerar en
webbläsare vilket kan skriptas.

När en brytande ändring eller en större förändring är gjord **måste** systemtester
köras för att minska risken att projektet slutar fungera. För tillfället är testerna relativt enkla, men utvecklare **bör** skriva tester när större ändringar sker.

## Körning av systemtest

För att köra systemtesterna lokalt måste du först starta upp hela systemet:

```sh
cd infra
docker compose up -d
```

Därefter kan systemtesterna köras på två olika vis:

```sh
cd frontend
npm run systest
npm run systest:ui
```

Att köra med `:ui` versionen öppnar ett nytt fönster där enskilda test
kan triggas och där man kan se grafiskt vad som händer.

## Körning på pipeline

För att köra på pipelinen klickar du in på den och triggar `systest`-jobbet
manuellt.

## Skrivning av systemtest

Tester har följande allmäna struktur:

```ts
import { expect, test } from '@playwright/test';
import { UserApi } from './fixtures/UserApi';

test.describe('ST-<suite-nr> <namn på test>', () => {
    /**
     * Dokumentation om vad testet gör
     */
    test('.<test-nr> <beskrivning av test>', async ({ page }) => {
        // Setup.

        // 1.
        await page.goto('/');

        // Cleanup.
    });
});
```

Utöver manuell skrivning av tester kan man generera test-kod med
[Playwrights VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). Verktyget öppnar då en ny webbläsare, och
genererar kod för alla handlingar.

### Struktur & namngivning

Alla test ska ligga i `sys-test` och heta `*.spec.ts`. Om man vill göra
direkta slagningar till api:et, skall koden ligga i en egen fil
`sys-test/fixtures/<api-namn>Api.ts`. 

### Fixturer

Fixturerna är 'helpers' för att förenkla slagningar mot backend. Detta kan
vara setup/teardown på test.

### Riktlinjer

- Inte testa hur *gränssnittet* ser ut, utan hur *systemet* det fungerar.
- Specificera tester i steg. T.ex. `// Setup. Skapa en användare`, `// 1. Logga in`,
    `// Cleanup. Ta bort ny användare`.
- Till skillnad från enhetstest behöver inte AAA följas, utan tester får vara
    ganska långa och blanda assertions och handlingar.

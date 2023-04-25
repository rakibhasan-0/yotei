# Systemtest

Här dokumenteras systemtest.

Enligt [beslutet](https://git.cs.umu.se/courses-project/5dv214vt23/docs/-/blob/main/Chapters/QA/beslut.md) används [playwright](https://playwright.dev/) för systemtest. Systemtesten finns för att få översiktliga
tester på hela systemet, och hjälper oss att garantera att allt fungerar som det ska. Playwright simulerar en
webbläsare vilket kan skriptas.

## Körning av systemtest

För att köra systemtesterna lokalt måste du först starta upp hela systemet:


```
cd infra
docker compose up -d
```


Därefter kan systemtesterna köras på två olika vis:


```
npm run systest
npm run systest:ui
```


Att köra med :ui versionen öppnar ett nytt fönster där enskilda test
kan triggas och där man kan se grafiskt vad som händer.

## Skrivning av systemtest

### Struktur & namngivning

Alla test ska ligga i sys-test och heta *.spec.ts.

### Fixturer

### Kodgenerering

Utöver manuell skrivning av tester kan man generera test-kod med
[Playwrights VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). Verktyget öppnar då en ny webbläsare, och
genererar kod för alla handlingar.

### Riktlinjer

- Inte testa hur gränssnittet ser ut, utan hur systemet det fungerar. 

# Översiktlig beskrivning av Error loggning av frontend
I nuläget så loggas errors i frontend vilket skulle krascha hemsidan/applikationen. Vid error så hamnar man på en error sida som visar upp vilket sorts error, samt Försök igen knapp som reloadar sidan, och Tillbaka knapp. Längst ner i Admin sidan finns en knapp under övrigt vilket leder till en grafisk vy av alla errors (tabell), där man kan sortera enligt datum samt ta bort alla loggs.

## Frontend
När ett fel sker i frontend anropar React's error boundary ErrorBoundary.js och ErrorLogic.jsx som komprimerar felet till en json-fil, lägger till datum och tid, och skickar felet till backend's ErrorLogging-api för sparning. Felmeddelandet och stacktrace visas för användaren.

ErrorLogDisplay.jsx visar upp sparade felmeddelanden för användaren. Sortering efter datum och möjlighet att radera alla errorlogs finns även med. För att läsa loggarna navigerar användaren till admin-sidan och trycker på knappen Error-logs.

## Backend
ErrorLogController tar en json med error, info (stack trace) och datum. Stack trace kortas ner för att vara enklare att läsa och ta upp mindre plats. 

## Vidareutveckling
Tanken är att alla sorters error ska kunna loggas. Eventuellt kolla window.onerror för detta ändamål
Få Tillbaka knappen att fungera som den ska för att undvika att användare hamnar i ett tillstånd där de inte kan fortsätta.
Snygga till vyn för loggningstabellen.
Fler enhetstester till Errorlogs och vidareutveckling av nuvarande tester behövs.
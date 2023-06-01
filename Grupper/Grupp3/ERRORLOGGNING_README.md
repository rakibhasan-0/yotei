# Översiktlig beskrivning av Error loggning av frontend
I nuläget så loggas errors i frontend vilket skulle krascha hemsidan/applikationen. Vid error så hamnar man på en error sida som visar upp vilket sorts error, samt Försök igen knapp som reloadar sidan, och Tillbaka knapp. Längst ner i Admin sidan finns en knapp under övrigt vilket leder till en grafisk vy av alla errors (tabell), där man kan sortera enligt datum samt ta bort alla loggs.

## Vidareutveckling
Tanken är att alla sorters error ska kunna loggas. Eventuellt kolla window.onerror för detta ändamål
Få Tillbaka knappen att fungera som den ska för att undvika att användare hamnar i ett tillstånd där de inte kan fortsätta.
Snygga till vyn för loggning tabellen.

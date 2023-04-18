# PO-möten med chapters 18/04/23
## QA
* Systemtester
  * Ärende/ticket är gjort i trello
* Få in nån typ av profiling på frontend och backend
  * QA fixar en guide för hur man gör i intellij
* Spike för att researcha miljön för att kolla prestanda. Kör detta till en ticket.
* Fokus på att skriva tester inför **ny** frontend kod istället för gammal
* Lägga in DoD på tickets
* Konkret DoD
  * (Coverage test på ny kod). Diskuteras. Kolla med QA (Anton)
  * Krav på tester
  * Edge cases
  * Exception handling
* QA ska ta fram en guide för DoD
  * Default DoD. Enskilda Sqauds för sedan lägga till i denna mall.
* PO ska fixa en default trello mall för tickets.
  * Diskutera med QA innan den blir officiell
* Frontend ska skicka standarder på t.ex. fonter färger (det från postern) till QA för att underlätta testning
* QA ska titta på usability kriterium
* Mycket ska dokumenteras, egentligen allt QA relaterat.
  * Gör detta till en ticket och tilldela den till Squad 2 (Gryffin-guardians)
* Petition för att kapa andra namnet i squadet så att det endast blir mythological creatures.

## DevOps + Arkitektur
### Arkitektur
* Arkitekterna vill undersöka om det går att reducera antalet container.
  * Gör en spike för att undersöka om en client-server arkitektur är möjlig. 
  * PO bestämmer vilken Squad som ska göra detta. Gör en ticket av detta.
### Backend
* Backend
  * Spike där det ska undersökas vilka Java RESTful bibliotek det finns. Samt Spring Boot optimering.
  * PO ska göra tickets av dessa och de får även bestämma vilka Squads som ska göra detta.
### Förslag på Ticket
* Ticket: Refaktorisering av kommentarer. Just nu är det blandat svenska och engelska.

### Preliminär spike
Är det nyttigt med en databas spike? Tanken är att undersöka om det finns ett bättre sätt att strukturera databasen. Just nu finns det cirkulära relationer. 

## Backend
* Spike för att se över databassystemet. Se över hur ER-diagrammet ser ut i befintligt system. Det ska vara enkelt att uppdatera ER-diagrammet. Gör man en ändring i databasen ska det vara enkelt att ändra ER-diagrammet
* Någon typ av förhållningssätt i databasen. Tagg i trello för att se att det tillhör databas.
* Dokumentation för källkod. Ta fram mallar för dokumentation. Kör JavaDoc för backend. Frontend oklart.

## Frontend
* Förslag om ändring i design i frontend. Försök kopplat till förslagen som kom i början. 
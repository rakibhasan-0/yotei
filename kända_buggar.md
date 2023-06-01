Mall 

# Namn på sida
## Buggnamn
**Beskrivning:**
**Hur man återskapar bugg:**
**Ev förslag på lösning:**

_________________________________________________________________________

# Skapa övning
## States sparas ej vid reload
**Beskrivning:** om man laddar om sidan medan man skapar en övning så sparas inte det man fyllt i 
**Hur man återskapar bugg:**
- Klicka upp sidan för att skapa en övning
- Fyll i lite information
- Tvinga sidan att ladda om
- Inget kommer vara sparat, alla fält kommer vara tomma
**Ev förslag på lösning:**
- Spara det i local storage

# Redigera övning
## Sparning av alla states
**Beskrivning:** Vid reload medan en användare ändrar uppgifter för en övning så sparas endast namn, beskrivning och tid. Ändringar i taggar och media sparas ej.
**Hur man återskapar bugg:**
- Klicka på en övning.
- Klicka på pennan för att redigera övningen.
- Redigera all information.
- Bevittna hur endast ändringarna hos namn, beskrivning och tid sparats.
**Ev förslag på lösning:**
- Spara resterande data i local storage

# Skapa grupp
## Teckenräknaren
**Beskrivning:** När man fyller i textfältet för gruppens namn så räknar inte teckenräknaren antalet tecken.
**Hur man återskapar bugg:**
- Navigera till grupper.
- Tryck på plusset för att skapa en grupp.
- Fyll i namnet på gruppen i textfältet.
- Se hur teckenräknaren inte ökar (0/180)


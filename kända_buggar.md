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

# Pass/redigera pass
## Navigering direkt till /edit skapar konstiga beteenden
**Beskrivning:**
När man skriver /edit i ett pass så kommer man till det senast redigerade passet och kan uppdatera det.
**Hur man återskapar bugg:**
- Logga in på sidan som valfri användare.
- Navigera till passidan.
- Välj ett pass.
- I url:en för passet byt ut id till edit (http://localhost:3000/workout/512 -> http://localhost:3000/workout/edit).
- Här kan du nu redigera det senaste passet igen och spara ändringarna.
**Ev förslag på lösning:**
En eventuell lösning hade varit att rensa allt i edit sidan när man sparar/avbryter alla ändringar alternativt ta bort /edit och lägga upp redigera sidan som en popup.
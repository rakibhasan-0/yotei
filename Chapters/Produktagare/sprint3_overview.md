# Sprintplanering för sprint 3

Datum: 2023-05-15


## Vad vi lovar att göra

* Det ska gå att skapa pass
  * **Redigera pennan på aktiviteter fungerar ej när man skapar pass.**
  * **Tillbaka knappen när man lägger till en aktivitet ser konstig ut**
  * **Filtrering - man verkar kunna ha från datum längre bort än till datum**
  * **Vid redigering av pass kan man inte se vilka användare som har tillgång till passet även om man angett det när man skapar passet.**
* Export av PDF ska fungera och se bra ut
* Integrera sökfunktionen mot övningar
* Fortsätta implementera ej färdiga funktioner på övningsvyn-sidan. Exempelvis sökfunktioner.
* På skapa övningar sidan ska vi lösa mindre buggar.
* Ge användaren bättre felmeddelanden på hemsidan. Exempelvis när pass/övningar inte går att lägga till.
* Error loggning för frontend.
  * **Kolla med grupp 3**
* Göra klart gruppplaneringssidan.
  * **När man skapar grupp kan man välja från datum längre bort and till datum**
  * **Dålig margin på botten**
  * **Tillbakaknappen är konstig. Blå text**
  * **När man klickar man på gå vidare och det inte går att lägga till så ser man inte felmeddelandet direkt. Utan man måste scrolla automatiskt. (Trodde först att inget hände)**
    * **Felmeddelandet säger också "Planeringen...." istället för "Gruppen..."**
  * **Dropdown pilen är dålig färg, syns knappt.**
* Fixa designfel enligt överenskommelse på återkopplingen (se nedan)
* Fortsätta skriva automatiska tester på komponenter och sidor
* Få feedback på om en tag redan finns när man ska lägga till en tagg
* Enbart admin ska kunna redigera övningar och tekniker


### Överenskomna designfel

#### Design

* Saker är för stora. Inget får plats, dra ner på detaljer.
* Datum på svenskt format istället för amerikanskt format
* Ordningen är tid och datum på “skapa tillfälle”, det ska vara datum och tid.
* Grupp planering -> ändra planering till grupp.
* Mer konsekvent desig mellan sidor
* Sökning på bälten, väljer man flera bälten under filtrering så ska man få “allt som finns på tex grönt och allt som finns på svart om man bockar i grönt och svart”.
* Hur man lägger till taggar skall vara konsekvent över alla sidor. Det skiljer sig idag mellan pass och övningar sidorna. Använd det som finns på teknik/pass sidorna.
* Användarnamnet ska inte vara case-sensitive men lösenordet ska vara det
* när man skapar en övning så finns den inte i listan av övningar för än man uppdaterar sidan
* övningar skall sorteras alfabetiskt i listan av övningar samt att man ska kunna sortera på tid, alltså hur lång en övning är. 
* Mindre luft mellan saker på pass sidan


#### Bilder/video
* Ta bort funktion på media ger ingen “är du säker” ruta, lägg till detta som en popup
  * **Fungerar inte ordentligt**
* När man klickar på “tillbaka” så sparas förändringarna för mediaspelaren trots att man ej klickat på spara knappen
* Tryck ut mediaspelaren till kanten 
* ta bort “1/1” uppe i hörnet, bollarna fyller samma funktionaliteten
* bollar och pilar finns kvar och syns igenom när man tar upp menyn 
* När menyn är upp så ska den kunna stängas genom att man klickar utanför den
* Kunna swipa höger och vänster för att kunna byta mellan videos ifall teknisk görbart
  * **Går ej**
* Position av media spelare ska flyttas

### Ny funktionalitet

Ny funktionalitet läggs in i mån av tid och är inget vi kan lova tills nästa leverans. Det vi diskuterade på mötet var:

* Man ska kunna ställa in “jag vill ha mellan, liten eller stor text” på användarnivå
* Rättigheter för användare
  * **Gjort**
* Filtrering skall sparas på användarnivå så man slipper filtrera om varje gång man går in på en sida
* Paginering
  * **Gjort**
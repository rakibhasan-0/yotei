# Tech Stack

En kortfattad beskrivning av den teknik som används för att utveckla och drifta projektet.

## Frontend

De tekniker som används för utveckling och driftning av frontend.

### React

- Javascript bibliotek

React är ett bibliotek skrivet i Javascript som tillåter användaren att skriva HTML kod som komponenter. Vanligtvis så skriver man en HTML-fil för varje webbplats, och ifall en knapp används på flera ställen måste denna kopieras och placeras i varje fil. React tillåter att standardkomponenter görs i så kallade JSX-filer, dessa komponenter kan därefter återanvändas.

Eftersom dessa komponenter skrivs i Javascript så innebär det att det går att kombinera Javascript-kod och HTML. Något speciellt med React är så kallade states och hooks. Dessa koncept tillåter bland annat om-rendering av komponenter ifall information uppdateras som de är beroende av. Notera att detta är en väldigt kortfattad förklaring.

- Arkitektur(vår implementation!)

React tillåter som sagt att logik skrivs i samma fil(komponent) då det skrivs i Javascript. Detta leder dock till att det blir dålig separation mellan Model och View då det inte finns någon Controller mellan dessa. Det går att uppnå en bra MVC arkitektur med React, men den implementation som vi har gjort har som sagt dåligt separation, så det är mer av en Model-View arkitektur.

- Vite

Det finns en mängd olika bibliotek för att kompilera och köra React. Vi använder Vite för att kompilera och vidareutveckla vårt projekt.

### CSS-moduler

Ett stort problem med ett projekt av denna storleken är att ifall vanliga CSS-filer används så kommer ett klassnamn i en komponent finnas tillgängligt i alla andra komponenter. Detta innebär att man kan av misstag råka överskrida någon annans klass. Detta går att lösa genom att till exempel se till att varje klassnamn är unikt, till exempel att man alltid inkluderar filnamnet i klassnamnet. Detta är dock en dålig lösning och det är därför bättre att använda CSS-moduler.

CSS-moduler skapar unika klassnamn när de importeras. Det innebär att klassnamnet kan göras mycket mer generellt och man garanterar att de inte krockar med någon annan CSS-fil.

## Backend

De tekniker som används för utveckling och driftning av backend.

### Spring Boot

Spring Boot är ett Java-ramverk som underlättar och accelererar processen att skapa Java-baserade webbapplikationer och mikrotjänster.

### JPA

JPA står för Java Persistence API. Den bidrar med definitioner för att kunna implementera Persistence, till exempel spara undan på en databas eller i cloud storage. Den gör inga operationer själv utan använder sig istället av ORM-bibliotek som till exempel Hibernate för att uppnå detta.

Man kan se JPA som en guideline för hur klasser ska se ut för att implementera ORM på rätt sätt.

### Nginx

Är en webbserver som också kan användas som en reverse proxy. Den används för att distribuera requests till backend.

När en förfrågan görs till vår URL så nginx ansvarig för att hantera denna förfrågan och skickade vidare den till rätt server.

## Database

### Postgres

En open source SQL databas. Den används alltså för att lagra all data som används i hela programmet. Den även lagrar och håller koll på information om hur denna information relaterar till annan information.

## Deployment

De tekniker som används för att kunna leverera produkten på en server.

### Docker

Används för att skapa lättviktiga så kallade “containers” för att isolera olika delar av programmet från varandra och därav minska beroendet mellan de olika delarna.

En stor fördel med docker är att dessa containrar kan köras oberoende på system så det är lätt att distribuera över olika datorer och miljöer.

Till exempel körs frontend på en container och API-er på en annan. En containers miljö och vilken kod som skall köras på den specificeras i en Dockerfile.

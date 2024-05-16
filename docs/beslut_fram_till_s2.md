# Beslut gällande Arkitektur

## Beslut om Monolith Arkitektur


Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - Monolith Arkitektur

### Motivation

Att gå från en micro-service Arkitektur till en Monolith Arkitektur för backend-APIet ledde till en märkbar minskning i CPU samt RAM-minne vid runtime. Vi estimerar att ändringen uppnår kundens kriterium på applikationens prestation (1-2GB RAM & ~1 CPU) och kommer därmed att genomdriva denna ändring. Länge övervägdes SpringBoot native som ett alternativ för att förbättra prestandan, alternativt att dela upp APIet i mindre containrar. Emellertid bedömdes SpringBoot native efter en dags testning vara tidskrävande att implementera samt att en rad nackdelar med försämrad byggtid och svårare med mockup testning hade följt. 




# Beslut gällande Frontend
## Ny hemskärm
- **Datum** - 230416
- **Beskrivning** - Vi föreslår en ny startskärm: Grupplanering (Tidigare terminsplanering) Fyller den ett syfte eller blir det bara en landningssida som bidrar till ett extra klick?
- **Alternativ** - Ha kvar startskärmen som den är eller välj en annan startskärm
- **Motivation** - Man ska snabbt kunna gå in och kolla vilket som är sina kommande tillfällen och vilka pass man ska hålla i härnäst.
- **Påverkan** - Front-end

## Definiera: färger, fonter och marginaler i en css-fil
- **Datum** - 230416
- **Beskrivning** - Samla all gemensam stil i en enda css-fil. Färger (primär,sekundär, accent) samt fonter (färg, storlek för texttaggar) och marginaler.
- **Motivation** - Viktigt för att få ett enhetligt gränssnitt. Föregående år har blandat lite vilket gör gränssnittet rörigt.
- **Påverkan** - Front-end

## Styla om inputfälten
- **Datum** - 230416
- **Beskrivning** - Just nu lyser en röd ram runt alla input fält när de är aktiva. Detta vill vi ta bort.
- **Motivation** - Röd används för att markera att innehållet i inputfältet är felaktigt.
- **Påverkan** - Front-end

## Ny design för grupplanering
- **Datum** - 230416
- **Beskrivning** - Byte av sidnamn från terminsplanering till grupplanering. All filtrering sker genom en filtrera-knapp. Korten för ett tillfälle gör det lättare att se gruppfärg och namn samt att ta sig till och kunna koppla pass.
- **Motivation** - Beställare upplevde sidan som svåranvänd och att den saknade funktionalitet. Den designades om för att göra det tydligare och enklare att navigera på sidan.
- **Påverkan** - Front-end

## Inget darkmode
- **Datum** - 230416
- **Beskrivning** - Inget darkmode kommer att implementeras i applikationen. 
- **Motivation** - Inte efterfrågat i år och tillför ingen ytterligare funktionalitet.
- **Alternativ** - Att implementera darkmode. 
- **Påverkan** - Front-end

## Byte av ikoner
- **Datum** - 230416
- **Beskrivning** - Vissa ikoner var otydliga och tillhörde inte samma ikon-familj, alltså de såg väldigt annorlunda ut stilmässigt.
- **Motivation** - Mer enhetligt gränssnitt och lättare att förstå vad knappar gör.
- **Påverkan** - Front-end

## React 
- **Datum** - 230416
- **Föregående års motivering / beskrivning** - Valdes för att göra det smidigt att utveckla dynamiska hemsidor, vilket lämpar sig mycket väl för mobilanpassade gränssnitt. ReactJS gör det enklare att bygga upp hemsidor i form av komponenter, vilket leder till att kodåtervinning kommer naturligt. Komponenterna är enkla att redigera, och gör det möjligt att göra flera ändringar samtidigt. ReactJS är ett bibliotek, men mycket utbyggt, och möjligt att expandera med många verktyg och plugins. Denna utvidgningsbarhet gör att ReactJS egentligen bör anses som ett framework.
- **Vår motivering / beskrivning** - Vi tyckte deras motivering var godtycklig. Vi fortsätter att använda React, då arbetet att komma tillbaka till nuvarande stadie är stort och onödigt. 
- **Alternativ** - Alternativ: Angular: valdes inte på grund av ett antal anledningar, där följande är dem främsta. Angular är ett riktigt framework med mycket funktionalitet och overhead, vilket resulterar i en brantare inlärningskurva. Projektet är aktivt under begränsade perioder där olika grupper kommer behöva lära sig verktygen. Ju mindre tid som behöver avsättas till att lära sig, ju mer kan läggas på projektet i sig. Angular, likt ReactJS kan användas för att bygga SPA's (single page applications), men där Angular är mer anpassad för att göra stora och avancerade applikationer / hemsidor. React Native: mer anpassad för cross-platform native applikationer.
- **Påverkan** - Front-end

## Bootstrap
- **Datum** - 230416
- **Beskrivning** - Bootstrap är ett gratis CSS-ramverk med öppen källkod riktat mot responsiv, mobil-först front-end webbutveckling. Den innehåller HTML, CSS och (valfritt) JavaScript-baserade designmallar för typografi, formulär, knappar, navigering och andra gränssnittskomponenter.
- **Motivation** - Föregående år valde man att använda bootstrap och därför fortsätter vi. Det är effektivt och simpelt, man slipper designa simpla gränssnittskomponenter och kan återanvända dem på många olika ställen. Det finns även fördefinierade funktioner.
- **Alternativ** - Ej obligatoriskt
- **Påverkan** - Front-end

## Funktioner istället för klasser 
- **Datum** - 230416
- **Beskrivning** - Vi kommer att skriva funktionskomponenter i react, ej klasskomponenter. Tidigare har båda använts. Vi kommer inte att ändra alla klasskomponenter till funktioner utan vi fortsätter vårt kodande med hjälp av funktioner.
- **Motivation** - React rekommenderar att man använder sig av funktioner istället för klasser när man utvecklar react-projekt. Det blir också enklare och mer enhetligt i koden, vilket kommer underlätta för utvecklare som ej hållt på med React tidigare. Varför gamla klasskomponenter inte konverteras till funktionskompontener är därför att det bedöms att det är mer möda än vad det är värt. Dessutom kan äldre komponeter komma att bytas ut helt, därför gör vi inte det arbetet i onödan.
- **Alternativ** - Blanda klasser och funktioner
- **Påverkan** - Front-end

## Komponenter ska skapas för återkommande delar
- **Datum** - 230416
- **Beskrivning** - Vi ska skapa komponenter för vanligt förekommande delar i applikationen. Exempelvis knappar, rutor som ska visa ett tillfälle i en planering , sökrutor och inmatningsfält.
- **Motivation** - Genom att skapa komponenter kan vi återanvända kod. Vi behöver inte skriva lika mycket kod och designen kommer att bli mer enhetlig om alla knappar ser likadana ut, alla sökrutor ser likadana ut och så vidare. Det kommer också att bli enklare för utvecklare som inte använt React tidigare att bygga en sida om färdiga komponenter finns.
- **Alternativ** - Dubbelarbete
- **Påverkan** - Front-end

## Migration från CRA (Create React App) till Vite.
- **Datum** - 230424
- **Beskrivning** - Projektet använde sig av byggverktyget/mallen CRA för frontenden innan. Vi har valt att byta till ett annat byggverktyg vid namn Vite.
- **Motivation** - Vi har valt att byta till Vite för att det har mycket snabbare byggtider genetemot CRA. Det gör att personer som jobbar mot frontenden behöver vänta mindre varje gång den skall startas. Byggtiden i pipelinen minskar även. Bytet till Vite kunde även ske sådant att det i praktiken inte innebär någon förändring för de som arbetar mot frontenden eller bygg.
- **Alternativ** - Fortsätta använda CRA, byte till Next.js, byte till T3 stacken.
- **Påverkan** - Minimal påverkan: Front-end, Bygg


## Kategorier i ett pass
- **Datum** - 230416
- **Beskrivning** - I ett pass kan man lägga till aktiviteter och fri text, dessa ska kunna läggas in i kategorier och visas i en lista. 
- **Motivation** - Beställarna vill kunna kategorisera övningar och tekniker i ett pass.
- **Påverkan** - Front-end och back-end

## Mitt konto ska kombinerats med Inställningar
- **Datum** - 230416
- **Beskrivning** - Mitt konto har endast byta lösenord och användarnamn samt logga ut och inställningar är för tillfället en tom sida. Vi anser att det blir lättare att hitta i appen om det slås ihop och allt hamnar under inställningar istället.
- **Motivation** - Dessa kombineras till en för att minska komplexitet på sidan.
- **Påverkan** - Front-end

## Popupfönster för tillägg av aktiviteter i passplanering 
- **Datum** - 230416
- **Beskrivning** - När nya aktiviteter läggs till på ett pass kommer ett pop-up fönster användas för att dela upp funktionaliteten. Tidigare kunde allt redigeras från samma sida.
- **Motivation** - Det var rörigt när allting låg på samma sida. Små knappar för redigering leder till att feltryck är enkla att göra.
- **Påverkan** - Front-end


## Ny arbetsprocess i frontend
- **Datum** - 230416
- **Beskrivning** - En arbetsprocess för frontend har skapats och dokumenterats under README.md i frontend. I grova drag innebär processen att varje gång en förändring till gränssnittet/designen skall göras, så så man ha en godkänd figma-design på vad tänkt göras.
- **Motivation** - Vi har valt att göra så här för förra året så fanns det ingen process på hur förändringar kontrollerades och integrerades. Detta fungerar även ungefär som ett mått på DoD, man är färdig när implementationen ser ut som, och fungerar som prototypen som skapats i figma.
- **Påverkan** - Samtliga chapters

## Workshop ska hållas i React 
- **Datum** - 230416
- **Beskrivning** - En workshop i React för samtliga i projektet ska hållas. Där ska grunder i React tas upp, samt den nya arbetsprocessen redovisas för alla. Figma visas också upp.
- **Motivation** - Detta för att samtliga i projektet ska få en uppfattning om hur React fungerar, samt vara väldigt införstådda i hur man ska jobba då man gör någonting i frontend. Detta kommer att motverka att designen på applikationen divergerar.
- **Påverkan** - Samtliga chapters

## Beslut om React Player

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - React Player

### Motivation

React Player används för att visa video för tekniker, huvudsakligen på grund av dess enkelhet iochmed att det är en inbyggd funktionalitet i React. Vi ser ingen anledning att införskaffa en mer robust och komplex video player just nu, med tanke på att det inte är långa klips som ska visas.

## Abstraktion på söknings API
- **Datum** - 230504
- **Beskrivning** - Skapa ytterligare abstraktion för söknings API:et.
- **Motivation**
  - Gömmer undan logik som en utvecklare inte behöver för att använda sig av API:et.
- **Påverkan** - Samtliga

## Beslut om react-responsive-carousel

Datum - 10/05/23

Chapters - N/A

Grupp -  Dragon

Beslut - Att använda react-responsive-carousel för att visa upp bilder/videor på tekniker/övningar

### Motivation
Vi tog beslutet att använda react-responsive-carousel för att visa upp bilder/videor på tekniker/övningar på grund av samma anledningar som React-Player: bägge verktyg är inbyggda, light weight, react komponenter, samt enkla att använda och förstå.

## Beslut om att inte visa teknikbeskrivning
- Datum - 230505
- Chapters - N/A
- Grupp -  Medusa Maneaters (Grupp 6)
- Beslut - Vi visar inte längre beskrivning ifall man trycker på kortet utan man tas till detalj sidan för en teknik
- Motivation
  - Teknikernas namn är så pass långa och detaljerade att de inte finns något större syfte med att ha en mer detaljerad beskrivning. Därför beslutades det att ifall man trycker på en teknik ska man tas till detaljsidan för en teknik. Informationen visas ändå på detaljsidan.

## Beslut om att inte ha en vinkel mellan färgerna på teknikkorten

- Datum - 230505
- Chapters - N/A
- Grupp -  Medusa Maneaters (Grupp 6)
- Beslut - Bältesfärgerna för en teknik avskilj inte med en vinkel utan vertikalt
- Motivation
  - Implementationen för att få till vinkeln blev för komplicerad och efter samråd med andra grupper kom vi fram till att köra vertikala avdelningar istället. 
  
# Beslut om slå ihop exerciseCreate och exerciseForm


Datum - 23/05/10

Chapters - N/A

Grupp -  Phoenix

Beslut - Slå ihop exerciseCreate och exerciseForm

## Motivation

Vi bestämde oss att slå ihop exerciseCreate och exerciseForm eftersom de var onödigt att dela upp till att börja med och tjorvigt att kommunicera mellan dem. Formuläret som fanns i exerciseForm fyllde ingen funktion utan lade endast till extra komplexitet.

# Beslut om filtrering på se-alla-övningar-sidan
Datum - 23/05/10

Chapters - N/A

Grupp -  Phoenix

Beslut - Ingen filtrering på se-alla-övningar-sidan

## Motivation

Vi bestämde att det inte behövs någon filtrering på se övningar sidan då denna funktionalitet kan uppnås med sökfunktionaliteten som kommer med den nya sök-komponenten. 

# Beslut gällande Backend

## Beslut gällande bälten i backend
- **Datum** - 230505
- **Chapters** - N/A
- **Grupp** - 4 Chimera
- **Beslut** - Att bälten ska hanteras i backenden
- **Motivation**
  - För att bälten ska hanteras lika för samtliga komponenter i frontend ska dessa hämta bälten från backenden. 

## Programspråk

Vid start av projektet kom frågan fram om programspråket ska bytas ut eller använda samma som föregående år.

- **Datum** - 230414
- **Chapters** - N/A
- **Grupp** - N/A
- **Beslut** - Fortsätta att använda Java vid implementation av backend.
- **Motivation**
  - Många personerna som går kursen har tidigare erfarenhet med Java.
  - Om spåket byts ut måste API och kopplingen till databasens implementation också ändras.
  - LTS support fram till 2026

## Koppling till databasen

Beslut gällande om verktyget för koppling till databasen ska ändras eller inte.

- **Datum** - 230414
- **Chapters** - N/A
- **Grupp** - N/A
- **Beslut** - Fortsätta att använda Jakarta Persistence API (JPA) vid kommunikation med databasen.
- **Motivation**
  - Verkar vara ett intuitivt sätt att hantera databasen.
  - Metoderna för att spara klasser till SQL-relationerna verkar fungera bra.

## API

Beslut gällande om Spring Boot fortfarande ska användas som API.

- **Datum** - 230414
- **Chapters** - N/A
- **Grupp** - N/A
- **Alternativ** - **Spring Boot**, Apache Struts
- **Motivation**
  - Spring Boot använder microservices vilket gör att programmet blir löst kopplat och därmed skalbart.
  - Ramverket är enkelt att sätta sig in i.
  - Ger automatisk konfiguration.
  - Apache Struts valdes inte eftersom komponenterna blir hårt kopplade och med det mindre skalbart.


## Beslut om refaktorisering av teknik API

- Datum - 230504
- Chapters - N/A
- Grupp -  Medusa Maneaters (Grupp 6)
- Beslut - Beslut om att refaktorisera teknik API:et
- Motivation
  - Teknik API:et innehöll inte de nya delarna som taggar och bälten. Det var inte heller enligt standarden med RESTFUL. ändelsen `/techniques/all` togs bort och bytes ut mot `/techniques` för GET och POST. Vissa API:er, såsom `/technique/getdesc` togs bort eftersom de inte använts och itne följer RESTFUL standarder.

## Säkerhet

Beslut gällande om säkerheten ska fungera på samma sätt som föregående år.

- **Datum** - 230414
- **Chapters** - N/A
- **Grupp** - N/A
- **Alternativ** - **Java Security**, Spring Security, Apache Shiro
- **Motivation**
  - Använder SHA256 algoritmen för att hasha lösenordet vilket är tillräckligt säkert.
  - Ser ingen motivation för att byta ut SHA256.
  - Erbjuder dokumentation som är lätt att förstå.
  - Uppfyller systemets säkerhetsbehov.
  - Inte nödvändigt att använda Spring Security eller Apache Shiro då kostnaden för att byta metod inte är motiverad.

## Databas

Beslut gällande om PostgreSQL ska fortsätta att användas som databas språk.

- **Datum** - 230414
- **Chapters** - N/A
- **Grupp** - N/A
- **Alternativ** - **PostgreSQL**, MySQL
- **Motivation**
  - De flesta personerna i projektet är redan bekanta med PostgreSQL.
  - Behöver inte göra om hela databasen om vi fortsätter med samma språk som tidigare.
  - Har stöd för många datatyper och har lite mer funktionalitet än MySQL.
## Beslut om SpringBoot Native

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - React Player

### Motivation

SpringBoot native valdes inte för att köra backend-apiet. Detta var något som diskuterades då vi arbetade med att få ner resursanvändningen för server-sidan.  Samtidigt som den skulle minska RAM och CPU användningen märkbart mycket så bedömdes svårigheten att implementera, ökning av byggtiden, svårigheter med mockning för tester (native stödjer inte vissa dynamiska funnktioner) sammanslaget att det skulle vara ovärt för detta projekt. 

# Resultat av databas spike
- **Datum** - 230421
- **Chapters** - N/A
- **Grupp** -  Cyclops
- **Beslut** - Ändra minimalt i databasen
- **Motivation**
  - Det gamla ER-diagrammet stämmde inte överens med verkligheten och behövde uppdateras.
   En bältestabell beslutades att läggas till, samt relationstabeller relaterat till detta kopplat till tekniker och planering.
   Detta görs med anledning av att vara konsekvent kring bältesfärger, som i nuvarande system väljs av en användare i frontend med en color-picker!
   Fler constraints och triggers beslutades att läggas till för att bevara referensintegritet.

## Beslut om many-to-one relation mellan video/bild och tekniker

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - many-to-one relation mellan video/bild och tekniker

### Motivation

Vi tog beslutet på grund av att det låter rimligt att en teknik kan ha flera olika media representationer, men att flera olika tekniker inte delar samma media representationer. Detta är preliminärt då kund har kontaktats och vi väntar på svar.


## Beslut om relation i databasen angående bild/video för tekniker och övningar

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - Att ha en tabell för både video/bilder för tekniker och övningar.

### Motivation

Tanken var att video/bild för övningar respektive tekniker skulle ha sin egna tabell i databasen. Men vid närmare granskning så visade det sig mer gynnsamt att bara ha en tabell, då CRUD operationer blir simplare för komponenter som ska skicka requests för att nå den. Tex så ger detta oss friheten att endast ta emot ett ID från en teknik eller övning i vår media-spelare för att visa upp de relaterade videos och bilder för den på hemsidan. För att förtydliga görs detta möjligt i databasen via en delad integer (delad sequence) mellan övningar och tekniker vilket gör att det aldrig kan ha samma ID; därmed kan det hämtas från samma tabell eftersom ett teknik eller övnings ID aldrig kan vara densamma. 





# Beslut gällande Quality Assurance
## Project Management Verktyg
- **Datum** - 230419
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - Att fortsätta med Maven som project management verktyg.
- **Motivation**
  - Vi beslutade att fortsätta med Maven då ett byte till annat verktyg skulle innebära en viss omkonfiguration av befintlig backend. Detta skulle vara tidskrävande. Det finns erfarenhet av båda verktygen men, det finns inte en stor efterfrågan att byta så det är inte värt mödan. 


## Verktyg för systemtest
- **Datum** - 230419
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - Playwritght används för systemtester.
- **Motivation**
  - Verktyget kan simulera använding av applikationen í en webbläsare. Playwright är lätt att skriva systemtester i och funktionalitet för att underlätta skapandet av systemtester finns tillgängligt i verktyget.


## Framework för testning frontend
- **Datum** - 230425
- **Chapters** - Test/QA
- **Grupp** - N/A
- **Alternativ** - Mocha, **Jest**
- **Motivation**
  - Jest är det framework som rekommenderas för testning, av Facebook(React) [källa](https://legacy.reactjs.org/docs/testing.html). Jest är simpelt och anpassat för React.
  - Mocha valdes bort på grund av att det kräver ytterligare dependencies, samt att det Mocha är utvecklat för Node.js och inte specifikt för React.


## Framework för testning backend
- **Datum** - 230419
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - Vi har beslutat att fortsätta använda JUnit som testing framework för backend.
- **Motivation**
  - Vi beslutade att fortsätta använda JUnit för att kunna behålla befintliga enhetstester för backend. Det är ett stablit framework som de flesta utvecklarna i projektet har erfarenhet av.


## Linting backend

- **Datum** - 230419
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - CheckStyle
- **Motivation**
  - Vi fortsätter att använda CheckStyle med befintlig konfiguration [Suns kodkonvention](https://www.oracle.com/technetwork/java/codeconventions-150003.pdf), med undantag, för att undvika att behöva omformatera befintlig kod. CheckStyle är det bland de mest populära Linting verktyg som finns för Java.
  - Föregående grupps motivation: "För linting av backenden som är skrivet i Java så har vi valt att använda oss utav verktyget CheckStyle. CheckStyle kontrollerar sådant att koden och dokumentationen följer en given standard. Denna standard är något som man själv kan konfiguera och ändra på som användare. Vi har konfiguerat CheckStyle sådant att den följer Suns kodkoventation för Java (https://www.oracle.com/technetwork/java/codeconventions-150003.pdf), med några få undantag.  Anledningen till varför vi valde CheckStyle är eftersom det är, enligt det vi kunde hitta det populäraste och det verktyg som de flesta verkade rekommendera för Java."


## Linting frontend

Beslut kommer...
- **Datum** - YYMMDD
- **Chapters** - Namn på chapter (N/A om ej relevant)
- **Grupp** -  Namn på grupp (N/A om ej relevant)
- **Beslut** - Vad beslutades?
- **Motivation**
  - Vi beslutade att fortsätta använda Java Code Convention







# Beslut gällande DevOps
## Versionshantering

- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** - N/A 
- **Alternativ** - Github, **GitLab**
- **Motivation**
  - Bygg valde **Gitlab** som versionshanteringssystem eftersom det redan har använts i olika projekt inom universitetet och tänker oss att fler kommer att ha använt det minst en gång innan detta projekt. Det fungerar smidigt för att lägga upp CI/CD-pipelines.
  - Även om Github fungerar minst lika bra som GitLab, kan vi inte vara säkra på att alla inom projektet använt det på samma sätt som för Github.   

## Versionshantering
Polyrepo (Delat upp backend, frontend, dokomuntering och infrastruktur)

- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** - N/A
- **Alternativ** - Monorepo, **Polyrepo**
- **Motivation**
  - Valde att dela upp till fyra repon, ett till frontend, ett till backend, ett för att samla dokument samt ett för konfigurationsfiler för infrastruktur. Uppdelningen mellan frontend och backend innebär att en mindre ändring i frontend inte kommer behöva leda till att alla tester i backend behöver köras i CI/CD-pipelinen. Det gör att vi inte slösar onödiga resurser för varje push till main-branch. 
  - Se motivation ovan för varför Monorepo inte valdes iår.


## Test och deployment

- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** -  N/A
- **Beslut** - Upload till docker hub
- **Motivation**
  - Automatisk uppladdning av docker images till docker hub för att göra det lättare att köra kod på servrar. 


## Deployment
- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** -  N/A
- **Beslut** - Automatisk deploy till test
- **Motivation**
  - Automatisk deploy från CI till staging server för CD.


## Deployment
Manuell deployment till produktion

- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - N/A
- **Motivation**
  - Manuell deploy på prod vid varje release för att minska risk för fel under utveckling

## Arbetssätt
- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - N/A
- **Alternativ** - 'Ad hoc' committing, Trunk based development **Github flow**
- **Motivation**
  - Github flow valdes som arbetssätt för att få struktur på git-arbetsflödet
  https://docs.gitlab.com/ee/topics/gitlab_flow.html
  - Eftersom det är ett stort antal personer som arbetar på projektet ansågs det att någon struktur behövs.
  - Trunk based development valdes inte eftersom Github flow ansågs vara bättre


## Arbetssätt  
Minst en person måste review:a koden för att det ska gå att mergea till main branch 

- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - N/A
- **Alternativ** - 0, > 1, **1**
- **Motivation**
  - För att minimera antalet merge-problem och för att hålla god kodkvalitet borde minst en person review:a koden
  - Om ingen kollar igenom blir det i bästa fall lite mindre jobb men problem och låg kodkvalitet kan missas
  - Att kräva att fler än en person måste göra review kräver mer jobb och kan göra processen långsammare, men om någon vill lägga till fler än en person för review är det fortfarande möjligt.


## Linting
- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - NA
- **Alternativ** - NA
- **Motivation**
  - Fixade linting för att projekten ska kunna byggas
  - Fixade SQL script för att kunna köras







# Beslut gällande Produktägare

## Backlog-hantering

- **Datum** - 230413
- **Chapters** - PO
- **Grupp** - N/A
- **Alternativ** - GitLab issues, **Trello**
- **Motivation**
  - **Trello** Då 3st gitlab repon användes (kolla beslutslogg för DevOps) kom PO gruppen fram till att Gitlab issues som tidigare övervägts tappade en del av sina fördelar då projektet ändå blev utspritt. Vid snabb testning kom PO gruppen fram till att Trello verkade smidigare än Gitlab Issues.
  - _GitLab issues_ Projektet använder gitlab för configuration management, därför funderade PO gruppen länge på att använda Gitlab issues för att hantera backlog. Commits kunde där enkelt kopplas till olika tickets. Dock försvårade att DevOps valt 3st olika repos. Det blev inte självklart i vilket repo som vår Gitlab Issue hantering skulle ske. Fördelen med commit kopplat till ticket försvann vilket gjorde att en mer lätthanterlig (användarvänlig) Backlog hantering prioriterades.


## Dokumentation
- **Datum** - 230413
- **Chapters** - PO
- **Grupp** - N/A
- **Alternativ** - Gitlab Wiki, **Eget gitlab repo för dokumentation**
- **Motivation**
  - **Eget gitlab repo för dokumentation** Ett beslut att ha separat gitlab repo för dokumentation valdes då DevOps tyckte att byggandet av projektet underlättades med separata repos för client- respektive server- delen av applikationen. Det blev inte självklart var Gitlab Wiki sidan skulle förläggas så ett separat repo (inuti projektets "grupp av repon") blev enklast.
  - _Gitlab Wiki_ se motivation ovan.

## Tidsläggning för att lära sig nya tekniker etc
- **Datum** - 230417
- **Chapters** - PO
- **Grupp** - N/A
- **Alternativ** - Ingen tid, Fixed tid, **Flexibel tid**
- **Motivation**
  - Vi valde att sätta flexibel tid för code reviews samt research/learning för att på så sätt kan alla själva bestämma efter behov när de skall researcha, lära sig något nytt samt gå igenom kod i Code Reviews.
  - Vi valde inte att utelämna detta helt då det är en viktig del i quality assurance.
  - Vi valde inte schemalägga denna tid då vi inte kan förutspå vilka dagar som det kommer vara mycket för de olika grupperna att göra, samt planera så att allt jobb infaller specifika dagar.

## Dokumentation för Java-backend
- **Datum** - 230418
- **Chapters** - PO
- **Grupp** -  N/A
- **Beslut** - **JavaDoc**
- **Motivation**
  - JavaDoc och dess standard används för metod och funktionskommentarer för backend. Detta valdes då det är en känd
  standard för Java som många känner till. Beslut togs snabbt och därför övervägdes inga alternativ.



## Mall
[mall för beslut](../../Mallar/beslut.md)



# Designmässiga beslut

# Ny hemskärm
- **Datum** - 230416
- **Beskrivning** - Vi föreslår en ny startskärm: Grupplanering (Tidigare terminsplanering) Fyller den ett syfte eller blir det bara en landningssida som bidrar till ett extra klick?
- **Alternativ** - Ha kvar startskärmen som den är eller välj en annan startskärm
- **Motivation** - Man ska snabbt kunna gå in och kolla vilket som är sina kommande tillfällen och vilka pass man ska hålla i härnäst.
- **Påverkan** - Front-end

# Definiera: färger, fonter och marginaler i en css-fil
- **Datum** - 230416
- **Beskrivning** - Samla all gemensam stil i en enda css-fil. Färger (primär,sekundär, accent) samt fonter (färg, storlek för texttaggar) och marginaler.
- **Motivation** - Viktigt för att få ett enhetligt gränssnitt. Föregående år har blandat lite vilket gör gränssnittet rörigt.
- **Påverkan** - Front-end

# Styla om inputfälten
- **Datum** - 230416
- **Beskrivning** - Just nu lyser en röd ram runt alla input fält när de är aktiva. Detta vill vi ta bort.
- **Motivation** - Röd används för att markera att innehållet i inputfältet är felaktigt.
- **Påverkan** - Front-end

# Ny design för grupplanering
- **Datum** - 230416
- **Beskrivning** - Byte av sidnamn från terminsplanering till grupplanering. All filtrering sker genom en filtrera-knapp. Korten för ett tillfälle gör det lättare att se gruppfärg och namn samt att ta sig till och kunna koppla pass.
- **Motivation** - Beställare upplevde sidan som svåranvänd och att den saknade funktionalitet. Den designades om för att göra det tydligare och enklare att navigera på sidan.
- **Påverkan** - Front-end

# Inget darkmode
- **Datum** - 230416
- **Beskrivning** - Inget darkmode kommer att implementeras i applikationen. 
- **Motivation** - Inte efterfrågat i år och tillför ingen ytterligare funktionalitet.
- **Alternativ** - Att implementera darkmode. 
- **Påverkan** - Front-end

# Byte av ikoner
- **Datum** - 230416
- **Beskrivning** - Vissa ikoner var otydliga och tillhörde inte samma ikon-familj, alltså de såg väldigt annorlunda ut stilmässigt.
- **Motivation** - Mer enhetligt gränssnitt och lättare att förstå vad knappar gör.
- **Påverkan** - Front-end

# Tekniska beslut

# React 
- **Datum** - 230416
- **Föregående års motivering / beskrivning** - Valdes för att göra det smidigt att utveckla dynamiska hemsidor, vilket lämpar sig mycket väl för mobilanpassade gränssnitt. ReactJS gör det enklare att bygga upp hemsidor i form av komponenter, vilket leder till att kodåtervinning kommer naturligt. Komponenterna är enkla att redigera, och gör det möjligt att göra flera ändringar samtidigt. ReactJS är ett bibliotek, men mycket utbyggt, och möjligt att expandera med många verktyg och plugins. Denna utvidgningsbarhet gör att ReactJS egentligen bör anses som ett framework.
- **Vår motivering / beskrivning** - Vi tyckte deras motivering var godtycklig. Vi fortsätter att använda React, då arbetet att komma tillbaka till nuvarande stadie är stort och onödigt. 
- **Alternativ** - Alternativ: Angular: valdes inte på grund av ett antal anledningar, där följande är dem främsta. Angular är ett riktigt framework med mycket funktionalitet och overhead, vilket resulterar i en brantare inlärningskurva. Projektet är aktivt under begränsade perioder där olika grupper kommer behöva lära sig verktygen. Ju mindre tid som behöver avsättas till att lära sig, ju mer kan läggas på projektet i sig. Angular, likt ReactJS kan användas för att bygga SPA's (single page applications), men där Angular är mer anpassad för att göra stora och avancerade applikationer / hemsidor. React Native: mer anpassad för cross-platform native applikationer.
- **Påverkan** - Front-end

# Bootstrap
- **Datum** - 230416
- **Beskrivning** - Bootstrap är ett gratis CSS-ramverk med öppen källkod riktat mot responsiv, mobil-först front-end webbutveckling. Den innehåller HTML, CSS och (valfritt) JavaScript-baserade designmallar för typografi, formulär, knappar, navigering och andra gränssnittskomponenter.
- **Motivation** - Föregående år valde man att använda bootstrap och därför fortsätter vi. Det är effektivt och simpelt, man slipper designa simpla gränssnittskomponenter och kan återanvända dem på många olika ställen. Det finns även fördefinierade funktioner.
- **Alternativ** - Ej obligatoriskt
- **Påverkan** - Front-end

# Funktioner istället för klasser 
- **Datum** - 230416
- **Beskrivning** - Vi kommer att skriva funktionskomponenter i react, ej klasskomponenter. Tidigare har båda använts. Vi kommer inte att ändra alla klasskomponenter till funktioner utan vi fortsätter vårt kodande med hjälp av funktioner.
- **Motivation** - React rekommenderar att man använder sig av funktioner istället för klasser när man utvecklar react-projekt. Det blir också enklare och mer enhetligt i koden, vilket kommer underlätta för utvecklare som ej hållt på med React tidigare. Varför gamla klasskomponenter inte konverteras till funktionskompontener är därför att det bedöms att det är mer möda än vad det är värt. Dessutom kan äldre komponeter komma att bytas ut helt, därför gör vi inte det arbetet i onödan.
- **Alternativ** - Blanda klasser och funktioner
- **Påverkan** - Front-end

# Komponenter ska skapas för återkommande delar
- **Datum** - 230416
- **Beskrivning** - Vi ska skapa komponenter för vanligt förekommande delar i applikationen. Exempelvis knappar, rutor som ska visa ett tillfälle i en planering , sökrutor och inmatningsfält.
- **Motivation** - Genom att skapa komponenter kan vi återanvända kod. Vi behöver inte skriva lika mycket kod och designen kommer att bli mer enhetlig om alla knappar ser likadana ut, alla sökrutor ser likadana ut och så vidare. Det kommer också att bli enklare för utvecklare som inte använt React tidigare att bygga en sida om färdiga komponenter finns.
- **Alternativ** - Dubbelarbete
- **Påverkan** - Front-end

# Funktionella beslut 

# Kategorier i ett pass
- **Datum** - 230416
- **Beskrivning** - I ett pass kan man lägga till aktiviteter och fri text, dessa ska kunna läggas in i kategorier och visas i en lista. 
- **Motivation** - Beställarna vill kunna kategorisera övningar och tekniker i ett pass.
- **Påverkan** - Front-end och back-end

# Mitt konto ska kombinerats med Inställningar
- **Datum** - 230416
- **Beskrivning** - Mitt konto har endast byta lösenord och användarnamn samt logga ut och inställningar är för tillfället en tom sida. Vi anser att det blir lättare att hitta i appen om det slås ihop och allt hamnar under inställningar istället.
- **Motivation** - Dessa kombineras till en för att minska komplexitet på sidan.
- **Påverkan** - Front-end

# Popupfönster för tillägg av aktiviteter i passplanering 
- **Datum** - 230416
- **Beskrivning** - När nya aktiviteter läggs till på ett pass kommer ett pop-up fönster användas för att dela upp funktionaliteten. Tidigare kunde allt redigeras från samma sida.
- **Motivation** - Det var rörigt när allting låg på samma sida. Små knappar för redigering leder till att feltryck är enkla att göra.
- **Påverkan** - Front-end

# Arbetsprocessbeslut

# Ny arbetsprocess i frontend
- **Datum** - 230416
- **Beskrivning** - En arbetsprocess för frontend har skapats och dokumenterats under README.md i frontend. I grova drag innebär processen att varje gång en förändring till gränssnittet/designen skall göras, så så man ha en godkänd figma-design på vad tänkt göras.
- **Motivation** - Vi har valt att göra så här för förra året så fanns det ingen process på hur förändringar kontrollerades och integrerades. Detta fungerar även ungefär som ett mått på DoD, man är färdig när implementationen ser ut som, och fungerar som prototypen som skapats i figma.
- **Påverkan** - Samtliga chapters

# Workshop ska hållas i React 
- **Datum** - 230416
- **Beskrivning** - En workshop i React för samtliga i projektet ska hållas. Där ska grunder i React tas upp, samt den nya arbetsprocessen redovisas för alla. Figma visas också upp.
- **Motivation** - Detta för att samtliga i projektet ska få en uppfattning om hur React fungerar, samt vara väldigt införstådda i hur man ska jobba då man gör någonting i frontend. Detta kommer att motverka att designen på applikationen divergerar.
- **Påverkan** - Samtliga chapters











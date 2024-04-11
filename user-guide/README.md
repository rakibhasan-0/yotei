<!-- [Anvandarhandledning.zip](uploads/2fc71d9e0f5e50cc10a70e82a101b350/Anvandarhandledning.zip)

 -->
<!-- [[_TOC_]] -->

# Introduktion

Följande är en grundlig beskrivning av Yotei, planeringsverktyg för Umeå Budoklubb.

Applikationen kan nås från alla enheter med internetuppkoppling via adressen hedwig.cs.umu.se. Gränssnittet är optimerad för mobila enheter.

All text som är markerad med ((dubbla parenteser)) är funktionalitet som inte riktigt finns tillgängligt än, men som kommer att bli tillgängligt i framtiden.

# Inloggning

När du startar applikationen (eller går in på hemsidan) kommer du först fram till en Login sida. Här kan du skriva in ditt användarnamn och lösenord. När du sedan klickar på knappen “Logga in” alternativt Enter kommer du komma in på Startsidan. 

Försöker du nå applikationen utan att logga in kommer du att omdirigeras till inloggningssidan. Du kommer alltså inte åt någon information i applikationen utan att logga in.

Endast Admin har möjlighet att skapa nya användare till applikationen. De kan även ta bort användare och redigera deras roll. De roller som finns är admin, utökad användare samt användare. 

# Navigation

På varje sida efter att du loggat in finns en navigationsmeny i det övre vänstra hörnet av applikationen. Här hittar du till snabblänkar till Grupper, Pass, Övningar, Tekniker, Admin (ifall du är inloggad som admin) och Min sida.

# Pass

På den här sidan kan du se, ändra, ta bort och lägga till pass. Du kan söka bland de pass som finns sparade via sökrutan högst upp på sidan och sortera dem utifrån datum för skapandet av passet. Du söka efter namnet på pass eller taggar som passet har, till exempel “Uppvärmning” eller “Spark”. Pass kan bara redigeras av de som skapat passet och kan också vara privata. Privata pass kan endast ses av de som skapat det och adminroller. Om man vill kan man lägga till andra användare när man skapar ett pass för att ge dem rättighet att redigera passet.

## Taggar

Du kan sätta taggar på passet som du sedan kan använda för att sortera bland alla sparade pass. Om du vill lägga till en tagg kan du antingen söka bland redan existerande taggar, eller skapa en ny. Taggar är case-insensitive, du kan alltså inte skapa taggen “Blå” eller “BLÅ” om “blå” redan finns.

## Lägg till Pass

För att lägga till ett pass, tryck på den runda knappen nere i högra hörnet med “+” på. På sidan “Skapa pass” kan du ge passet namn och beskrivning. Dagens datum kommer automatiskt läggas till, vilket visar när passet skapades. Du kan även lägga till övningar och tekniker ur befintliga med hjälp av knappen “+ Aktivitet”. Det går även att skapa en "fritext"-aktivitet för detta pass med hjälp av knappen “+ Fri text”. 

När du skapar ett pass väljer du om det ska vara privat eller inte. Oavsett kan du lägga till användare till passet som kan redigera och se det. Sist väljer du taggar som ska kopplas till passet genom att klicka på "lägg till tagg". 

## Redigera Pass

För att redigera eller ta bort ett redan skapat pass klickar du på passets namn. Detta tar dig till detaljerad sida om passet. Klicka sedan på redigeringssymbolen (en penna) bredvid passets namn. Där kan du ändra samma detaljer som vid skapandet av ett pass. Om du vill ta bort passet så klicka på ta bort-symbolen (en soptunna). 

## Utvärdering

När passet är skapat går det att lägga till en utvärdering för passet. Det gör man genom att klicka på "Utvärdering"-knappen längst ned på detaljsidan om passet. Alla som kan se passet kan skriva en utvärdering av det. I utvärderingen ingår en 5-skalig gradering av hur passet gick, en positiv kommentar, och en kommentar om vad som var mer negativt med passet.

## Favorisera

Du kan även favorisera ett pass genom att trycka på stjärnan till vänster om passets namn. Dessa pass kan du sedan hitta via Min Sida.

# Aktiviteter

Med aktiviteter menas både Övningar och Tekniker. Genom navigationsmenyn kan du komma till sidor med dessa listade. På dem kan du se, söka efter, ändra, ta bort och lägga till aktiviteter. 
Det är dock vissa skillnader när det kommer de olika sidorna som beskrivs nedan. 

## Övningar

Utförs ofta på träningspass. Det är allt ifrån armhävningar och situps till avslappningsmoment och meditation. Dessa sparas med en valfri tid. Du kan även lämna kommentarer på övningen.

Sökning på övningar sker med fritext och taggar (valfritt). Övnings-sidan kan även sorteras efter namn eller tid. 

För att lägga till en övning, tryck på knappen med ett +. Du kan ge övningen ett namn, beskrivning, en tid, taggar ((samt bild ifall så önskas)). Om du vill fortsätta skapa övningar kan du klicka i det alternativet, då kommer du att stanna på sidan för att skapa övningar och inte dirigeras vidare vid skapandet av övningen. I så fall finns också ett alternativ att rensa redan ifylld text.

För att redigera eller ta bort en övning, klicka på övningens namn. För att redigera, tryck på redigeringssymbolen (en penna) bredvid namnet. Där kan du ändra samma detaljer som vid skapandet av en övning. För att ta bort övningen, tryck på soptunnan bredvid redigeringssymbolen.

## Tekniker

Teknikerna är tekniker som används inom Budo. De är moment och rörelser som ofta är bundna till en viss bältesgrad.

Sökning på tekniker sker med fritext och taggar (valfritt). Här kan man också filtrera resultaten på bälten, samt Kihon (grundtekniker). 

För att lägga till en teknik, tryck på knappen med ett +. Du kan ge tekniken ett namn, beskrivning, om den är Kihon eller inte, bälten kopplade till tekniken, taggar ((samt bild ifall så önskas)). Om du vill fortsätta skapa tekniker kan du klicka i det alternativet, då kommer du att stanna på sidan för att skapa tekniker och inte dirigeras vidare vid skapandet av tekniken. I så fall finns också ett alternativ att rensa redan ifylld text.

För att redigera eller ta bort en teknik, klicka på teknikens namn. För att redigera, tryck på redigeringssymbolen (en penna) bredvid namnet. Där kan du ändra samma detaljer som vid skapandet av en teknik. För att ta bort tekniken, tryck på soptunnan bredvid redigeringssymbolen.

# Användarroller 
## Admin

Som admin kan du skapa,redigera och ta bort pass (alla pass), övningar samt tekniker. 

Du kan också utföra administrativt arbete via en egen sida. Den når du genom navigationsmenyn på alla sidor efter att du loggat in.

Du kan importera och exportera övningar och tekniker, skapa nya användare för inloggning och hantera de redan existerande användarna.

Import till databasen sker endast i tillägg. Importering misslyckas om JSON filen innehåller en teknik eller övning med ett namn som redan finns i databasen, eller om något fält är tomt. Filerna som importeras ska vara JSON-filer med samma format som det som ges vid export.

## Utökad användare 

Som utökad användare kan du skapa pass och övningar. Du kan redigera och ta bort de pass som du själv har skapat, övningar kan du redigera och ta bort alla. Du kan varken skapa, redigera eller ta bort tekniker.

## Användare

Som vanlig användare kan du skapa pass samt redigera och ta bort de pass som du själv äger eller är medlem på. Du kan varken skapa, redigera eller ta bort tekniker eller övningar. 

# Grupper

En sida som visar en grov terminsplanering för olika grupper där alla kommande pass för den gruppen finns listade tillsammans med en kort beskrivning. Du kan skapa en grupp genom att klicka på "+".  Där får man välja ett namn för gruppen, vilka bälten som ingår i gruppen, samt mellan vilka två datum som gruppens planering sträcker sig. Sedan får du välja på vilka dagar under denna planering som tillfällen ska skapas, och vilken tid. Exempelvis varje söndag klockan 17.00 under denna period. En grupp består egentligen av en lista med tillfällen.

## Tillfälle
Ett tillfälle måste vara kopplat till en grupp. Vid skapandet av en grupp mass-skapas tillfällen på de valda dagarna. Men du kan även skapa ett extratillfälle kopplat till en viss grupp, genom att trycka på "+". När man skapar eller redigerar ett tillfälle kan man länka denna till ett redan befintligt pass, eller skapa ett nytt pass. 

## Filtering

Listan av alla grova planeringar sorteras efter datumet de ska hållas och starttid. Datumet som står ovanför ett tillfälle refererar till den dag då tillfället ska hållas. 

Du kan filtrera grovplaneringen efter vilka grupper du är intresserad av. Denna filtering sparas mellan gångerna, så har man angett en grupp kommer vyn alltid att filtreras efter denna grupp tills någon annan grupp (eller ingen grupp) har valts. 

# Min Sida

Sidan nås via navigationsmenyn. Här finns flikarna favoritpass, pass och inställningar. 

- Favoritpass: här kan du se och söka bland alla dina favoritpass. 
- Mina pass: här kan du se och söka bland alla dina pass. 
- Inställningar: här kan du byta lösenord och användarnamn samt logga ut. 

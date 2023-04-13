<!-- [Anvandarhandledning.zip](uploads/2fc71d9e0f5e50cc10a70e82a101b350/Anvandarhandledning.zip)

 -->
<!-- [[_TOC_]] -->

# Introduktion

Följande är en grundlig beskrivning av Yotei, planeringsverktyg för Umeå Budoklubb.

Applikationen kan nås från alla enheter med internetuppkoppling via adressen hedwig.cs.umu.se. Gränssnittet är optimerad för mobila enheter.

All text som är markerad med ((dubbla parenteser)) är funktionalitet som inte riktigt finns tillgängligt än, men som kommer att bli tillgängligt i framtiden.

# Inloggning

När du startar applikationen (eller går in på hemsidan) kommer du först fram till en Login sida. Här kan du skriva in ditt användarnamn och lösenord. När du sedan klickar på knappen “Logga in” alternativt Enter kommer du komma in på Startsidan. 

Om du inte redan är inloggad och försöker komma åt applikationen kommer du att automatiskt omdirigeras till inloggningssidan. Utan att logga in kan du alltså inte se varken pass, övningar eller tekniker.

Endast Admin har möjlighet att skapa nya användare till applikationen. De kan även ta bort användare och deras adminrättigheter.

## Startsida

Efter att du loggat in är detta den första sida du kommer till. Härifrån har du möjligheten att navigera till fyra olika sidor: Pass, Övningar, Tekniker, och Termin.

# Navigation

På varje sida efter att du loggat in finns en navigationsmeny i det övre vänstra hörnet av applikationen. Här hittar du samma alternativ som på startsidan, snabblänkar till Pass, Övningar, Tekniker, Min Sida och Planering. Det står även med vilken användare du för tillfället är inloggad.

Om du är inloggad som Admin finns det ett extra alternativ.

# Pass

På den här sidan kan du se, ändra, ta bort och lägga till pass. Du kan söka bland de pass som finns sparade via sökrutan högst upp på sidan och sortera dem utifrån datum för skapandet av passet. Du söka efter namnet på pass eller taggar som passet har, till exempel “Uppvärmning” eller “Spark”. Pass kan bara redigeras av de som skapat passet och kan också vara privata. Privata pass kan endast ses av de som skapat det. Om man vill kan man ge andra användare specifik rättighet att ändra ett pass.

## Taggar

Du kan sätta taggar på passet som du sedan kan använda för att sortera bland alla sparade pass. Om du vill lägga till en tagg kan du antingen söka bland redan existerande taggar, eller skapa en ny. Taggar är case-insensitive, du kan alltså inte skapa taggen “Blå” eller “BLÅ” om “blå” redan finns.

## Lägg till Pass

För att lägga till ett pass, tryck på den runda knappen nere i högra hörnet med “+” på. På sidan “Skapa pass” kan du ge passet namn, författare och beskrivning. Dagens datum och tid kommer automatiskt läggas till, vilket visar när passet skapades. Du kan även lägga till övningar och tekniker ur listan eller skapa egna aktiviteter som inte sparas med hjälp utav knapparna “+ Aktivitet” och “+ Fri text”.

## Redigera Pass

För att redigera eller ta bort ett redan skapat pass klickar du på passets namn. Detta tar dig till detaljerad sida om passet. Klicka sedan på redigeringssymbolen (en penna) bredvid passets namn. Där kan du ändra samma detaljer som vid skapandet av ett pass.

## Utvärdering

När passet är skapat går det att lägga till en utvärdering för passet. Dessa utvärderingar är dolda till en början. Alla som kan se passet kan skriva en utvärdering av det. I utvärderingen ingår en 5-skalig gradering av hur passet gick, en positiv kommentar, och en kommentar om vad som kan förbättras till nästa gång.

## Favorisera

Du kan även favorisera ett pass genom att trycka på stjärnan till vänster om passets namn. Du kan även favoritmarkera ett pass via dess detaljvy, även där genom att trycka på stjärnikonen. Dessa pass kan du sedan hitta via Min Sida.

# Aktiviteter

Med aktiviteter menas både Övningar och Tekniker. Genom huvudmenyn och navigationsmenyn kan du . Båda sidorna är i stort sett identiska, och på dem kan du se, söka efter, ändra, ta bort och lägga till aktiviteter. Skillnaden är i definitionen av aktiviteterna:

## Övningar

Utförs ofta på träningspass. Det är allt ifrån armhävningar och situps till avslappningsmoment och meditation. Dessa sparas med en standard tid. Du kan även lämna kommentarer på övningen.

## Tekniker

Teknikerna är unika för just Umeå Budoklubb. De är moment och rörelser som ofta är bundna till en viss bältesgrad.

För att lägga till en aktivitet, tryck på knappen med ett +. Du kan ge aktviteten ett namn, beskrivning, taggar samt bild ifall så önskas. För övningar kan du även lägga till en standard tidsåtgång.

För att redigera eller ta bort en aktivitet, klicka på aktivitetens namn. För att redigera, tryck på redigeringssymbolen (en penna) bredvid namnet. Där kan du ändra samma detaljer som vid skapandet av en aktivitet. För att ta bort aktiviteten, tryck på soptunnan bredvid redigeringssymbolen.

# Admin

Som admin kan du utföra administrativt arbete via en egen sida. Den når du genom navigationsmenyn på alla sidor efter att du loggat in.

Du kan importera och exportera övningar och tekniker, skapa nya användare för inloggning och hantera de redan existerande användarna.

Import till databasen sker endast i tillägg. Importering misslyckas om JSON filen innehåller en teknik eller övning med ett namn som redan finns i databasen, eller om något fält är tomt. Filerna som importeras ska vara JSON-filer med samma format som det som ges vid export.

# Grovplanering

En sida som visar en grov terminsplanering för olika deltagargrupper där alla kommande pass finns listade tillsammans med en kort beskrivning. Du spara en plan som en kort text om vilket tema passet ska ha. Du kan även länka en planering till ett specifikt pass ur databasen, eller skapa ett nytt pass.

Listan av alla grova planeringar sorteras efter datumet de ska hållas och starttid. Passen ordnas i grupp utifrån vilken vecka de ska hållas. Datumet som står ovanför en grupp grovplaneringar refererar till den dag då passen skall hållas.

Du kan filtrera grovplaneringen efter vilka deltagargrupper du är intresserad av. ((Endast den tränare som ska lära ut till en viss grupp kan skapa pass i grovplaneringen för dem.))

((Genom att klicka på kalenderikonen i menyn kan du navigera till ett specifikt datum i planeringen.))

# Min Sida

Sidan nås via navigationsmenyn. Här kan du logga ut, byta lösenord, och byta användarnamn. Det finns även flikarna Favoritpass där du kan se och söka bland alla dina favoritpass, och Mina pass där du kan se och söka bland alla pass du själv har skapat.

((Under fliken Inställningar hittar du olika inställningar så som möjligheten att aktivera dark-mode.))
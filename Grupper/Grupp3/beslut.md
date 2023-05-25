## Mall
[mall för beslut](../../Mallar/beslut.md)

# Beslut om Monolith Arkitektur


Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - Monolith Arkitektur

## Motivation

Att gå från en micro-service Arkitektur till en Monolith Arkitektur ledde till en märkbar minskning i CPU samt RAM-minne vid runtime. Vi estimerar att ändrinngen uppnår kundens kriterium på applikationens prestation (1-2GB RAM & ~1 CPU) och kommer därmed att genomdriva denna ändring.

# Beslut om SpringBoot Native

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - React Player

## Motivation

SpringBoot native valdes inte. Samtidigt som den skulle minska RAM och CPU användningen märkbart mycket, så är tiden för att implementera den för lång för detta projekt. 


# Beslut om React Player

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - React Player

## Motivation

React Player används för att visa video för tekniker, huvudsakligen på grund av dess enkelhet iochmed att det är en inbyggd funktionalitet i React. Vi ser ingen anledning att införskaffa en mer robust och komplex video player just nu, med tanke på att det inte är långa klips som ska visas.

# Beslut om hur video är kopplad till teknik

Datum - 10/05/23

Chapters - N/A

Grupp -  Dragon

Beslut - Som det är nu

## Motivation




# Beslut om react-responsive-carousel

Datum - 10/05/23

Chapters - N/A

Grupp -  Dragon

Beslut - Att använda react-responsive-carousel för att visa upp bilder/videor på tekniker/övningar

## Motivation
Vi tog beslutet att använda react-responsive-carousel för att visa upp bilder/videor på tekniker/övningar på grund av samma anledningar som React-Player: bägge verktyg är inbyggda, light weight, react komponenter, samt enkla att använda och förstå.


# Beslut om many-to-one relation mellan video/bild och tekniker

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - many-to-one relation mellan video/bild och tekniker

## Motivation

Vi tog beslutet på grund av att det låter rimligt att en teknik kan ha flera olika media representationer, men att flera olika tekniker inte delar samma media representationer. Detta är preliminärt då kund har kontaktats och vi väntar på svar.


# Beslut om relation i databasen angående bild/video för tekniker och övningar

Datum - 24/04/23

Chapters - N/A

Grupp -  Dragon

Beslut - Att ha en tabell för både video/bilder för tekniker och övningar.

## Motivation

Tanken var att video/bild för övningar respektive tekniker skulle ha sin egna tabell i databasen. Men vid närmare granskning så visade det sig mer gynnsamt att bara ha en tabell, då CRUD operationer blir simplare för komponenter som ska skicka requests för att nå den. Tex så ger detta oss friheten att endast ta emot ett ID från en teknik eller övning i vår media-spelare för att visa upp de relaterade videos och bilder för den på hemsidan. För att förtydliga görs detta möjligt i databasen via en delad integer (delad sequence) mellan övningar och tekniker vilket gör att det aldrig kan ha samma ID; därmed kan det hämtas från samma tabell eftersom ett teknik eller övnings ID aldrig kan vara densamma. 




# Beslut om visuellt gränssnit för att visa upp front end errors från error logging

Datum - 25/06/23

Chapters - N/A

Grupp -  Dragon

Beslut - Grafiskt gränssnitt (tabell och knapp) för att visa upp frontend errors lagrade i databasen

## Motivation

Just nu finns det en knapp längst ner på Admin sidan med namnet 'Error Logs'. När man klickar på den så ska en tabell av alla error lags lagrade i databasen visas upp i formatet Error meddelande, stacktrace, datum. funktionaliteten är där, men det finns funderingar kring ifall vyn ska förbättras (dimensioner och utseende) samt att det är tänkt att finnas ett sätt att filtrera via datum (inte ännu implementerat). Detta är en produkt av att vi har rushat produktionen för att hinna till deadline inför leveransen. Vidare utveckling skulle därmed vara att implementera ett sätt att filtrera via datum, göra så att inte flera av exakt samma error kan existera samtidigt, samt förbättra vyn rent visuellt. Hursomhelst är tanken att denna funktionalitet endast är reserverat för Admin användare. Så det kanske inte behöver vara extremt snyggt. 




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

Tanken var att video/bild för övningar respektive tekniker skulle ha sin egna tabell i databasen. Men vid närmare granskning så visade det sig mer 



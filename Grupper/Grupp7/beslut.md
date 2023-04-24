## Mall
[mall för beslut](../../Mallar/beslut.md)


# Beslut
## Sökningsfunktions Spike dokumeterad

- **Datum** - 230421
- **Chapters** - N/A
- **Grupp** -  Kraken
- **Beslut** - Beslutades att dokumnetera resultatet av vår spike.
- **Motivation**
  - Vi valde att skapa ett eget dokument kring det vi kom fram till under vår spike. Detta då vi ej skulle ha någon redovisning och troligen skulle få tickets kring nya områden nästa vecka, för att inte spiken skulle vara onödig valde vi då att dokumentera allt. 

# Beslut
## Sökfuntion 
- **Datum** - 230424
- **Chapters** - N/A
- **Grupp** - Kraken-7, Minotaur-8
- **Alternativ** - Implemntera nya sökningsfunktionen i de gamla API, **Implemntera nya sökningsfunktionen i ett nytt API**
- **Motivation**
  - Vi valde att skapa ett nytt API där all sökningsfunktion ska läggas, eftersom vi ska implementera ny funktionalitet som inte kommer använda föregående sökningslogik.
  - Det var så mycket ny logik som skulle implementeras och som inte använde det som fanns i de redan befintliga API:erna. Vi ansåg att det skulle bli smidigare att implementera i ett nytt API och inte röra det gamla, om detta i efterhand inte blir bra kan man alltid flytta den nya logiken tillbaka till de gamla API:erna.
  - Pros: All sök-funktionalitet samlad, bättre översikt över sökning och lättare för nästa grupp att ta över.
  - Cons: Ny teknologi för att använda databasen.

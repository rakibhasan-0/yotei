## Mall
[mall för beslut](../../Mallar/beslut.md)


# Beslut
## Sökningsfunktions Spike dokumeterad

- **Datum** - 230421
- **Chapters** - N/A
- **Grupp** -  Kraken
- **Beslut** - Beslutades att dokumnetera resultatet av vår spike.
- **Motivation**
  - Vi valde att skapa ett eget dokument kring det vi kom fram till under vår spike. Detta då vi ej skulle ha någon redovisning och 

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

## Funktionskomponenter
- **Datum** - 230501
- **Chapters** - N/A
- **Grupp** - Kraken-7
- **Alterativ** - Klasskomponenter, **Funktionskomponenter**
- **Motivation**
  - Eftersom det inte går att använda hooks vid Klasskomponenter så skapas problem som lätt går att fixa med hjälp av Funktionskomponenter.
  - Funktionskomponenter används även överallt i hela systemet vilket gör det mer konsistent.

## Abstraktion på söknings API
- **Datum** - 230504
- **Chapters** - N/A
- **Grupp** - Kraken-7
- **Beslut** - Skapa ytterligare abstraktion för söknings API:et.
- **Motivation**
  - Gömmer undan logik som en utvecklare inte behöver för att använda sig av API:et.

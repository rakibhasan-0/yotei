## Mall
[mall för beslut](../../Mallar/beslut.md)


# Beslut gällande backend

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


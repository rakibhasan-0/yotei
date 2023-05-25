# Arkitektur
# Produktägare
# Quality assurance
# Backend
# Frontend

## Beslut om visuellt gränssnit för att visa upp front end errors från error logging

Datum - 25/05/23

Chapters - N/A

Grupp -  Dragon

Beslut - Grafiskt gränssnitt (tabell och knapp) för att visa upp frontend errors lagrade i databasen

### Motivation

Just nu finns det en knapp längst ner på Admin sidan med namnet 'Error Logs'. När man klickar på den så ska en tabell av alla error lags lagrade i databasen visas upp i formatet Error meddelande, stacktrace, datum. funktionaliteten är där, men det finns funderingar kring ifall vyn ska förbättras (dimensioner och utseende) samt att det är tänkt att finnas ett sätt att filtrera via datum (inte ännu implementerat). Detta är en produkt av att vi har rushat produktionen för att hinna till deadline inför leveransen. Vidare utveckling skulle därmed vara att implementera ett sätt att filtrera via datum, göra så att inte flera av exakt samma error kan existera samtidigt, samt förbättra vyn rent visuellt. Hursomhelst är tanken att denna funktionalitet endast är reserverat för Admin användare. Så det kanske inte behöver vara extremt snyggt. 




# DevOps
## Systemtest i pipeline 
- **Datum** - 23-05-26
- **Chapters** - Bygg
- **Grupp** - NA
- **Alternativ** - NA
- **Motivation**
  - Ska fixa så att systemtester endast körs vid mergerequests tills vidare eftersom det tar upp för mycket tid på pipeline. Systemtesterna går fortfarande att köra lokalt under utveckling. 

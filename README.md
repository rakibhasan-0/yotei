# Backend

## Sätt upp backend lokalt
---
### Via docker
1. Ladda ned docker desktop <https://www.docker.com>
2. Klona backend och infra repon till din maskin.
3. Gå in i **backend** mappen via valfri terminal.
4. Kör `sh build.sh`
5. Navigera till **infra** mappen.
6. Kör `docker compose up --build

För att stänga ned dockern 
1. ctrl+c för att avsluta processen.
2. kör `docker compose down -v`
   
Om docker körts lokalt tidigare kan oanvända containers mm. att behöva rensas innan körning. Detta görs med kommandot `docker system prune`

### Via IntelliJ
1. Klona backend och infra repon till din maskin.
2. Navigera till `backend/api/src/main/resources/`
3. Uppdatera variablerna i **application.yml** med värdena från docker-compose.yml som finns i **infra** mappen. t. ex ska `${POSTGRES_USER}` ändras till ``psql`` som kommer från raden `- POSTGRES_USER=psql` i docker-compose.yml.
4. Värdet på POSTGRES_HOST byts ut till servern som kör databasen, i skrivande stund skulle det se ut såhär: ```url: jdbc:postgresql://imp.cs.umu.se/yotei```
5. Navigera till `backend/api/src/main/java/se/umu/cs/pvt`
6. Kör main metoden i ApiApplication.java i intelliJ.

**NOTERA!**
1. För att testköra frontend tillsammans med den lokala backend som satts upp måste **.env** i frontend mappen uppdataras genom att ändra raden `USE_IMP_SERVER="true"` till `USE_IMP_SERVER="false"`. 

---

## Exportformat i JSON för övningar/tekniker
### Format för övningar

```json
{
    "exercises": [
      {
        "name": "Övning #1",
        "duration": 5,
        "description": "En övning",
        "tags": ["ben", "kondition"]
      },
      {
        "name": "Övning #2",
        "duration": 6,
        "description": "En annan övning",
        "tags": ["bröst"]
      }
    ]
}
```

### Format för tekniker

```json
{
    "techniques": [
        {
          "name": "Teknik #1",
          "description": "En teknik",
          "tags": ["sparkar", "avancerad"]
        },
        {
          "name": "Teknik #2",
          "description": "En annan teknik",
          "tags": ["fall", "enkel"]
        }
    ]
}
```

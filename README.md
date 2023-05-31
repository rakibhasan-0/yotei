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

## Vid arbete med backends databas

När arbete utförs på backend som möjligtvis förändrar strukturen på den befintliga databasen är det några viktiga saker att tänka på:

* Kolla över ER diagrammet och kolla att alla relationer inte påverkas negativt av din ändring.
* Stämma av med någon medlem i Backend och diskutera implementationen och dess påverkan.
* Om ytterligare relationer läggs till i databasen eller ändringar sker, se till att uppdatera detta i ER-digrammet.
* Utför implementationen.

Det är värt att notera att förfriska kunskaperna om hur databaser samt dess språk fungerar då detta kommer att vara till stor hjälp.

Databasen hittas och ändras på följande [länk](https://drive.google.com/file/d/1f41RYjCnPTYaiUNRlPZrmHsyy15M7DXc/view?usp=sharing)

## Vid arbete med API:et i backend

Mycket av arbetet i backend innefattar ändringar eller tillägg av nya resurser via API:et. Därför är det viktigt att alla endpoints uppdaterade och att de hållar samma kvalité utöver hela systemet. För att detta ska vara möjligt ska följande punkter följas:

* Var konsekvent med vägen till resursen (URL) för endpointen. 
* Följ riktlinjerna för ett RESTful API, där en endpoint har hög Cohesion. 
* Se till att inte skapa överflödiga endpoints.
* Dokumentera varje ny endpoint med samma standard som övriga i projektet.
* Kom ihåg att uppdatera tillagda/ändrade endpoints på Swaggerhub.
* Uppdatera ändringarna i diagrammet för endpoints.

När resurser hämtas från API:et kommer de att exporteras i JSON format. Dessa format kan se olika ut beroende på vad som hämtas. Dessa format har blivit sammanställda på följande hemsida och uppmanas att kolla på innan dessa används: 

https://app.swaggerhub.com/apis-docs/Calzone/PvtOpenApi/1.0.0

![Schema över alla endpoints i backend](Schema över Endpoints.png)
*Schema över alla endpoints i backend*

## RESURSER:

PostgreSQL: https://www.postgresql.org/

JPA: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/

Spring Boot: https://spring.io/projects/spring-boot

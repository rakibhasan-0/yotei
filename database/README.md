# Säkerhetskopiering av databas
  Kör `backup_db.sh fil.sql` för att spara databasen till `fil.sql`
** Återställning av databas
	Kör `restore_db.sh fil.sql` för att återställa databasen från `fil.sql`
** Schemaläggning av kopior
	För detta kan t.ex. cron användas.
	Använd `crontab -e` för att öppna schemaläggningsfilen.

	Här är ett exempel där kopior tas var 5:e dag med datumet på slutet av filnamnet.
	```shell
	0 0 */5 * * backup.sh backup_$(date +\%Y\%m\%d).sql >/dev/null 2>&1
	```

# Databas
## Guidelines
- Ändringar i databasstrukturen sker endast via init-filen. Inte via osparade kommandon eller GUI-verktyg.
- Synkronisera DB-ändringar med backend så API:erna inte går sönder.

### DB Credentials
- Användarnamn: psql
- Databas: yotei
- Lösenord: yotei123
- Port: 5432 (standard)

## Lokal testning av databas
När du gjort dina ändringar i `init.sql`, kör först `docker compose down -d --volumes` följt av `docker compose up -d --build psql` för att starta databasen.

Hur man loggar in:
- `psql -h localhost -p 5432 -U psql -d yotei`

För att stänga databasen:
- `docker compose down -d --volumes`.

Som det ser ut nu:
- Om en användare som redan finns läggs till kommer *id* i databasen att ökas även om inget läggs till.

Ex: 
1. id=1 för första användaren
2. En användare läggs till som redan finns.
3. Nästa användare som läggs till som är giltig får id=3.

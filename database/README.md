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


Dev db credentials:
- Användarnamn: c5dv214_vt22_dev
- Databas:      c5dv214_vt22_dev
- Server:       postgres (postgres.cs.umu.se)
- Port:         5432 (standardport)
- Lösenord:     j79piCPvkHTc

Hur man loggar in:
- ```psql -U c5dv214_vt22_dev -h postgres c5dv214_vt22_dev```

Hur man bygger om databasen (krävs att man står i database/src mappen):
- ~~```java -cp "../lib/postgresql-42.3.4.jar" INIT_DB.java```~~

   ```shell
   psql -h localhost -p 5432 -U psql -W yotei -f database/init.sql
   ```

Som det ser ut nu:
- Om en användare som redan finns läggs till kommer *id* i databasen att ökas även om inget läggs till.

Ex: 
1. id=1 för första användaren
2. En användare läggs till som redan finns.
3. Nästa användare som läggs till som är giltig får id=3.

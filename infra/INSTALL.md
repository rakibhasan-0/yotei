# Installation
1. Installera certbot
   **APT (Debian, Ubuntu etc.)**
   ```shell
   sudo apt install certbot python3-certbot-nginx
   ```
2. Konfigurera certbot
   1. Skapa certifikat för webbservern
	  ```shell
	  sudo certbot certonly --standalone -d example.org
	  ```
   2. Lägg till automatiska förnyelser
	  Detta kan utföras med förslagsvis `cron`
	  ```shell
	  sudo crontab -e
	  ```
	  Klistra in och justera detta längst ner i filen
	  ```conf
	   @daily certbot renew --pre-hook "docker-compose -f $SÖKVÄG_TILL_COMPOSE-FILEN down" --post-hook "docker-compose -f $SÖKVÄG_TILL_COMPOSE-FILEN up -d" 2>/dev/null
	  ```
3. Konfigurera nginx
   Öppna nginx/nginx.conf

   Byt ut `*.cs.umu.se` mot Ert värd- och domännamn

4. (Frivilligt) Konfigurera inloggningsuppgifter
   Öppna `docker-compose.yml` med en textredigerare och ändra `POSTGRES_*`-raderna till valfritt värde (se till att alla rader stämmer överens med varandra).

5. Installera Docker
   **APT (Debian, Ubuntu etc.)**
   ```shell
   sudo apt install docker.io docker-compose golang-docker-credential-helpers
   ```

6. Lägg till användaren till Docker-gruppen
   ```shell
   sudo usermod -aG docker [användare]
   ```
   Lägger till användaren till Docker-gruppen, vilket gör att denna kan använda Docker.
   Om användaren som läggs till är inloggad, behöver denne logga ut och in igen.

7. Bygg containrar
   Se till att Ni är i samma katalog som `docker-compose.yml` kör skriptet som bygger alla containrar
   ```shell
   ./build_containers.sh
   ```

8. Starta containrarna med docker-compose
   ```shell
   docker-compose up -d
   ```
9. Installera PostgreSQL för DB-konfiguration
   ```shell
   sudo apt install postgresql
   ```
   Denna behövs endast för importen i nästa steg, kan avinstalleras efteråt.

10. Importera SQL
   ```shell
   psql -h localhost -p 5432 -U psql -W yotei -f database/init.sql
   ```
   Inloggningsuppgifterna finns lagrade i `docker-compose.yml`. Vid körning av kommandot ovan kommer det frågas efter ett lösenord, vilket är det som `POSTGRES_PASSWORD` är satt till i filen.

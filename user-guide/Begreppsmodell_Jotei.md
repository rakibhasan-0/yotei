# Introduktion

Jotei är en applikation för Umeå Budo klubbs tränare. Applikationen är till för att skapa planeringar och träningspass för dessa.
 
_Snabbförklaring_
Tränare kan skapa Grupper, som består av tillfällen (ex: onsdagar kl 17) som kan kopplas till ett pass (en planering av vilka aktiviteter som ska utföras under ett tillfälle).

## Grupper (planering)
Dessa används för att skapa en stor _översiktlig planering_ för en enskild grupp, oftast över en termin. Här får man ange ett namn på en grupp samt välja bältesfärger som deltar i gruppen. Ett start och slutdatum för gruppen anges, sedan på vilka veckodagar mellan dessa datum som **tillfällen** ska skapas för gruppen. För varje dag får man ange en tid.

_Exempel_
Vi skapar en grupp som heter “Grön och gul barn”, med bälten grön och gul barn. Vi väljer startdatum den 1a januari och slutdatum den 3e maj. Varje onsdag under denna period vill vi ha en träning, ett tillfälle, klockan 16.00. Då klickar vi i onsdag, och väljer klockslaget 16.00 för detta. Vi trycker spara, och nu skapas ett tillfälle varje onsdag under denna period för denna grupp, klockan 16.00. 

## Tillfälle 
Ett tillfälle är alltid kopplat till en grupp. **Grupper** används för att skapa dessa grupper men också som ett smidigt sätt att skapa flera tillfällen. Det går dock att lägga till ett enskilt tillfälle, ifall man som tränare vill ha ett extra tillfälle någon gång för någon grupp. Det måste då kopplas till en specifik grupp. 

_Exempel_
Vi har vår grupp “Grön och gul barn”. Men nu vill vi ha ett extra tillfälle den 5e april, klockan 17.00. Då skapar vi ett tillfälle, kopplat till grupp “Grön och gul barn”, den 5e april klockan 17.00. Nu uppdateras vår grupp med detta tillfälle. 

## Pass 
Ett pass är en planering för en träning. Här kan tränare planera hur ett träningstillfälle ska se ut, så som vilka **aktiviteter** som ska utföras, i vilken ordning samt hur länge. Ett pass kan vara privat eller publikt. Om man väljer att passet är privat så visas det bara för ägaren samt tillagda användare. 

Ett pass kan kopplas till ett **tillfälle**, så att tränare enkelt kan planera vad som ska göras vid vilket tillfälle. Detta kan göras när man skapar eller redigerar ett tillfälle. 

_Exempel_
 Vi har vår grupp  “Grön och gul barn”. Till vårt extratillfälle den 5e augusti vill vi planera hur träningen ska se ut. Vi skapar ett nytt pass där vi planerar vilka aktiviteter som ska ske. Vi kopplar det passet till vårt tillfälle.

## Aktiviteter 
Aktivitet är ett samlingsnamn för tekniker och övningar. Under pass kan man även välja att lägga till fri text som en aktivitet, men det är inget som sparas som varken teknik eller övning. 

### Tekniker
Tekniker är tekniker som används i Budo. Dessa finns i databasen för applikationen samt går att skapa nya. En teknik är kopplad till ett  bälte. Tekniker kan också vara något som kallas för ***Kihon***. Kihon är grundtekniker för ett visst bälte, alltså de tekniker som man måste klara av för att få ett visst bälte. 

För att få ett högre bälte måste man vid varje tillfälle visa att man klarar kihon för de bälten som är under. På så sätt räknas Kihon för ett lägre bälte till de högre bältena också, även fast de inte är kopplade till just det bältet. 

### Övningar 
Övningar är mer vanliga övningar, så som joggning eller hoppa x-hopp. Det kan också vara andra Budo-träningstyper som inte är tekniker. Dessa finns också i databasen för applikationen samt går att skapa nya. 

## Taggar
I applikationen används något som heter taggar. Taggar består av ett namn, och kan kopplas till ett pass, en övning eller en teknik. Taggarna syns i samband med dessa pass,övningar eller tekniker, men de används också vid sökning på pass,övningar och tekniker. 

## Roller
I Jotei finns det 3 olika roller som en användare kan ha

- Admin kan skapa och hantera användare. Välja/ändra roll. Utöver detta kan admin skapa, redigera och ta bort pass, övningar samt tekniker. Det måste alltid finnas minst en admin-användare. 

- Utökad användare kan skapa och redigera sina egna skapade pass samt övningar. En utökad användare kan inte redigera alla övningar, och kan heller inte redigera eller skapa tekniker. 

- Vanlig användare kan skapa och redigera sina egna skapade pass. En vanlig användare kan inte skapa eller redigera varken övningar eller tekniker. 

## Sökning i applikationen
På sidorna pass, övningar och tekniker finns sökfunktionalitet i applikationen. Det finns en sökruta där man kan söka med fri text. I denna sökruta kommer förslag på taggar som matchar fritexten upp, där kan man välja att lägga till taggar som man också vill ska vara med i sökningen. Viktigt här är att det bara dyker upp taggar som är kopplade till den sida man är på. Söker man exempelvis bland pass så kommer det bara upp förslag på taggar som är kopplade till ett pass. 

Filtrering finns också på sidorna och fungerar lite olika: 
- Pass: Här kan man söka på pass mellan en viss tidsperiod, samt filtrera på favoritmarkerade pass. 
- Övningar: Här kan man sortera övningar efter namn eller längd på övning.  
- Tekniker: Här kan man välja vilka bälten man vill ska ingå i sökningen, samt filtrera på Kihon-tekniker. 


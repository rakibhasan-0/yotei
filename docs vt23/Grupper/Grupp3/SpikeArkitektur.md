Datum 2023-04-24

Under arkitektur-spiken researchade vi docker samt möjligheterna att göra native images för att begränsa användningen av minne samt CPU.
Efter testning kom vi fram till att man 1. kan slå ihop flera dockers (det blir en/flera sorts monolith) till en och samma och på så sätt köra färre instanser av JVM, eller 2. skapa native images utav spring applications.
De båda alternativen reducerade både RAM- och CPU-användning avsevärt.
Vårt förslag blev att fortsätta med ena eller båda alternativen.
Vi tillade att om man väljer att gå vidare med att skapa monoliter bör gateway och database uteslutas ur sådana monoliter av säkerhetsskäl. Detta eftersom varje monolit kommer bli en Single Point of Failure. Man bör även paketera källkoden för att behålla projektstrukturen.


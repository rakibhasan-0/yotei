# Spike restful (19-04-23)
## Kan Spring Boot optimeras?
* Ge kriterier, förslag på hur man kan optimer
* Det finns massor av imports som inte används. Däremot verkar compilatorn ignorera dessa så det verkar inte spela någon roll (prestandamässigt)
* Det går säkert att optimera men, vi anser att det stora problemet ligger i att det är flertalet docker-containers. Vi tror att optimera spring boot inte kommer ge så mycket. Det är redan lightweight och optimeringen kommer inte att ge tillräckligt mycket relativt tiden vi måste lägga ner för att förstå hur man gör. 
* Possible AOT optimering?

## Bör vi byta? Vad skulle detta innebära i effort?
* Nej, vi anser inte att vi bör byta. Spring Boot är redan lightweight och som sagt, vi tror att det stora problemet sitter i docker-containers. Vi tror att Efforten som går åt att förstå hur spring boot fungerar är för stor gentemot rewarden.

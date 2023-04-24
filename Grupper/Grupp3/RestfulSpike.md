# Spike restful (24-04-23)
## Ska arkitekturen ändras eller behållas?
* Efter nogrann testing (6GB RAM MS vs. < 2GB RAM Mono) valdes det att det är nödvändigt att ändra arkitektur för att uppnå kundens krav.

## Hur mycket behöver göras om/ändras?
* Själva arkitekturändringen från Micro-Services till Monolith framställer inga stora ändringar förutom omarrangering av filsystemet.

## Hur mycket kan återanvändas?
* Ändringen kräver att API filerna mergas ihopp, och därmed försvinner ett par filer (de som anroppade klassen via SpringApplication). Utöver det så kan allt annat återanvändas.
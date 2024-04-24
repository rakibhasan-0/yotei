# Spike arkitektur (24-04-24)
Under arkitektur-spiken researchade vi docker samt möjligheterna att göra native images för att begränsa användningen av minne samt CPU.

## Ska arkitekturen ändras eller behållas?
* Efter nogrann testing (6GB RAM MS vs. < 2GB RAM Mono) valdes det att det är nödvändigt att ändra arkitektur för att uppnå kundens krav.

## Hur mycket behöver göras om/ändras?
* Själva arkitekturändringen från Micro-Services till Monolith framställer inga stora ändringar förutom omarrangering av filsystemet.
* database och gateway bör förslagsvis hållas separata då man mergar APIer i.o.m att monoliten blir en single point of failure.

## Hur mycket kan återanvändas?
* Ändringen kräver att API-filerna mergas ihop, och därmed försvinner ett par filer (de som anroppade klassen via SpringApplication). Utöver det så kan allt annat återanvändas.

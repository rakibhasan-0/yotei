## Mall
[mall för beslut](../../Mallar/beslut.md)


## Överblick över beslut
[Arkitekt beslut VT23](### Arkitekt beslut)

[Separat UserSettings-API](### Separat UserSettings-API)

[Övergång från Login till User](### Övergång från Login till User)

[Byte av kategorier till taggar](### Byte av kategorier till taggar)

[Från Microservices till Diamond](### Från Microservices till Diamond)

[Microservices beslut](### Microservices beslut)


## Beslut om arkitektur från VT23

{
### Arkitekt beslut
* Datum - 230427

* Chapters - Arkitekt.

* Grupp - N/A

* Alternativ - Monolith, Client-Server, Micro Services

* Motivation:
Efter krav från kunden att minska användningen av RAM och processor gjorde det två spikes med syfte att fördjupa sig i hur arkitekturen i dåvarande program påverkade prestandan. Resultatet var att ett arkitektur byte skulle kunna vara lösningen.

Under spiken undersöktes resursanvändningen för varje container (~12st), SpringBoots påverkan, SpringBoot Native och det konstaterades att varje container drar onödigt mycket bas-resurser och att om dem skulle vara möjligt att slå ihop ett antal containrar så skulle prestandan öka.

Innan bytet av arkitekturen låg bas-driften av programmet på 3% CPU & 6 GB RAM, krav från kunden var att få ner det till 0.5-1% CPU & under 2 GB RAM.

Efter spiken byttes det till Client-Server, dem ~12st containrarna slogs ihop till 5st och resursanvädningen minskade till 0.27 % CPU & 1.2 GB RAM.
Anledningen till att Client-Server valdes var för att Client-Server ligger mellan Monolith och Micro-Services. Det drar ner på resursanvändningen men är fortfarande mer flexibelt att utveckla i stora teams, vilket är passande för oss.

Att det inte gicks vidare med Native var pågrund av att det var krångligt att implementera och att vi redan fått ner resursanvändningen tillräckligt mycket för att matcha kundens krav genom att slå ihop API:er

Innan byte:
Gateway,
Exercise,
Plan,
Session,
Tag,
Techniques,
User,
UserSettings,
Workout,
FrontEnd,
Nginx,
Database.

Efter byte:
Nginx,
Gateway,
Api (Övriga apier ligger under denna),
Frontend,
Database.

Anledningen till att Micro-Services inte valdes var till stor del pågrund av att prestanda problemet låg i för många antal containrar i drift och att vikten av skalbarheten (som tidigare kurs haft inte ansågs vara fullt lika nödvändigt).

Att Monolith inte valdes var för att ett Monolith system kan vara svårt att utveckla om man är många personer, vi är 53st och det är viktigt att vi enkelt ska kunna utveckla produkten tillsammans. 
}

## Beslut om arkitektur från VT22

{
### Separat UserSettings-API

- **Datum** - 220517
- **Chapters** - N/A
- **Grupp** - 1 - Quattro Formaggio
- **Alternativ** - Ha modulen under **user**
- **Motivation**
  - Eftersom alla nuvarande API:er och moduler är splittrade och individuella är detta en mer konsekvent design. 
  - Namnet är för att i framtiden kanske man vill göra ett **Settings-API**
  - Det kändes inte så intuitivt att ha den under _User_ det kan hända att UserSettings expanderar och blir relativt stort.
}


{
### Övergång från Login till User

- **Datum** - 220512
- **Chapters** - N/A
- **Grupp** - 1 - Quattro Formaggio
- **Alternativ** - Separat användar-modul, **User tar över Login**
- **Motivation**
  - Login modulen i sig själv är sån liten service i sig själv att det mer är ett verifierande av användare, den kompletterar den kommande user modulen.
  - Att ha Login separat från User hade varit lämpligt om det var en större service. Som det ser ut nu blir det krångligare att sammankoppla om det är separata.
}


{
### Byte av kategorier till taggar

- **Datum** - 220428
- **Chapters** - N/A
- **Grupp** - 5 - Verona
- **Alternativ** - kategorier, **taggar**
- **Motivation**
  - Vi valde att ta bort kategorier från begreppen och istället kalla allting taggar då det ändå finns i samma tabeller efter att ER-diagrammet byggts om. 
  - Kategorier är synonymt med taggar. 
}


{
### Från Microservices till Diamond

* **Datum** - 220419
* **Chapters** - [Arkitekt](/courses-project/5dv214vt22/-/wikis/Chapters/Namn)
* **Grupp** - N/A
* **Alternativ** - Microservices, **Diamond**
* **Motivation**
  * **Varför byte vi från Microservices till Diamond**
    * Med Diamond undviker vi <span dir="">dependencies</span> mellan services
    * <span dir="">Snabbare att komma igång.</span>
    * <span dir="">Enklare att förstå för utvecklare.</span> 
}

{
### Microservices beslut

- **Datum** - 220412
- **Chapters** - [Arkitekt](/Chapters/Namn)
- **Grupp** - N/A
- **Alternativ** - **Microservices**, Repository, Client-server, Pipe & filter, MVC, Layered
- **Motivation**
  - **Varför Microservices**

    **Fördelar**
    * <span dir="">Inkrementell implementation av enskilda tjänster</span>
    * <span dir="">Snabb release-cycle passar vårt arbetssätt</span>
    * <span dir="">Varje tjänst är självständig och kan bytas ut eller uppgraderas var för sig</span>
    * <span dir="">Enkelt att dela upp i olika task</span>
    * <span dir="">Enkelt att förstå och applicera</span>
    * <span dir="">Potentiella fel på en specifik tjänst är inte förödande för systemutvecklingen</span>

    **Nackdelar**
    * <span dir="">Med flera uppdelade tjänster finns en högre risk att kommunikation mellan olika tjänster misslyckas.</span>
    * <span dir="">Måste ha hög belastning i åtanke (låg risk)</span>
  - **Varför inte Repository** Orimligt att implementera, kravet på säkerhet är svårt att uppfylla och fördelningen av komponenter blir också problematisk. Arkitekturen är även svår att skala.
  - **Varför inte Client-server** Olika servrar tillämpar olika tjänster. Detta passar inte beställarens mål med tjänsten eftersom beställaren förväntar att tjänsten enbart körs på en server.
  - **Varför inte Pipe & filter** Ej rimligt eftersom pipe & filter enbart arbetar sekventiellt. Eftersom applikationen kommer och skall bolla fram och tillbaka mellan backend och frontend. Vi valde därför att inte gå med pipe & filter som arkitekturmönster för projektet.
  - **Varför inte MVC** Svårt att skala upp projekt till att bli större med denna arkitektur. Lämpar sig inte om man vill ta bort/ändra på små delar då det mesta är beroende av varandra.

    En annan anledning till varför vi valde att inte gå med MVC som arkitekturmönster är då majoriteten av deltagarna i kursen har använts MVC i flera tidigare projekt. Då vi som blivande ingenjörer vill utvecklas och testa på andra arkitekturmönster valdes MVC bort.
  - **Varför inte Layered** Layered arkitektur var första valet för detta projekt. Layered ansågs vara passande då man kan lägga front-end, API, säkerhet, modell och databas i olika lager.

    Problemet med layered arkitektur som gjorde att den valdes bort var att den främst är svår att dela upp över en grupp i storlek som kursen hade. Eftersom att lagrena är beroende av varandra behövs mycket koordination som är svårt för en sådan stor grupp. Layered arkitektur valdes bort mot micros service arkitektur för att uppnå mer modularitet och minska coupling mellan modulerna i programmet.

    Beslutet om att byta från layered arkitektur gjordes efter kritik från både beställare och kursansvarig.
}

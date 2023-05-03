## Mall
[mall för beslut](../../Mallar/beslut.md)



# Beslut

{
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

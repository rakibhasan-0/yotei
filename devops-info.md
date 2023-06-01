Denna fil innehåller följande: 

* Hur det hänger ihop på gitlab, vilka repos som finns och vad som finns i respektive repo.
* Hur pipeline fungerar i respektive repo.
* Hur systemtesterna är uppsatta i pipeline.
* Hur och varför vi använder Dockerhub.
* Hur Gitlab runners konfigurerats.
* Våra beslut, varför vi tagit besluten och vad vi borde gjort annorlunda/tips till nästa år.
* Vårt arbetssätt

Dokumentation kring konfiguration på gitlab gäller GitLab Community Edition 15.11.4. 

# Terminologi

- **MR**: Merge request
- **CD**: Continous deployment

# Docs-repot
Samlingspunkt för all dokumentation. Filer relaterade till DevOps-chapter är:
* git-guideline.md - Guideline till för projektmedlemmarna på kursen.
* Chapters/DevOps/beslut.md - beslut som tagits under perioden med motiveringar.
* .gitlab-ci.yml - konfigurationsfil för pipeline på docs.

## Pipeline
Pipeline i docs-repot deploy:ar api-dokumentationen på utvecklingsservern(imp). Vi använder [mkdocs](https://www.mkdocs.org/) för autogenererad dokumentation. 

Efter deployment, givet att allt är uppe, ska dokumentationen nås på följande länk: https://imp.cs.umu.se:2443/api-docs/

# Infra-repot
Innehåller konfiguration för:
* Databasen
* Proxyn (nginx)

Viktigaste filen är docker-compose.yml. Det är den filen som definierar vilka images som ska användas i applikationen och på vilka portar respektive container ska nås. Det är den filen som möjliggör att alla containers som behövs för applikationen kan startas upp på ett kommando. Används under deployment.

Systest-mappen innehåller script som körs under systest-steget i pipeline.

## Pipeline
Pipeline i infra-repot har tre stadier:
* build 
* systest 
* publish

build- och systest-stadierna körs vid merge-requests. Under build-steget ges en FEATURE-tag som pushas till dockerhub så att systest-steget kan testa på den imagen. Det gör att om någon av de stegen inte går igenom så kommer inte LATEST-imagen skrivas över.

Endast när både build- och systest-steget går igenom och koden kan merge:as till main branch körs publish-steget, som kommer bygga om imagen, tagga med LATEST och push:a till dockerhub.


# Backend-repot
I detta repo finns all kod relaterad till backend, bash-skript för lokal utveckling, information hur man utvecklar lokalt och en `.gitlab-ci.yml`-fil som specifierar hur pipelinen ser ut.  

## Pipeline

I pipelinen körs jobben: 
`tests`, `build_gateway_image`, `build_api_image`, `systest`, `publish_gateway_image`,
`publish_api_image`, `deploy`, och `deploy_javadoc`.

`tests`, `build_gateway_image`, `build_api_image` och `systest`
körs enbart då en förändring skett i en java-relaterad fil:
- `pom.xml`
- `lint_check.xml`
- `checkstyle-supressions.xml`
- `api/**/*`
- `gateway/**/*`

Detta minskar belastningen på pipelinen och gör den snabbare.

Bygg-jobben kör bara docker-filerna, vilka i sig startar upp
maven och bygger javakoden. Därför har tests-jobbet en cache som inte delas med andra job, men finns för att göra tests-jobbet snabbare.

### Merge till main
Vid skapandet av en **MR** till main körs jobben `tests`, `build_gateway_image`, `build_api_image` och `systest`. Alla dessa **måste** passera innan en feature-branch får mergas till main. Jobbet `tests` körs för att försäkra att att alla enhetstester passerar. Jobben `build_gateway_image` och `build_api_image` körs för att försäkra att ändringarna inte förstör byggandet av docker-bilderna. Slutligen körs jobbet `systest` för att försäkra att ändringarna är kompatibel med resten av systemet.   

Vid bygg-jobben publiceras docker-bilder specifika till
feature-branchen, för att möjliggöra referenser från andra
systemtest. Dessa heter då `staging-$FEATURE_BRANCH`.

När merge-requesten mergeas körs publish-jobben och deploy
jobben. Då publiceras de nya `api:latest` samt `gateway:latest`
docker bilderna till DDockerHub.# Därefter
hämta# testservern alla senaste bilder från _DockerHub_,
och startar om backend:en med den mergeade versionen.
`deploy_javadoc` kopierar den genererade javadoc:en till
testserverns `~/pvt-web/javadoc`, vilket gör den
synlig _'på webben'_.

# Systemtester

> Jag kastade min blick mot kodbasens strid, \
> Poly-repo, playwright, två fiender så vid, \
> I deras förgörelse låg min största nöd.
>
> Med Poly-repo föll jag i stridens grepp, \
> Versionshanteringens krig, en prövning svår. \
> Playwrights snärjande tester, som band mig snart, \
> De förvandlade min kod till krossad sepp.
>
> Databasförstöraren, en ondskefull fiende, \
> Med sina hänsynslösa attacker, en mörk makt. \
> Men jag stod fast och gav inte upp min frände, \
> Med mod och envishet, jag vände stridens akt.
>
> Men låt mitt minne ej blekna, mina gärningar stå, \
> Som en hyllning till modet att skapa och förstå. \
> Mitt namn är Ismenios Demonax, mitt livslånga verk \
> ska leva för alltid så.
> 
> --- Systest manifesto, Ismenios Demonax, 1842

Vi använder oss av systemtester för att kunna påvisa att en ändring
i koden inte skulle ta ner systemet helt när den mergeas. Enhetstester täcker inte alla möjliga fel som kan uppstå. Det hjälper oss att översiktligt testa systemet, och gör att vi kan garantera att allt fungerar som det ska.
**Utan systemtest har vi inga intyg eller ens försökt bevisa att 


Systemet testas kontinuerligt vid varje MR på backend- samt
infra-repot (för att testa databasen). Detta har krävt stora ändringar i pipelinen för att få det att fungera.


Säg att man gör en brytande ändring i en tabell i databasen, på feature-branchen `115_A`. Samtidigt ändrar man hur backenden binder till tabellen på feature-branchen `115_B`. För att systemtesterna ska gå igenom, måste `[db:115_A]` skrivas i git commit-meddelandet i backend repot, samt `[backend:115_B]` i commit-meddelandet för infra-repot.

Om inga versioner anges i commit-meddelandet antas det att MR är kompatibel med `latest`.

Ideellt borde systemtesterna köras på `frontend` också, men eftersom det knappt finns några tester just nu behövs det ej.

För att skala upp i framtiden behöver ett val göras gällande vilket redskap man ska använda för att skriva tester (curl duger inte jättelångt).

Konfigurationen och testerna ligger just nu i `infra`-repot, och hämtas då med `curl`/`wget` via _GitLab_'s publika API i alla andra repo:ns systemtest-job. Detta kräver en environment-variabel `$INFRA_REPO_ACCESS_TOKEN` är bunden för CI pipelines i _GitLab_.

För att köra systemtesterna lokalt måste först alla kontainrar laddas ned. Du kan köra `docker pull` för att hämta de senaste **merge**:ade ändringarna. Om du har lokala ändringar så måste du först bygga alla kontainrar lokalt. Därefter kan systemtesterna köras i `infra`-repot, genom att skriva:
```sh
./systest/run-systest.sh 1
```

# Konfiguration

## GitLab Runners

För att köra GitLab CI på skolans gitlab behövs manuella runners.
En uppdaterad guide för det kan hittas på [docs.gitlab.com](https://docs.gitlab.com/runner/install/). Efter runners har blivit tillagd på varje repo, så behöver man 
ändra för att köra flera jobb samtidigt. Detta görs genom att öppna `/etc/gitlab-runner/config.toml` och lägga till följande under relevant del:

```toml
concurrent = 8
```

Varje runner behöver också dessa saker för att fungera korrekt

```toml
[[runners]]
...
limit = 8
request_concurrency = 8
...
[runners.docker]
    ...
    volumes = ["/var/run/docker.sock:/var/run/docker.sock"]
    network_mode = "host"
    ...
```

Dessa ändringar gör att 8 jobb kan köras samtidigt (kan ändras om man vill till ett annat antal), samt att docker i docker fungerar korrekt.

## DockerHub

Skolans GitLab har ingen möjlighet att lagra dockerbilder, så docker
hub bör användas. Genom att skapa ett gemensamt konto för kursen
så kan det användas för att ladda upp till via CI. Rimligtvis
börs ett epost konto skapas för kursen som alla har tillgång
till som används för att skapa docker hub konto.

# Beslut
Denna sektion innehåller en översiktlig beskrivning om besluten som togs i bygg-chaptret utifrån de förutsättningarna som fanns. Alla beslut har loggats under Chapters/DevOps/Beslut.md, men här kommer vi även ta upp eventuella problem som kommit upp och hur de löstes, samt vad vi gjort annorlunda om vi gjorde om det.

### Versionshanteringsystem
Första beslutet som togs i bygg var att behålla gitlab som plattform för projektet då tidigare år redan hade valt att använda det och för att det känns mest familijärt för folk. Det fungerade bra att sätta upp pipeline och runners, finns bra dokumentation och är i princip samma funktionalitet finns både på github och gitlab.

Största förändring som gjordes var att gå över från att ha ett repo till att ha fyra olika: frontend, backend, infrastruktur och documentation. Det gjorde det mer effektivt under utveckling, eftersom en mindre ändring i frontend inte skulle leda till att backend behövde testas eller byggas om. Framförallt i början när backend var uppdelat i micro services och runners i pipelinen behövde bygga 8 containers bara för backend. Svårigheterna med att dela upp frontend och backend i olika repos var att det försvårade att sätta upp systemtester. 

### Workflow

Gitlab-flow valdes som arbetssätt. Några grupper hade problem i början med att lösa konflikter för varje rebase innan merge request, men det löste sig när vi uppdaterade git-guidelines. I efterhand kanske det skulle vara bra att ha en workshop för hur projektet ska jobba med versionshanteringen. [Learn git branching](https://learngitbranching.js.org/) hjälpte för några grupper, men långt från alla hann göra den.

QA ville att minst två personer skulle review:a koden innan merge. Detta gick inte att sätta upp som krav i gitlabs inställningar för versionen som kördes och därför satte vi att minst en person ska review:a koden och endast personer från DevOps-chapter skulle få merge:a till main branch. För att koden skulle få merge:as måste merge-requesten vara godkänd. Det fungerade bra.

### Deployment
Vi fick två servrar till projektet och valde att ha en som host:ade utveckling(imp) och en för produktion(apollo). Ny kod integrerades automatiskt till imp under sprints, och vid leverans deploy:ades applikationen manuellt till apollo, så att kund skulle kunna testa produkten. Det fungerade bra. 

### Arbetssätt

<p>Det beslutades att projektet skulle använda sig av [Github Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html#github-flow-as-a-simpler-alternative) som ett uniformt arbetsätt. Detta för att man ansåg att struktur var viktigt i ett så här stort projekt.</p>

<p>Detta innebar att man arbetade genom att skapa utvecklingsgrenar utifrån main, för varje ticket. Under utveckling uppmuntrades det att kontinurerligt köra Rebase mot main för att hålla sin untvecklings gren uppdaterad och undvika enorma och komplicerade merges mot slutet. Detta innebor även att main på både Front-end och Back-end var skyddad och ej gick att uppdatera utan att arbeta via utvecklingsgrenar.</p>

<p>Vid en merge begärde vi även att minst en person skulle gå igenom utvecklingsgrenens förändrigar för att minimera antalet merge-problem och hålla en god kodkvalitet. Vi valde även att endbart personer i bygg kunde godkända en merge, för att återigen försäkra oss om att inga problem och buggar tog sig in på main.</p>

<p>Vi valde även att alla commits på utvecklingsgrenen skulle squashas vid en merge med main. Detta innebär att alla Commits på en utvecklinggren slås ihop till ett enda Squash Commit. Detta Squash Commit följer följande mall:</p>

	%{title}

	Merge branch '%{source_branch}' into '%{target_branch}'

	Reviewed by %{reviewed_by}
	Approved by %{approved_by}

	Description
	%{description}

	Branch commits
	%{all_commits}

Där "title" är titeln på hopslagningen och "description" är beskrivningen som man angett i hopslagningen.


### Tips till nästkommande år/vad vi hade kunnat göra annorlunda

* Sätt upp en tydlig strategi för hur projektmedlemmarna ska jobba med git och testa strategin innan. Ha överseende med att alla inte är lika insatt i att jobba med git och att det kan ta ett tag innan projektmedlemmarna kommer in i erat workflow.
* Relaterat till ovanstående punkt är det bra att se till att projektmedlemmarna läser igenom eventuella guidelines innan de börjar. Samt läsa dem igen om de uppdateras.
* Kommunicera med andra chapters om arbetssättet i början innan ni sätter upp allt. Hade vi vetat QA planerade att sätta upp systemtester kanske vi valt att inte dela upp repos från början, men eftersom förra året inte satt upp systemtester var detta inte något vi tänkte på. 

Material som varit bra:

* [Docker](https://www.youtube.com/watch?v=eGz9DS-aIeY)
* [Docker compose](https://www.youtube.com/watch?v=DM65_JyGxCo)
* [Gitlab CI/CD](https://www.youtube.com/watch?v=qP8kir2GUgo)
* [Yaml-validator](https://codebeautify.org/yaml-validator/cbccd63a)




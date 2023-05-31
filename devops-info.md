
* Dockerhub
* Gitlab runners, konfiguration för dem.
* Beslut
* Varför beslut tagits
* Vad vi gjort annorlunda om vi gjorde om det
* Hur det hänger ihop
* Dokumentera pipelines

# Terminologi

- **MR**: Merge request
- **CD**: Continous deployment

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

Varje runner behöver också dessa saker för att fungera korrektÖ

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

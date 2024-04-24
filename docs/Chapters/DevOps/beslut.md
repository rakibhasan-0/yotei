## Mall
[mall för beslut](../../Mallar/beslut.md)




# Beslut



## Versionshantering

- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** - N/A 
- **Alternativ** - Github, **GitLab**
- **Motivation**
  - Bygg valde **Gitlab** som versionshanteringssystem eftersom det redan har använts i olika projekt inom universitetet och tänker oss att fler kommer att ha använt det minst en gång innan detta projekt. Det fungerar smidigt för att lägga upp CI/CD-pipelines.
  - Även om Github fungerar minst lika bra som GitLab, kan vi inte vara säkra på att alla inom projektet använt det på samma sätt som för Github.   

## Versionshantering
Polyrepo (Delat upp backend, frontend, dokomuntering och infrastruktur)

- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** - N/A
- **Alternativ** - Monorepo, **Polyrepo**
- **Motivation**
  - Valde att dela upp till fyra repon, ett till frontend, ett till backend, ett för att samla dokument samt ett för konfigurationsfiler för infrastruktur. Uppdelningen mellan frontend och backend innebär att en mindre ändring i frontend inte kommer behöva leda till att alla tester i backend behöver köras i CI/CD-pipelinen. Det gör att vi inte slösar onödiga resurser för varje push till main-branch. 
  - Se motivation ovan för varför Monorepo inte valdes iår.


## Test och deployment

- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** -  N/A
- **Beslut** - Upload till docker hub
- **Motivation**
  - Automatisk uppladdning av docker images till docker hub för att göra det lättare att köra kod på servrar. 


## Deployment
- **Datum** - 230412
- **Chapters** - Bygg
- **Grupp** -  N/A
- **Beslut** - Automatisk deploy till test
- **Motivation**
  - Automatisk deploy från CI till staging server för CD.


## Deployment
Manuell deployment till produktion

- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - N/A
- **Motivation**
  - Manuell deploy på prod vid varje release för att minska risk för fel under utveckling

## Arbetssätt
- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - N/A
- **Alternativ** - 'Ad hoc' committing, Trunk based development **Github flow**
- **Motivation**
  - Github flow valdes som arbetssätt för att få struktur på git-arbetsflödet
  https://docs.gitlab.com/ee/topics/gitlab_flow.html
  - Eftersom det är ett stort antal personer som arbetar på projektet ansågs det att någon struktur behövs.
  - Trunk based development valdes inte eftersom Github flow ansågs vara bättre


## Arbetssätt  
Minst en person måste review:a koden för att det ska gå att mergea till main branch 

- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - N/A
- **Alternativ** - 0, > 1, **1**
- **Motivation**
  - För att minimera antalet merge-problem och för att hålla god kodkvalitet borde minst en person review:a koden
  - Om ingen kollar igenom blir det i bästa fall lite mindre jobb men problem och låg kodkvalitet kan missas
  - Att kräva att fler än en person måste göra review kräver mer jobb och kan göra processen långsammare, men om någon vill lägga till fler än en person för review är det fortfarande möjligt.

## 

- **Datum** - 230413
- **Chapters** - Bygg
- **Grupp** - NA
- **Alternativ** - NA
- **Motivation**
  - Fixade linting för att projekten ska kunna byggas
  - Fixade SQL script för att kunna köras

## Systemtest i pipeline 
- **Datum** - 23-05-26
- **Chapters** - Bygg
- **Grupp** - NA
- **Alternativ** - NA
- **Motivation**
  - Ska fixa så att systemtester endast körs vid mergerequests tills vidare eftersom det tar upp för mycket tid på pipeline. Systemtesterna går fortfarande att köra lokalt under utveckling. 





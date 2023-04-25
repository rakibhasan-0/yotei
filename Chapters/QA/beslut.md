## Mall
[mall för beslut](../../Mallar/beslut.md)


# Beslut
## Project Management Verktyg
- **Datum** - 230419
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - Att fortsätta med Maven som project management verktyg.
- **Motivation**
  - Vi beslutade att fortsätta med Maven då ett byte till annat verktyg skulle innebära en viss omkonfiguration av befintlig backend. Detta skulle vara tidskrävande. Det finns erfarenhet av båda verktygen men, det finns inte en stor efterfrågan att byta så det är inte värt mödan. 

## Framework för testning frontend
- **Datum** - 230425
- **Chapters** - Test/QA
- **Grupp** - N/A
- **Alternativ** - Mocha, **Jest**
- **Motivation**
  - Jest är det framework som rekommenderas för testning, av Facebook(React) [källa](https://legacy.reactjs.org/docs/testing.html). Jest är simpelt och anpassat för React.
  - Mocha valdes bort på grund av att det kräver ytterligare dependencies, samt att det Mocha är utvecklat för Node.js och inte specifikt för React.



- **Datum** - YYMMDD
- **Chapters** - Namn på chapter (N/A om ej relevant)
- **Grupp** - Namn på grupp (N/A om ej relevant)
- **Alternativ** - X, Y, **Z**
- **Motivation**
  - Längre beskrivning om varför Z valdes
  - Längre beskrivning om varför X _inte_ valdes
  - Längre beskrivning om varför Y _inte_ valdes


## Framework för testning backend
- **Datum** - 230419
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - Vi har beslutat att fortsätta använda JUnit som testing framework för backend.
- **Motivation**
  - Vi beslutade att fortsätta använda JUnit för att kunna behålla befintliga enhetstester för backend. Det är ett stablit framework som de flesta utvecklarna i projektet har erfarenhet av.


## Linting backend

- **Datum** - 230419
- **Chapters** - Test/QA
- **Grupp** -  N/A
- **Beslut** - CheckStyle
- **Motivation**
  - Vi fortsätter att använda CheckStyle med befintlig konfiguration [Suns kodkonvention](https://www.oracle.com/technetwork/java/codeconventions-150003.pdf), med undantag, för att undvika att behöva omformatera befintlig kod. CheckStyle är det bland de mest populära Linting verktyg som finns för Java.
  - Föregående grupps motivation: "För linting av backenden som är skrivet i Java så har vi valt att använda oss utav verktyget CheckStyle. CheckStyle kontrollerar sådant att koden och dokumentationen följer en given standard. Denna standard är något som man själv kan konfiguera och ändra på som användare. Vi har konfiguerat CheckStyle sådant att den följer Suns kodkoventation för Java (https://www.oracle.com/technetwork/java/codeconventions-150003.pdf), med några få undantag.  Anledningen till varför vi valde CheckStyle är eftersom det är, enligt det vi kunde hitta det populäraste och det verktyg som de flesta verkade rekommendera för Java."



## Linting frontend

Beslut kommer...
- **Datum** - YYMMDD
- **Chapters** - Namn på chapter (N/A om ej relevant)
- **Grupp** -  Namn på grupp (N/A om ej relevant)
- **Beslut** - Vad beslutades?
- **Motivation**
  - Vi beslutade att fortsätta använda Java Code Convention

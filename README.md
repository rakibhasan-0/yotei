# Frontend

## Att bidra till frontend

När man arbetar i frontend så måste man ha en godkänd design innan man börjar implementera. Börjar du arbeta på en ticket som har med gränssnittet att göra, följer du följande steg:

1. Påbörja din design i [figma](https://www.figma.com/file/64zymyGJSp7BuQthnOhvMt/PVT?node-id=1%3A68&t=WL4siHHSRFAsrkq5-1). Lägg den i en frame som har ticket identifier som namn.
2. Gör färdigt ditt förändringsförslag.
3. Meddela någon i frontend att granska ditt förslag.
4. När ditt förslag har fått godkännande, kan du börja implementera din design.
5. Därefter följs de steg som gäller för hela projektet ang. git-formalia etc.

Har man en ändring som inte har något med gränssnittet, så behöver man ej ha en godkänd design innan man börjar arbeta.

Skapar man en ny komponent, så skall man göra en ny mapp i src/components eller src/pages. Mappens namn skall vara namnet på komponenten. I denna så skall det finnas två filer, en jsx-fil, och en css-fil. I css-filen så skall stilar som hör till komponenten läggas. Man bör ej ha flera komponenter i samma mapp.

Alla komponenter som skrivs skall vara funktionella komponenter. Komponenten skall exporteras som en default export. När @version uppdateras så ökas den första siffran med 1, ex. 1.0 -> 2.0 -> 3.0 -> etc. Exempel på formatet som komponenter ungefär bör följa:
```jsx
/**
 * This is an example description.
 * 
 * Props:
 *     prop1 @type {string}  - A description of prop1
 *     prop2 @type {number}  - A description of prop2
 *     prop3 @type {boolean} - A description of prop3
 *
 * Example usage:
 *     <MyComponent prop1="Hello world!" prop2={42} prop3={true}/>
 *
 * @author Team Name
 * @version 1.0
 * @since 20XX-XX-XX
 */
function MyComponent({ prop1, prop2, prop3, id }) {
	return(
        <div id={id}>
            ...
        </div>
    )
}
export default MyComponent
```
Värt att förtydliga är att alla komponenter skall ta en prop "id". Detta för att underlätta testning. Detta id kan sätts på lämpligt element i komponeten, alla komponenter behöver alltså ej ha en container-div som i exemplet ovan.

[Länk till figma](https://www.figma.com/file/64zymyGJSp7BuQthnOhvMt/PVT?node-id=1%3A68&t=WL4siHHSRFAsrkq5-1)

## Att köra frontend
För att köra frontend krävs det att ett antal API:er och REACT servern körs. Detta görs enligt nedan:

### Att använda React och npm på skoldatorer

Om du har en developer branch, klona den med kommandot:

```
git clone https://git.cs.umu.se/courses-project/5dv214vt23/frontend/-/tree/[name-of-branch]
```

Om du inte har det, klona repot med kommandot:

```
git clone https://git.cs.umu.se/courses-project/5dv214vt23/frontend.git
```

Installera npm med kommandot: <br>
```
npm install 
```

Om det uppstod fel när npm installerades se till att ta bort mappen <em>node modules</em> innan du försöker igen. <br>

### API:er för backend

API:erna körs på testservern (imp.cs.umu.se). Frontend är konfigurerat att använda sig av dem som backend. Det kräver att datorn som kör frontend är uppkopplad mot eduroam. Vid hemmajobb kan frontend köras på itchy, scratchy osv.

### Starta React appen

För att sedan starta React appen kör kommandot: <br>
```
npm start
```
REACT servern kommer per default köras på **localhost:3000**. Per default körs frontend mot imp (dev servern) om du vill köra backend lokalt kan du ändra USE_IMP_SERVER till "false" i .env filen.

### React Tester

Testerna använder sig av **Jest** för mocking och **REACT**s egen testsuite för att interagera med DOM. För att testa appen innan commit till pipelinen finns följande kommandon
som kan köras lokalt.
```
1. npm test
2. npm run test:watch
3. npm run test:coverage
```
Det första kommandot kör alla enhetstester i repot, det andra startar en liveterminal som kör testerna och sedan kör om dem när de uppdateras. Det tredje kör en täckningsanalys av projektet. Resultatet presenteras i terminalen men det genereras också en egen *coverage* mapp som innehåller en hemsida (**coverage/lcov-report/index.html**) där man kan få en överblick av coverage för projektet. 


För linting (statisk kodanalys) kan man köra följande.
```
npm run lint
```
Värt att notera är att detta kommando även försöker fixa problemen med flaggan --fix

**Tips:** 
1. Tester skapas genom att döpa filerna till `KOMPONENT.test.js` och sedan anropa funktionen `it("Testnamn", () => { 'Test Content...' })`
2. Man kan planera för tester även innan man har en implementation genom att använda `it.todo("Testnamn")`.

### Resurser

#### Grunder i REACT
[React - Quick Start](https://react.dev/learn)

[W3schools react tutorial](https://www.w3schools.com/REACT/DEFAULT.ASP)

[Enkel tutorial för att hämta data från en JSON](https://pusher.com/tutorials/consume-restful-api-react/#prerequisites)

[RESTful API in React](https://rapidapi.com/blog/how-to-use-an-api-with-react/)


#### Tester

[REACT Testing Library: Getting Started](https://testing-library.com/docs/)
[REACT Hooks Testing Example](https://github.com/iqbal125/react-hooks-testing-complete)
[Jest: Getting Started](https://jestjs.io/docs/getting-started)

# Test guide for frontend 
From now on, tests should be written for new functionality produced in the frontend of the project.
We expect people from now on to start building tests and develop TDD-ish. 

## Testing frameworks to be used
- [Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Mock Service Worker](https://mswjs.io/docs/)

# Getting started
React Testing Library includes functionality to test React components. It is used together with Jest to make a testing framework for our frontend.

**Install React Testing Library with:**

    npm install --save-dev @testing-library/react 

**Install Jest with:**

    npm install --save-dev jest 

**Install Mock Service Worker with:**

    npm install msw --save-dev

**Tests should be placed in a folder called:**

    __tests__ 

**Tests should use the naming convention**

    filename.test.jsx
    
For example the file **plan.jsx** should have a corresponding testfile called **plan.test.jsx** and be placed in it"s corresponding place in **\_\_tests\_\_**.
```

src
 ├── components
 │    ├── Common
 │        ├──ExampleButton
 │            ├──ExampleButton.js
 ├── __tests__
 |    ├── __mocks__
 │    ├── components
 │        ├── Common
 │            ├──ExampleButton
 │                ├──ExampleButton.test.js
```

### Tip:
There is a extensions in VSCode for Jest and React Testing Library.

## Example unit test

```javascript 
/** @jest-environment jsdom */
import React from "react"
import {render, screen, configure} from "@testing-library/react"
import Button from "../src/components/Common/Button/Button"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

test("Tests interaction with button", async() => {
    // ARRANGE
    var clicked = 0;
    
    render(<div><Button onClick={
                            ()=> {clicked=1}} id={"testbutton"}></Button></div>)
    

    // ACT
    screen.getByTestId("testbutton").click();

    // ASSERT
    expect(clicked).toEqual(1);
})

OBS!: screen.debug() kan användas för att se DOM för det rendererade objektet, i terminal.

```
### Tip:
Man kan planera för tester även innan man har en implementation genom att använda `it.todo("Testnamn")`.

# Mock Service Worker
Msv is used in our development to mock Restful requests. This is used to "fake" api requests and responses to test how our code works with different API calls and to find buggs by writing tests integrating the service. 
Mocks is created in the directory:

    src/mocks
    
To mock API communication, msv uses what they call [request handler](https://mswjs.io/docs/basics/request-handler) to specify wich request should be made, and what the mocked response should be.
For example, a mocked response from a get request could be:

## Mock exampel
För att mocka API svar behöver följande importeras i testfilen:
```javascript 
import { rest } from "msw"
import { server } from "../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)
```
De första raderna importerar den nödvändiga funktionaliteten och de andra två sätter upp en lyssnar-funktion som kan användas för att upptäcka när `fetch requests` har gjorts till APIet.

Om man vill definiera ett specifikt svar för ett test kan man göra det på följande sätt.
```javascript
test("some test that should pass", async() => {
	// ARRANGE
	server.use(
		// get kan ersättas av post, delete, put etc...
		rest.get("http://localhost/api/PATH/TO/ENDPOINT", 
			{
				//JSON Objekt som svaret ska bestå av.
			}
		)
	)

	// ACT
	...

	// ASSERT
	...
})
```

För att göra `assertions` angående huruvida komponenten har interagerat med APIet kan man göra följande. För mer information, se dokumentationen för `jest.fn()`.
```javascript
test("some test that should pass", async() => {
	// ARRANGE
	...

	// ACT
	...

	// ASSERT
	expect(requestSpy).toHaveBeenCalled()
	expect(requestSpy).toHaveBeenCalledTimes(...)
})
``` 

Ett exempel på användning av mockade API svar finns i filen:
```
/frontend/src/__tests__/components/Workout/WorkoutFavoriteButton.test.jsx
```

## Mer information
[How to define the responseResolver](https://mswjs.io/docs/getting-started/mocks/rest-api).

# Köra testerna

För att testa appen innan commit till pipelinen finns följande kommandon
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







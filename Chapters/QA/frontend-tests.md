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
    
For example the file **plan.jsx** should have a corresponding testfile called **plan.test.jsx** and be placed in it's corresponding place in **\_\_test\_\_**.
```
frontend
├── src
│   ├── components
│       ├── Common
│           ├──ExampleButton
│               ├──ExampleButton.js
├── __test__
│   ├── components
│       ├── Common
│           ├──ExampleButton
│               ├──ExampleButton.test.js
```

### Tip:
There is a extensions in VSCode for Jest and React Testing Library.

## Example unit test

```javascript 
/** @jest-environment jsdom */
import React from 'react'
import {render, screen, userEvent} from '@testing-library/react'
import Button from '../src/components/Common/Button/Button'
import '@testing-library/jest-dom'

test('Tests interaction with button', async() => {
    // ARRANGE
    var clicked = 0;
    
    let dom = render(<div><Button onClick={()=>{clicked=1}}>Testing</Button></div>);
    

    // ACT
    screen.debug();
    document.getElementsByClassName('button button-normal')[0].click();

    // ASSERT
    expect(clicked).toEqual(1);
})



```
# Mock Service Worker
Msv is used in our development to mock Restful requests. This is used to "fake" api requests and responses to test how our code works with different API calls and to find buggs by writing tests integrating the service. 
Mocks is created in the directory:

    src/mocks
    
To mock API communication, msv uses what they call [request handler](https://mswjs.io/docs/basics/request-handler) to specify wich request should be made, and what the mocked response should be.
For example, a mocked response from a get request could be:

```javascript 
import { rest } from 'msw'
// Matches any "GET /user" requests,
// and responds using the `responseResolver` function.
rest.get('/user', responseResolver)
```
[How to define the responseResolver](https://mswjs.io/docs/getting-started/mocks/rest-api). Will make a guide for this after some testing.








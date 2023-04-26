# Test guide for frontend 
From now on, tests should be written for new functionality produced in the frontend of the project.
We expect people from now on to start building tests and develop TDD-ish. 

## Testing frameorks to be used
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

```javascript import userEvent from '@testing-library/react'
import Button from '../src/components/Common/Button/Button'
import '@testing-library/jest-dom'

test('Tests interaction with button', async() => {
    // ARRANGE
    const [clicked, setClicked] = useState(0);
    render(<Button onClick={()=>{setClicked(1)}}><p>Hello</p></Button>)

    // ACT
    await userEvent.click(screen.getByText("Hello"))

    // ASSERT
    expect(clicked == 1)
})
```


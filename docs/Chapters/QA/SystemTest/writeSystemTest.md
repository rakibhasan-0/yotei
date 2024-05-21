# Write System Test
This is a guide for how you write a system test in Playwright. For a system test to run, it requires a few different files to be present. Below is a step by step walkthrough with additional examples.
This is heavy reading but worth getting into.

## Structure & Naming
We will first look at the different files that we are working with while creating a system test.

### Test Files
- The test file that holds the actual test, is placed in the following directory: yotei/frontend/SystemTests/TestFiles.
- The file should be named after the activity that's being tested. The file ending needs to be '*.spec.ts'.

Example:
	The file containing the tests for the workout page is called 'workout.spec.ts'.
	
### Page Object Model (POM)
- Beside the file containing the test, a file containing helper functions used in the tests is needed, this reduces duplicated code. This file should export a class named after the page that's being tested, or part of a page if it's very large or complex.
- This file is a Page Object Model (POM) and should be placed in the following directory: yotei/frontend/SystemTests/PageObjectModels.
- The name should contain the page being tested and end with '(...)Page.ts'

Example:
	The POM file for the workout page is called 'workoutPage.ts'
	
### Types File
- A function in the POM file might need an object to store data in a page, or if several tests use data structured in a similar way a type object should be created.
- All types are written in this file [systemTestsTypes.ts](../../../../frontend/SystemTests/Types/systemTestsTypes.ts)
- It should be named after what it represents.
The properties in these objects should all be nullable to keep the tests flexible, and able to test absence of non-nullable properties. This is done through adding '?' at the end of the property name. 

Example:
	The test for creating a workout uses, among others, the following two types:
	
```ts
export type Activity = {
  name?: string,
  description?: string,
  time?: number, // Subject to change, may use number of repetitions instead of duration
  tag?: string,
  mediaLink?: string
}

// Workout
export type Workout = {
  name?: string,
  description?: string,
  techniques?: Technique[],
  exercises?: Exercise[],
  isPrivate?: boolean,
  hasAccess?: Account[],
  tags?: string[]
}
```
	
When creating a workout, it needs a name, and optionally a description, techniques, and exercises. 
The Workout object has the properties 'name?', 'description?', 'exercises?', and 'techniques?' for these.
The Activity object can represent either a technique or an exercise.

## Step by step
We will now walk through how you write your first test.

The following guide assumes that the application is up and running locally through docker. 
With npm and nodejs installed through nvm, vite installed, and necessary .env files in both root and frontend. See the quick-start guide on the projects git page to set it up locally

### Configurations and dependencies	
1. Navigate to the frontend directory in a terminal and run the following commands to install and set up playwright for the project.

  ```sh
  npx playwright install-deps
  npx playwright install 
  ```
	
### Creating files
1. Create a test file in the following directory 'frontend/SystemTests/TestFiles'
2. Name it after the activity being tested, file ending should be '*.spec.ts'
3. Create a POM file in the following directory 'frontend/SystemTests/PageObjectModels'
4. Name it after the page being tested, name should end with '*Page.ts'
5. If needed, add a type in the file 'frontend/SystemTests/Types/systemTestsTypes.ts' or use the already created. 

### Write the POM file
1. Copy this template into the test file '*Page.ts' that you've created, and update it.

```ts
import { type Page } from '@playwright/test'
import { SomeType } from '../Types/systemTestsTypes'

export class SomePage {
  readonly page: Page
  readonly url: string = '/someurl'

  public constructor(page: Page) {
    this.page = page
  }

  async visit() {
    await this.page.goto(this.url)
  }

  async createSomething(someType: SomeType) {
    // generate code with codegen in the next step
  }

  async deleteSomething(name: String) {
    // generate code with codegen in the next step
  }

  ...
}
```
		
### Generate code with codegen
You can generate code with Playwrights codegen that will open two windows, a browser window where you interact with the website you wish to test and the Playwright Inspector window where you can record, copy, clear as well as change the language of your tests. [Read more about generating tests with Codegen](https://playwright.dev/docs/codegen-intro). This can be done by the following steps:

1. Run frontend
```sh
cd frontend
npm run start
```

2. Run codegen in another terminal 
```sh
cd frontend
npm run systest:codegen
```

3. You can pause the recording before logging in and navigating to the page being tested, the fixtures will log the test environment in and navigate to the page. If you did not pause you can later just remove the generated code up until you've navigated to the page.

4. When you have navigated to the desired page, hit record and perform the steps you want the test to do.

5. Copy the generated code you want to use and add it to your POM file.

6. Refactor the code into different methods. Here's an example of how generated code can be refactored:

```ts
import { type Page } from '@playwright/test'
import { Workout } from '../Types/systemTestsTypes'	// Imports a Type object

// The POM used in the tests
export class WorkoutPage {
  readonly page: Page // The Page object defined by this POM
  readonly url: string = '/workout'	// The URL for the page

  public constructor(page: Page) { // POM constructor, looks the same in every POM
    this.page = page
  }

  // Navigates to the page and potentially to a specific segment on a page
  async visit() { 
    await this.page.goto(this.url)
  }

  // Function for creating a workout
  async createWorkout(workout: Workout) {
    // Clicks a button to create a new workout
    await this.page.locator('#CreateWorkoutButton').getByRole('img').click()
    // Clicks a textfield to set the workouts name
    await this.page.getByPlaceholder('Namn').click()
    // Enters the input objects name value into workouts name textfield
    await this.page.getByPlaceholder('Namn').fill(workout.name)
    // Navigates to next textfield to set the workouts description
    await this.page.getByPlaceholder('Namn').press('Tab')
    // Enters the input objects description value into the description textfield
    await this.page.getByPlaceholder('Beskrivning av pass').fill(workout.description)
    // Locates and clicks the button to add activities to the workout
    await this.page.getByRole('button', { name: '+ Aktivitet' }).click()
    // Locates and checks a techniques checkbox
    await this.page.locator('#technique-list-item-138').getByLabel('').check()
    await this.page.locator('#technique-list-item-139').getByLabel('').check()
    await this.page.locator('#technique-list-item-140').getByLabel('').check()
    // Locates and clicks the exercises tab
    await this.page.getByRole('tab', { name: 'Övningar' }).click()
    // Locates and checks an exercises' checkbox
    await this.page.locator('#ExerciseListItemCheckBox-289-checkbox').check()
    await this.page.locator('#ExerciseListItemCheckBox-305-checkbox').check()
    await this.page.locator('#ExerciseListItemCheckBox-340-checkbox').check()
    // Locates and clicks the button to add the selected activities to the workout
    await this.page.locator('#AddCheckedActivitiesButton').click()
    // Clicks a radio button to set added activities as Uppvärmning
    await this.page.locator('div').filter({ hasText: /^Uppvärmning$/ }).click()
    // Clicks a button to save the selected activities to the workout
    await this.page.getByRole('button', { name: 'Lägg till' }).click()
    // Clicks a button to confirm saving the selected activities 
    await this.page.getByRole('button', { name: 'Spara' }).click()
  }

  // Method for deleting the workout created from the createWorkout function
  async deleteWorkout(name: String) {
    // Locates and clicks the button to remove the workout
    await this.page.locator('#delete_trashcan').click()
    // Locates and clicks the button to confirm removing the workout
    await this.page.getByRole('button', { name: 'Ta bort' }).click()
  }
}
```
7. Check how codegen retrieves different elements, and update if needed. If components don't have either ids, labels, data-test ids or some other unique identifier codegen will use one of these two methods for setting an identifier. **They aren't preferable and should be changed**:

  - It creates an id of the className prop and a unique hash at the end. For example: 
    ```ts
    await page.locator('._statisticsButtonContainer_1pejx_1 > button').click()
    ```
    Here the locator uses *._statisticsButtonContainer_1pejx_1* to locate a button, This is generated by some CSS module and will be named something else on another machine. 
    as these hashed endings differ between builds and environments, they will only work on the computer that generated the test.
  - If className isn't used it might instead use a components 'index' on the page. For example: 
    ```ts
    await page.locator('a:nth-child(3)').first().click()
    ```
    Here the locator looks for the 3rd child in a component, these can change between runs.

    If generated code uses either of these two ways to identify a component, you need to add a unique id to the component where it is rendered. 

#### Tips

  If you're having trouble accessing a component within another component, for example an edit button in an element in a list. You can use some Xpath commands to traverse the DOM structure of an element.
  Locate a unique persistent string or id in the element you're trying to access, 

  ```ts
  let locator = this.page.getByText(`${activity.name}`, { exact: true })
  ```
  Then from this locator, access its parent with

  ```ts
  const parent = locator.locator('..')
  ```
  this can be repeated to move up the hierarchy.

  See: [workoutPage.ts](../../../../frontend/SystemTests/PageObjectModels/workoutPage.ts) for an example. 

  When navigating through elements this way it helps to log the locator contents in the console to see what the element contains. An elements contents can be logged like this:

  ```ts
  const parentHTML = await parent.innerHTML()
  console.log("parentHTML", parentHTML)
  ```
  Following the above example of trying to access an edit button in an element in a list. Look for the button in the logged HTML, if it isn't present, move up one more level and log that parent. repeat until found.

  ```ts
  const grandParent = parent.locator('..')
  const grandParentHTML = await grandParent.innerHTML()
  console.log("grandParentHTML", grandParentHTML)
  ```

## NOTE: 
As the tests run on the actual server against the actual database, any test that stores something in the database, needs a cleanup function to remove the created item. Additionally, expect should preferably be placed in the test files to keep POM methods general and dynamic. 

### Write the actual test file
1. Copy this template into the test file *.spec.ts that you've created, and update it.

```ts
import { test, expect } from '../fixtures'
import { NameOfPOM } from '../PageObjectModels/nameOfPOM'

test.describe('Name of test suite', () => {
  let nameOfPom
  
  test.beforeEach('Describe setup', async ({page}) => {
    nameOfPom = new NameOfPOM(page)
    await nameOfPom.visit()
    await expect(page.getByPlaceholder('Some string on expected page')).toBeVisible()
  })
  
  test('#. What test does and expected outcome', async ({ page }) => {
    // Act by calling methods in POM and assert by using expect.
    // Do not forget to delete data in the database that was created during the test.  
  })
})
```

2. Act by calling methods in the POM file and assert by using expect.

Here's a concrete example of how it can look:

```ts
import { test, expect } from '../fixtures' // Imports the fixtures
import { WorkoutPage } from '../PageObjectModels/workoutPage' // Imports the POM

test.describe('ST-4 Workout', () => {	// A test suite containing several tests
  let workoutPage // The POM used throughout the tests

  // The setup before each test
  test.beforeEach('navigate to workout page', async ({page}) => { 
    // Creates the POM used in the test
    workoutPage = new WorkoutPage(page)
    // Visits the page, navigates to the page and the part of the page test being tested
    await workoutPage.visit()
    // Asserts that the correct page is loaded
    await expect(page.getByPlaceholder('Sök efter pass')).toBeVisible()
  })

  // The test, name describes what it tests and the expected outcome.
  test('1. Create workout with name and description should display success toast', async ({ page }) => {
    const name = Math.random().toString(36).slice(2, 7) 
    // Call to POMs function 
    await workoutPage.createWorkout({ description: 'description description description', name: name})
    // Asserts the pom function succeeded
    await expect(page.getByText(`Träningspasset skapades!`)).toBeVisible()
    // Waits for everything to load before next action
    await page.waitForSelector('h1')
    //Call to POM, function cleans up result of previous POM function
    await workoutPage.deleteWorkout(name)
    // Asserts the pom function succeeded
    await page.getByRole('link', { name: `${name}`}).isHidden()
  })
})
```

### Run Tests
See [runSystemTest.md](writeSystemTest.md)

### Document
Document your created test in [systemTestsCatalog.md](systemTestsCatalog.md).

### Celebrate
You've created your first system test!

## Tools
This extension by Microsoft gives support for Playwright testing in VSCode:
[Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) 

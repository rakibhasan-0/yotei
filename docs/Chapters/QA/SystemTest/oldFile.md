# System Test

This document outlines system testing. As per the [decision](https://git.cs.umu.se/courses-project/5dv214vt23/docs/-/blob/main/Chapters/QA/beslut.md), [playwright](https://playwright.dev/) is used for system testing. System tests exist to provide comprehensive testing of the entire system, ensuring that everything functions as intended. Playwright simulates a browser and can be scripted. 

Learn more about system testing with playwright here: [Playwright Documentation](https://playwright.dev/docs/intro)

## Run system tests
Whenever a breaking change or a significant modification is made, system tests must be run to minimize the risk of project failure. This can be done manually locally. 

1. Run all docker containers either in the Docker Desktop ui or with this command:

```sh
docker compose up -d
```

2. Ensure that the frontend container isn't running, as it will occupy port 3000, which is required for system tests. Stop running that container. 

3. Run system tests:

```sh
cd frontend
npm run systest
```

You can also run the tests with the following command, which runs the tests in UI mode for a better developer experience with time travel debugging, watch mode and more. 
```sh
npm run systest:ui
```

## System tests in pipeline
TODO write about it.

## Write system tests
TODO specify who and when system tests should be written.

### Structure & Naming

=============================================================================================
    TO DO:
    
    https://playwright.dev/docs/pom
=============================================================================================
All tests should reside in `sys-test` and have names like `*.spec.ts`. If making direct calls to the API, the code should be placed in a separate file `sys-test/fixtures/<api-namn>Api.ts`. 

Specify tests in steps. For example, `// Setup. Create a user`, `// 1. Log in`, `// Cleanup. Remove the new user.`

Unlike unit tests, AAA (Arrange, Act, Assert) does not need to be followed; tests can be fairly long and mix assertions and actions

Tests follow this general structure:

```ts
import { expect, test } from '@playwright/test';
import { UserApi } from './fixtures/UserApi';

test.describe('ST-<suite-nr> <namn på test>', () => {
    /**
     * Documentation related to the test.
     */
    test('.<test-nr> <beskrivning av test>', async ({ page }) => {
        // Setup.

        // 1.
        await page.goto('/');

        // Cleanup.
    });
});
``` 

### Generate tests with Codegen
Codegen will open two windows, a browser window where you interact with the website you wish to test and the Playwright Inspector window where you can record your tests, copy the tests, clear your tests as well as change the language of your tests. This can be done by the following steps:

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

3. Add the URL, the one you want to test, directly into the browser window

4. Perform actions that you want to test on the website. 

5. Copy the generated code and add it to your test file. **Note that you should replace the goto-command to the following command, so tests can run both locally and in pipeline.**
```ts
await page.goto('/');
```

[Read more about generating tests with Codegen](https://playwright.dev/docs/codegen-intro)

### Fixtures

Fixtures are helpers to simplify calls to the backend. This can involve setup/teardown for tests.

## Tools
This extension by Microsoft gives support for Playwright testing in VSCode:
[Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) 
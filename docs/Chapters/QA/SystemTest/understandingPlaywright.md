# Understanding Playwright
This document contains information about fixtures, test types, and all system tests. The main target group is QA. 

## Fixtures
### [fixtures.ts](../../../frontend/sys-test/fixtures.ts)
Fixtures are setup configurations that are used to prepare the testing environment before tests run and clean up after tests complete. For example logging in to the application to run the tests as an actual user.

## Types
### [systemTestsTypes.ts](../../../frontend/sys-test/types/systemTestsTypes.ts)
Types are objects used in tests. Often related to specific pages. For example when testing creation of a new technique, the new techniques data is stored in this object:

export type Technique = {
  name?: string,
  description?: string,
  time?: number,
  tag?: string,
  mediaLink?: string
}

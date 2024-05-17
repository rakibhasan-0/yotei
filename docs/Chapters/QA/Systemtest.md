# System tests
This document contains information about fixtures, test types, and all system tests.

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

## /canaryTest
### [canaryTest.spec.ts](../../../frontend/sys-test/canaryTest.spec.ts)
| Test name | Test scenario | Test data | Expected outcome |
|-------|--------|--------|--------|
| Planering title should be visible if the fixtures work | Runs fixtures to render application homepage | N/A | Homepage is rendered, 'Planering' title is located |

## /activity
### [technique.spec.ts](../../../frontend/sys-test/techniques.spec.ts)
| Test name | Test scenario | Test data | Expected outcome |
|-------|--------|--------|--------|
| Create technique | Creates a new technique with a randomized name, asserts its existence then deletes it | A description, duration, and a randommized name | The newly created test is inserted into the database, then deleted |
| Next test in technique suite | Next tests scenario | Next tests data | Next tests outcome |

## /groups

## /workout

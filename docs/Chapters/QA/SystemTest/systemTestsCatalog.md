# System Test Catalog
This file summarizes and briefly explains all implemented system tests. All system tests should be found here. 

| Test file | Test name | Test scenario | Test data | Expected outcome |
|-------|-------|--------|--------|--------|
| [canaryTest.spec.ts](../../../frontend/SystemTests/TestFiles/canaryTest.spec.ts) | Planering title should be visible if the fixtures work | Runs fixtures to render application homepage | N/A | Homepage is rendered, 'Planering' title is located |
| [technique.spec.ts](../../../frontend/SystemTests/TestFiles/techniques.spec.ts) | Create technique | Creates a new technique with a randomized name, asserts its existence then deletes it | A description, duration, and a randommized name | The newly created test is inserted into the database, then deleted |
|| Next test in technique suite | Next tests scenario | Next tests data | Next tests outcome |
| [workout.spec.ts](../../../frontend/SystemTests/TestFiles/workout.spec.ts) | Create workout | Creates a new workout, adds 3 exercises and 3 techniques then saves it. After confirming that the workout is saved, it is deleted. | A randomized name and generic description. Three techniques (Kamae, neutral/beredd/gard), and three exercises (Armhävningar, vanliga/bred handposition/med klapp) | The newly created workout is inserted into the database with the desired name, description, and activities. After that it's deleted |


## To be tested

| Test file | Test case |
|--------|--------|
| [technique.spec.ts](../../../frontend/SystemTests/TestFiles/techniques.spec.ts) | Adding and removing multiple tags and media for a new technique |
|  | Editing an existing technique |
|  | Try to create technique that already exists |
|  | Add, remove and edit belts for a technique |
| [workout.spec.ts] (../../../frontend/SystemTests/TestFiles/workout.spec.ts)| Add, edit, and remove free text activity |
|  | Add, edit, and remove tags |
|  | Set workout to private, give access to select users |
|  | Mark as performed |
| [statistics.spec.ts](../../../frontend/SystemTests/TestFiles/statistics.spec.ts) | Mark some workout as performed by some group, check that statistics page contains the activities in the workout |
|  | Sort performed techniques by most and least executions |
|  | Filter technique list by belts, assert  |


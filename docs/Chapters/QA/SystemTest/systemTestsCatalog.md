# System Test Catalog
This file summarizes and briefly explains all implemented system tests. All system tests should be found here. 

| Test file | Test name | Test scenario | Test data | Expected outcome |
|-------|-------|--------|--------|--------|
| [canaryTest.spec.ts](../../../frontend/sys-test/canaryTest.spec.ts) | Planering title should be visible if the fixtures work | Runs fixtures to render application homepage | N/A | Homepage is rendered, 'Planering' title is located |
| [technique.spec.ts](../../../frontend/sys-test/techniques.spec.ts)| Create technique | Creates a new technique with a randomized name, asserts its existence then deletes it | A description, duration, and a randommized name | The newly created test is inserted into the database, then deleted |
|| Next test in technique suite | Next tests scenario | Next tests data | Next tests outcome |
|workout.spec.ts| Create workout | Creates a new workout, adds 3 exercises and 3 techniques then saves it. After confirming that the workout is saved, it is deleted. | A randomized name and generic description. Three techniques (Kamae, neutral/beredd/gard), and three exercises (Armhävningar, vanliga/bred handposition/med klapp) | The newly created workout is inserted into the database with the desired name, description, and activities. After that its deleted |
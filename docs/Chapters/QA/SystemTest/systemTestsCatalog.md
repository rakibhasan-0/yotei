# System Test Catalog
This file summarizes and briefly explains all implemented system tests. All system tests should be found here. 

| Test file | Test name | Test scenario | Test data | Expected outcome |
|-------|-------|--------|--------|--------|
| [canaryTest.spec.ts](../../../frontend/SystemTests/TestFiles/canaryTest.spec.ts) | Planering title should be visible if the fixtures work | Runs fixtures to render application homepage | N/A | Homepage is rendered, 'Planering' title is located |
| [technique.spec.ts](../../../frontend/SystemTests/TestFiles/techniques.spec.ts) | Create technique | Creates a new technique with a randomized name, asserts its existence then deletes it | A description, duration, and a randommized name | The newly created test is inserted into the database, then deleted |
|| Next test in technique suite | Next tests scenario | Next tests data | Next tests outcome |
| [workout.spec.ts](../../../frontend/SystemTests/TestFiles/workout.spec.ts) | Create workout | Creates a new workout, adds 3 exercises and 3 techniques then saves it. After confirming that the workout is saved, it is deleted. | A randomized name and generic description. Three techniques (Kamae, neutral/beredd/gard), and three exercises (Armhävningar, vanliga/bred handposition/med klapp) | The newly created workout is inserted into the database with the desired name, description, and activities. After that it's deleted |


## Tests TODO
The following is a list of pages and functionalities that should be tested

| Feature | Test scenario |
|--------|--------|
| [Statistics](../../../../frontend/src/pages/Statistics) |  |
|  | Test popup and assert that visualized statistics are correct |
|  | Test sorting and filtering list of performed activities |
|  |  |
| [Groups](../../../../frontend/src/pages/Plan/GroupIndex) |
|  | Test sorting and filtering groups |
|  | Test searching for specific groups |
|  | Test creating, deleting, and editing groups |
| [Plan](../../../../frontend/src/pages/Statistics/Plan) |  |
|  | Test creating, editing, and deleting a plan |
|  | Test creating a workout when creating a plan, and add it to the plan |
| [Activity](../../../../frontend/src/pages/Activity) |  |
|  | Test creating, deleting, and editing an exercise |
|  | Test searching, sorting, and filtering activities, in both techniquelist and exercise list |
|  | Try to create activity that already exists |
|  | Add, remove and edit belts for an activity |
| [Grading](../../../../frontend/src/pages/Grading/) |  |
|  | Test creating, deleting, and editing a grading form |
|  | Try adding multiple people to a grading and pair them up |
|  | Add the same person multiple times to a grading protocol, expect error messages |
|  | Create two grading forms, and fill in all techniques as passed on one, and all failed on the other, |
| [List](../../../../frontend/src/pages/List) |  |
|  | Create, delete, and edit a list |
|  | Add multiple techniques to a list, assert that they were properly stored |
|  | Set lists as private and assert that other users cant see the private list |
|  | Create list, set as private, share with some user, assert that the shared with user can access the list, assert that some other user not shard with cant access the list |
| [Profile](../../../../frontend/src/pages/Profile/) |  |
|  | Test messing with settings and info |
| [Workout](../../../../frontend/src/pages/Workout) |  |
|  | Add, edit, and remove free text |
|  | Add, edit, and remove tags |
|  | Set workout to private, give access to select users |
|  | Mark as performed |
| **User Permission** |  |
|  | Log in with admin permissions and assert that some functionality only available to admin is accessabile |
|  | Log in as regular user and assert that admin-only functionality is unavailable |

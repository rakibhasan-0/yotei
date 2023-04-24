# Session-api
| Class   |      Coverage (%)      | Coverage (%) efter refaktorisering | Comment |
|----------|:-------------:|:-------------:|:-------------:|
| AddListInput|  100 | 0 | Borttagen |
| DateAndTime |    100   | 0 | Borttagen |
| Session | 66 | 63| Getters och setters. Testas men ej branch coverage. Lätt fix|
| SessionApiApplication | 0 | 0 |En main som kör allt|
| SessionController | 60 | 100 | **Dessa metoder kan kanske tas bort**: add, addList, addRepeating, createSessions, getByPlan, getByPlans. **Dessa klasser kan kanske tas bort**: SessionControllerAddList, SessionDeleteByPlanTest SessionControllerGetByPlanTest. AddListInput, DateAndTime, SessionTimeConverter|
| SessionTimeConverter | N/A | N/A |Används ej. Borttagen|

# Techniques-api
| Class   |      Coverage (%)      | Comment |
|----------|:-------------:|:-------------:|
| Technique |  85 | |
| TechniqueController |  77 | |
| TechniqueImportResponse |  16 | |
| TechniqueApiApplication |  0 | Main|

# Tag-api

| Class   |      Coverage (%)      | Comment |
|----------|:-------------:|:-------------:|
| ExerciseTag |  100 | |
| ExerciseTagController |  72 | Behövs integrationstester|
| ExerciseTagMap |  0 | Getters och setters|
| Tag |  100 | |
| TagApiApplication |  0 | Main |
| TagController |  100 | |
| TechniqueTag |  71 | Getters och setters|
| TechniqueTagController |  75 | Behövs integrationstester|
| TechniqueTagMap |  0 |  Getters och setters|
| WorkoutTag |  100 |  |
| WorkoutTagController |  100 |  |

# Workout-api

| Class   |      Coverage (%)      | Comment |
|----------|:-------------:|:-------------:|
| Activity |  27 | Getters och setters|
| ActivityController |  100 | |
| UserShort |  0 | Getters och setters|
| UserWorkout |  0 | Getters och setters|
| UserWorkoutController |  0 | Behövs mocking |
| Workout |  100 | Getters och setters|
| WorkoutApiApplication |  0 | Main|
| WorkoutController |  81 | Behövs mocking|
| WorkoutDataPackage |  0 |  Getters och setters|
| WorkoutFavorite |  100 | |
| WorkoutReview |  80 | Getters och setters|

# User-api

| Class   |      Coverage (%)      | Comment |
|----------|:-------------:|:-------------:|
| InvalidPasswordException |  100 | |
| InvalidUserNameException |  100 | |
| JWTUtil |  100 | |
| PasswordHash |  100 | |
| User |  100 | |
| UserApplication |  0 | Main|
| UserController |  72 | Getters och setter + ngra branches|


# Exercise-api

| Class                  | Coverage (%) | Comment |
|------------------------|:------------:|:-------------:|
| ExerciseImportResponse |      16      |Getters och setters|
|ExerciseController| 80| Method "image" behöver testning med mock|

# Plan-api

| Class   |      Coverage (%)      | Comment |
|----------|:-------------:|:-------------:|
| Plan |  70 | Getters och setter|
| PlanApiApplication |  0 | Main|
| PlanController |  100 | |

# Tag-api

| Class   |      Coverage (%)      | Comment |
|----------|:-------------:|:-------------:|
| ExerciseTag |  100 | Getters och setters|
| ExerciseTagController |  72 | Behövs mocking|
| ExerciseTagMap |  0 | Getters och setters|
| Tag |  100 | |
| TagApiApplication |  0 | Main|
| TagController |  100 | |
|TechniqueTag| 71| En getter och setter som inte är testad|
|TechniqueTagController|75| postImport och getExport behöver mocktestning|
|TechniqueTagMap| 0| Enbart getters och setters|
|WorkoutTag| 100||
|WorkoutTagController| 100| Långa tester|

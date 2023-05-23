<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| None | 1 Jan 1970 |
<!-- sign-off-sheet:end -->

# Exercise API

API for exercises.

<api>
name: Add exercise
path: POST api/exercises/add
locked: true
text: |
    Adds a new exercise.

body:

    parameters:
        name: The name of the exercise to add. | Situps
        description: Description of the exercise. | Cool exercise
        duration: The default? duration of the exercise, in minutes. | 5

examples:
  - name: 200
    request: POST api/exercises/add
    response:
        content-type: application/json
        body: |
            {
                "id": 13,
                "name": "Situps",
                "description": "Cool exercise",
                "duration": 5
            }
</api>

<api>
name: Get exercises
path: POST api/exercises/all
locked: true
text: |
    Gets all exercises.

body:
    parameters:
        name: The name of the exercise to add. | Situps
        description: Description of the exercise. | Cool exercise
        duration: The default? duration of the exercise, in minutes. | 5

examples:
  - name: 200
    request: POST api/exercises/add
    response:
        content-type: application/json
        body: |
            {
                "id": 13,
                "name": "Situps",
                "description": "Cool exercise",
                "duration": 5
            }
</api>


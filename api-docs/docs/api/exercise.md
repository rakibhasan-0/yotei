<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
| Grupp 5 Cyclops | 1 June 2023 |
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
    request: |
        POST api/exercises/add

        {
            "name": "Situps",
            "description": "Cool exercise",
            "duration": 5
        }
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
name: Get exercise by id
path: GET api/exercises/:foo
locked: true
text: |
    Gets an exercise by id.

path-params:
    parameters:
        foo: The id of the exercise. | 1337


examples:
  - name: 200
    request: GET api/exercises/12
    response:
        content-type: application/json
        body: |
            {
                "id": 12,
                "name": "Situps",
                "description": "Cool exercise",
                "duration": 5
            }
</api>


<api>
name: Update an exercise
path: PUT api/exercises/update
locked: true
text: |
    Updates an existing exercise.

body:
    parameters:
        id: the id of the exercise to update | 12
        name: The name of the exercise to update. | Situps
        description: Description of the exercise to update. | Cool exercise
        duration: The duration of the exercise to update, in minutes. | 5

examples:
  - name: 200
    request: |
        PUT api/exercises/update

        {
            "id": 13,
            "name": "Situps",
            "description": "Cool exercise",
            "duration": 5
        }
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
name: Delete an exercise by id
path: DELETE api/exercises/remove/:foo
locked: true
text: |
    Delete an exercise by id.

path-params:
    parameters:
        foo: The id of the exercise. | 1337


examples:
  - name: 200
    request: DELETE api/exercises/remove/12
    response:
        content-type: application/json
        body:
</api>

<api>
name: Uploads an image to ./database/images
path: POST api/exercises/image
locked: true
text: |
    Uploads an image to the ./database/images folder on the server. Note that this does not associate the uploaded image with any exercise.

body:
    type: multipart/form-data
    text: |
        The image data under coupled to the key "file". See the frontend component UploadMedia.jsx for example usage of a similar endpoint.
</api>

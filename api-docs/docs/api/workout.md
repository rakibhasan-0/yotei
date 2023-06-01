<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name     | Date        |
|----------|-------------|
| Minotaur | 24 maj 2023 |

<!-- sign-off-sheet:end -->

# Workout API

API for workouts.

<api>
name: Register a workout as favorite

path: POST /api/workouts/favorites

locked: true

text: |
    Adds a workout to the favorites table

body:

    type: application/json
    parameters:
        userId: Id of the user | 1
        workoutId: Id of the workout | 1

examples:
  - status: 200
  
      request: |

        POST /api/workouts/favorites
        {
            "userId": 1,
            "workoutId": 2
        }

    response:

      content-type: text/plain
      body: <empty>

  - status: 400

    request: |

      POST /api/workouts/favorites
      {}

    response: 

      content-type: text/plain
      body: <empty>
</api>

<api>
name: Removes a workout from favorites

path: DELETE /api/workouts/favorites

locked: true

text: |
    Removes a workout from the favorites table

body:

    type: application/json
    parameters:
        userId: Id of the user | 1
        workoutId: Id of the workout | 1

examples:
  - status: 200
  
      request: |

        DELETE /api/workouts/favorites
        {
            "userId": 1,
            "workoutId": 2
        }

    response:

      content-type: text/plain
      body: <empty>

  - status: 400

    request: |
      
        POST /api/workouts/favorites
        {}

    response: 

        content-type: text/plain
        body: <empty>
</api>

<api>
name: Get favorite workouts from userId

path: GET /api/workouts/favorites/{userId}

locked: true

text: |
    Get favorite workouts from userId

body:

    type: application/json
    parameters:
        userId: The id of the user | 1

examples:
  - status: 200

    request: GET /api/workouts/favorites/1

    response:

        content-type: application/json
        body: |
            [
              {
                  "id": 162,
                  "name": "Kyrkan på fredag kväll med prästen",
                  "desc": "ALEXANDER BJUDER PÅ FIKA",
                  "duration": 115,
                  "created": "2023-05-31",
                  "changed": "2023-06-01",
                  "date": "2023-05-31T00:00:00.000+00:00",
                  "hidden": false,
                  "author": 1
              },
              {
                  "id": 155,
                  "name": "Alexanders järnvägsapotek",
                  "desc": "Öppet från nu till sen \nIPREN, ALVEDON OCH NÄSSPRAY MOT NÄSBLOD",
                  "duration": 720,
                  "created": "2023-05-31",
                  "changed": "2023-05-31",
                  "date": "2023-05-31T00:00:00.000+00:00",
                  "hidden": false,
                  "author": 3
              }
            ]
</api>

<api>
name: Gets the state of a specific workout

path: GET /api/workouts/favorites/{userId}/{workoutId}

locked: true

text: |
    Get the state of a specific workout

body:

    type: application/json
    parameters:
        userId: The id of the user | 1
        workoutId: The if of the workout | 1

examples:
  - status: 200

    request: GET /api/workouts/favorites/1/162

    response:

        content-type: application/json
        body: |
            true
</api>

<api>
name: Workout detail


path: GET /detail/{id}

locked: true

text: |
    Api endpoint for getting details about a detail

examples:
  - status: 200
  
    request:

        GET /detail/166

    response:

        content-type: application/json
        body: |
          {
            "id": 166,
            "name": "passmeistr",
            "description": "lppkp",
            "duration": 1000000039,
            "created": "2023-06-01",
            "changed": "2023-06-01",
            "date": "2023-06-01T00:00:00.000+00:00",
            "hidden": false,
            "author": {
                "user_id": 1,
                "username": "admin"
            },
            "activityCategories": [
                {
                    "categoryName": "Uppvärmning",
                    "categoryOrder": 1,
                    "activities": [
                        {
                            "id": 964,
                            "exercise": null,
                            "technique": {
                                "id": 20,
                                "name": "Stryptag mot liggande, mellan benen, Juji gatame, shiho nage gatame",
                                "description": "",
                                "belts": [
                                    {
                                        "id": 11,
                                        "name": "Brunt",
                                        "color": "83530C",
                                        "child": false
                                    }
                                ],
                                "tags": [
                                    {
                                        "id": 80,
                                        "name": "målsättning och motivation"
                                    }
                                ]
                            },
                            "text": null,
                            "name": "Stryptag mot liggande, mellan benen, Juji gatame shiho nage gatame",
                            "duration": 0,
                            "order": 8
                        }
                    ]
                }
            ],
            "tags": [
                {
                    "id": 186,
                    "name": "En fin tagg"
                }
            ]
        }

</api>

<api>
name: All workouts

path: GET /all

locked: true

text: |
    Api endpoint for getting details about a detail

body:
    parameters:
        workout: Object containg information about workout. | See example
        activities: List of activities. | See example
        users: List of users. | 1,2
        tagIds: List of tag ids. | 1,2

examples:
  - status: 200

    request:

        GET /detail/166

    response:

        content-type: application/json
        body: <empty>

</api>

<api>
name: All workouts

path: GET /all

locked: true

text: |
    Api endpoint for getting all workouts

examples:
  - status: 200

    request:

        GET /all
    response:

        content-type: application/json
        body: |
          [
            {
              "name": "Basic Judo Throws",
              "id": 7,
              "desc": "This Judo workout focuses on practicing basic throws such as the hip throw, shoulder throw, and foot sweep. It includes both solo and partner drills to improve technique and timing.",
              "created": "2023-04-29",
              "author": 1
            }
          ]
</api>

<api>
name: All workouts by a user
path: GET /all/{user}
locked: true
text: |
    Api endpoint for getting all workouts created
    by a specific user

examples:
  - status: 200
    request:
      GET /all/1
    response:
      content-type: application/json
      body: |
        [
          {
            "name": "Basic Judo Throws",
            "id": 7,
            "desc": "This Judo workout focuses on practicing basic throws such as the hip throw, shoulder throw, and foot sweep. It includes both solo and partner drills to improve technique and timing.",
            "created": "2023-04-29",
            "author": 1
          }
        ]
</api>

<api>
name: Description of a workout
path: GET /getdesc/{id}
locked: true
text: |
    Gets the description of a workout

examples:
  - status: 200
    request:
      GET /all/166
    response:
      content-type: application/json
      body: |
        {
          "duration": 1000000039,
          "desc": "lppkp",
          "created": "2023-06-01",
          "author": 1
        }
</api>

<api>
name: A complete workout
path: GET /workout/{id}
locked: true
text: |
    Gets a complete workout

examples:
  - status: 200
    request:
      GET /workout/166
    response:
      content-type: application/json
      body: |
        {
          "id": 166,
          "name": "passmeistr",
          "desc": "lppkp",
          "duration": 1000000039,
          "created": "2023-06-01",
          "changed": "2023-06-01",
          "date": "2023-06-01T00:00:00.000+00:00",
          "hidden": true,
          "author": 1
        }
</api>

<api>
name: Workouts by a specific user
path: GET /created/{user}
locked: true
text: |
    Gets all workouts created by a user

examples:
  - status: 200
    request:
      GET /created/1
    response:
      content-type: application/json
      body: |
        [
          {
            "id": 166,
            "name": "passmeistr",
            "desc": "lppkp",
            "duration": 1000000039,
            "created": "2023-06-01",
            "changed": "2023-06-01",
            "date": "2023-06-01T00:00:00.000+00:00",
            "hidden": true,
            "author": 1
          }
        ]
</api>

<api>
name: Adds a complete workout
path: POST /add_full_workout
locked: true
text: |
    Gets all workouts created by a user
body: |
  {
    "workout":{"name": "cool_name", "desc": "cool_desc", duration: 2},
    "activeties":[
      {"exerciseId": 2, "techniqueId": null, "name": "name", "desc": "desc", "duration": 1, "order": 0}
    ]
  }

examples:
  - status: 200
    request:
      POST /add_full_workout
    response:
      content-type: application/json
      body: |
        {
          "id": 166,
          "name": "passmeistr",
          "desc": "lppkp",
          "duration": 1000000039,
          "created": "2023-06-01",
          "changed": "2023-06-01",
          "date": "2023-06-01T00:00:00.000+00:00",
          "hidden": true,
          "author": 1
        }
</api>

<api>
name: Adds a complete workout
path: POST /
locked: true
text: |
    Gets all workouts created by a user
body: |
  {
    "workout":{"name": "cool_name", "desc": "cool_desc", duration: 2},
    "activeties":[
      {"exerciseId": 2, "techniqueId": null, "name": "name", "desc": "desc", "duration": 1, "order": 0}
    ]
  }

examples:
  - status: 200
    request:
      POST /
    response:
      content-type: application/json
      body: |
        {
          "id": 166,
          "name": "passmeistr",
          "desc": "lppkp",
          "duration": 1000000039,
          "created": "2023-06-01",
          "changed": "2023-06-01",
          "date": "2023-06-01T00:00:00.000+00:00",
          "hidden": true,
          "author": 1
        }
</api>

<api>
name: Updates a workout
path: PUT /
locked: true
text: |
    Gets all workouts created by a user
body: |
  {
    "workout":{"name": "cool_name", "desc": "cool_desc", duration: 2},
    "activeties":[
      {"exerciseId": 2, "techniqueId": null, "name": "name", "desc": "desc", "duration": 1, "order": 0}
    ]
  }

examples:
  - status: 200
    request:
      PUT /
    response:
      content-type: application/json
      body: |
        {
          "id": 166,
          "name": "passmeistr",
          "desc": "lppkp",
          "duration": 1000000039,
          "created": "2023-06-01",
          "changed": "2023-06-01",
          "date": "2023-06-01T00:00:00.000+00:00",
          "hidden": true,
          "author": 1
        }
</api>

<api>
name: Removes a workout
path: DELETE /delete/{id}
locked: true
text: |
    Removes a workout, without deleting activities related to it

examples:
  - status: 200
    request:
      DELETE /delete/166
</api>

<api>
name: Removes a workout
path: DELETE /delete_full_workout/{id}
locked: true
text: |
    Removes a workout

examples:
  - status: 200
    request:
      DELETE /delete_full_workout/166
</api>

<api>
name: Updates a workout
path: PUT /update_full_workout
locked: true
text: |
  Updates a workout and activities in the database
body: |
  {
    "workout":{"name": "cool_name", "desc": "cool_desc", duration: 2},
    "activeties":[
      {"exerciseId": 2, "techniqueId": null, "name": "name", "desc": "desc", "duration": 1, "order": 0}
    ]
  }

examples:
  - status: 200
    request:
      PUT /update_full_workout
    response:
      content-type: application/json
      body: |
        {
          "id": 166,
          "name": "passmeistr",
          "desc": "lppkp",
          "duration": 1000000039,
          "created": "2023-06-01",
          "changed": "2023-06-01",
          "date": "2023-06-01T00:00:00.000+00:00",
          "hidden": true,
          "author": 1
        }
</api>

<api>
name: Gets reviews for a workout
path: GET /reviews?id={workout}
locked: true
text: |
  Returns a list of all reviews for a workout

examples:
  - status: 200
    request:
      GET /reviews?id=166
    response:
      content-type: application/json
      body: |
        [
            {
                "user_id": 1,
                "username": "admin",
                "rating": 0,
                "review_id": 34,
                "positive_comment": "Ser bra ut",
                "negative_comment": "",
                "review_date": "2023-06-01T00:00:00.000+00:00",
                "workout_id": 166
            }
        ]
</api>

<api>
name: Puts a review on a workout
path: POST /reviews
locked: true
text: |
  Inserts a review for a workout
body: |
  {"workoutId":"166","userId":1,"rating":0,"positiveComment":"Ser bra ut","negativeComment":"","date":"2023-06-01"}

examples:
  - status: 200
    request:
      POST /reviews
      body: |
      {"workoutId":"166","userId":1,"rating":0,"positiveComment":"Ser bra ut","negativeComment":"","date":"2023-06-01"}
    response:
      content-type: application/json
      body: |
        [
            {
                "user_id": 1,
                "username": "admin",
                "rating": 0,
                "review_id": 34,
                "positive_comment": "Ser bra ut",
                "negative_comment": "",
                "review_date": "2023-06-01T00:00:00.000+00:00",
                "workout_id": 166
            }
        ]
</api>

<api>
name: Removes a review for a workout
path: DELETE /reviews?id={workout}
locked: true
text: |
  Removes a review in a workout

examples:
  - status: 200
    request:
      DELETE /reviews?id=166
</api>

<api>
name: Puts a review on a workout
path: PUT /reviews
locked: true
text: |
  Updates a review for a workout
body: |
  {"workoutId":"166","userId":1,"rating":0,"positiveComment":"Ser bra ut","negativeComment":"","date":"2023-06-01"}

examples:
  - status: 200
    request:
      PUT /reviews
      body: |
      {"workoutId":"166","userId":1,"rating":0,"positiveComment":"Ser bra ut","negativeComment":"","date":"2023-06-01"}
    response:
      content-type: application/json
      body: |
        [
            {
                "user_id": 1,
                "username": "admin",
                "rating": 0,
                "review_id": 34,
                "positive_comment": "Ser bra ut",
                "negative_comment": "",
                "review_date": "2023-06-01T00:00:00.000+00:00",
                "workout_id": 166
            }
        ]
</api>

<api>
name: Gets associated techniques for a workout
path: GET /associated/technique/{id}
locked: true
text: |
  Gets associated techniques for a workout

examples:
  - status: 200
    request:
      GET /associated/technique/166
    response:
      content-type: application/json
      body: |
        [
            {
              "id": 1,
              "name": "Empi uchi, jodan och chudan (1 Kyu)",
              "description": "",
              "belts": [
                  {
                      "id": 11,
                      "name": "Brunt",
                      "color": "83530C",
                      "child": false
                  }
              ],
              "tags": [
                  {
                      "id": 4,
                      "name": "grönt"
                  },
                  {
                      "id": 26,
                      "name": "throws"
                  },
                  {
                      "id": 42,
                      "name": "rörelsetekniker"
                  }
              ]
          }
        ]
</api>

<api>
name: Gets associated exercises for a workout
path: GET /associated/exercise/{id}
locked: true
text: |
  Gets associated exercises for a workout

examples:
  - status: 200
    request:
      GET /associated/exercise/166
    response:
      content-type: application/json
      body: |
        [
          {
              "id": 287,
              "name": "Jumping Jacks",
              "duration": 20
          }
        ]
</api>
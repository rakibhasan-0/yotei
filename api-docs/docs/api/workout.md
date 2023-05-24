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
name: Post Workout
path: POST /api/workouts
locked: true
text: |
      Api endpoint for adding a new workout.
body: 

    parameters:
        workout: Object containg information about workout. | See example
        activities: List of activities. | See example
        users: List of users. | 1,2
        tagIds: List of tag ids. | 1,2
examples:
  - name: 200 
    request: | 
      POST /api/workouts
  
       {
         "workout": {
           "name": "test",
           "desc": "fdsa",
           "duration": 15,
           "created": "2024-06-16",
           "date": "2023-05-17",
           "hidden": true,
           "author": 1
         },
         "activities": [
           {
           "techniqueId": 2,
           "categoryName": "string 12",
           "categoryOrder": 10,
           "name": "Empi uchi, jodan och chudan (1 Kyu) OMG!",
           "desc": "string 12",
           "duration": 10,
           "order": 1
           }
         ],
         "users": [
          1
         ],
         "tagIds": [
           34,
           1
         ]
       }
-   response:
    content-type: text/plain
    body: <empty>
      } 
</api>

<api>
    name: PUT Workout
    path: PUT /api/workouts
    locked: true
    text: |
    Api endpoint for update a workout.
    body:

    parameters:
    workout: Object containg information about workout. | See example
    activities: List of activities. | See example
    users: List of users. | 1,2
    tagIds: List of tag ids. | 1,2
    examples:
- name: 200
  request: |
  PUT /api/workouts

       {
         "workout": {
           "id": 55,
           "name": "test",
           "desc": "fdsa",
           "duration": 15,
           "created": "2024-06-16",
           "date": "2023-05-17",
           "hidden": true,
           "author": 1
         },
         "activities": [
           {
           "techniqueId": 2,
           "categoryName": "string 12",
           "categoryOrder": 10,
           "name": "Empi uchi, jodan och chudan (1 Kyu) OMG!",
           "desc": "string 12",
           "duration": 10,
           "order": 1
           }
         ],
         "users": [
          1
         ],
         "tagIds": [
           34,
           1
         ]
       }
 
 response:
    content-type: text/plain
    body: <empty>
    }
</api>
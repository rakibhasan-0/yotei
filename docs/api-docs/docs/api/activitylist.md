<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Tomato | 16 May 2024 |
<!-- sign-off-sheet:end -->

# ActivityList API

API for ActivityList and ActivityListEntry

<api>
name: addEntry
path: POST api/activitylistentry/add
locked: true
text: |
    Adds an entry to an activity list

body:
    type: application/json
    parameters: 
        list_id: id of the activity list to which the entry will be added | 1
        exercise_id: id of an exercise, nullable | 289
        technique_id: id of a technique, nullable | null
examples:
  - name: 200
    request: |
        POST api/activitylistentry/add
        {
            "list_id":1
            "exercise_id":289
            "technique_id":null
        }
    response:
        200 OK
</api>

<api>
name: addEntryToMultipleLists
path: POST api/activitylistentry/multiAdd
locked: true
text: |
    Adds an entry to multiple activity lists

body:
    header: 
        ids: list of ids to which the entry will be added | 4,5,6
    parameters: 
        list_id: id of the activity list to which the entry will be added | 4
        exercise_id: id of an exercise, nullable |
        technique_id: id of a technique, nullable
examples:
  - name: 200
    request: |
        POST api/activitylistentry/add
        {
            "ids":4,5,6
            "list_id":4
            "exercise_id":286
            "technique_id":56
        }
    response:
        200 OK
</api>

<api>
name: getEntriesForList
path: GET api/activitylistentry/all/{list_id}
locked: true
text: |
    Gets all entries from an activity list

path-params:
    parameters:
        list_id: the id of the activity list | 1
examples:
  - name: 200
    request: |
        GET api/activitylistentry/all/{1}
    response:
        [
            {
                "technique": null,
                "exercise": {
                "id": 285,
                "name": "Springa",
                "description": "Placera ena foten framför den andra och upprepa!",
                "duration": 10
                }
            },
            {
                "technique": null,
                "exercise": {
                "id": 286,
                "name": "Burpees",
                "description": "Börja ståendes, gör en armhävning, hoppa upp och klappa händerna över huvudet!",
                "duration": 30
                }
            },
            {
                "technique": {
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
                    "id": 26,
                    "name": "throws"
                    },
                    {
                    "id": 4,
                    "name": "grönt"
                    },
                    {
                    "id": 42,
                    "name": "rörelsetekniker"
                    }
                ]
                },
                "exercise": null
            }
        ]
</api>
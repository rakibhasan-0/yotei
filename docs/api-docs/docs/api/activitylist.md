<api>
name: Add entry
path: POST /activitylistentry/add/
locked: true
text: |
    Add an entry to an activityList. 

body:
    type: application/json
    text: |
        Only exercise OR technique id should be set for a single entry. 
    parameters:
        listId: The list id of the activity list. | 1
        exerciseId: The id of the exercise. | 287
        techniqueId: The id of the technique. | null
        duration: The duration of the exercise, can be null. | 20 

query-params:
    text: |
        Token is needed to check ownership/editability of activity list.
    parameters:
        token: User token for authentication. | longTokenStringx123.

examples:
  - name: 200
    request: |
        POST /activitylistentry/add

        {
            "listId": 2,
            "exerciseId": 287,
            "techniqueId": null,
            "duration": 20
        }
    response:
        content-type: text/plain
        body: <empty>
</api>

<api>
name: Add entry to multiple lists
path: POST /activitylistentry/multiAdd/
locked: true
text: |
    Add an entry to multiple activityLists. 

body:
    type: application/json
    text: |
        Only exercise OR technique id should be set for a single entry. 
    parameters:
        listId: The list id of the activity list. | 1
        exerciseId: The id of the exercise. | 287
        techniqueId: The id of the technique. | null
        duration: The duration of the exercise, can be null. | 20 

query-params:
    text: |
        Token is needed to check ownership/editability of activity list.
        The listId in the entry can be included in the 'ids' list, but also does not have to be. 
        The entry will be added to the listId in the entry + the list of ids. 
    parameters:
        token: User token for authentication. | longTokenStringx123.
        ids: List of activityList ids to which the entry will be added. | 4,5,6

examples:
  - name: 200
    request: |
        POST /activitylistentry/multiAdd

        {
            "ids":2,3,4,5
            "listId": 2,
            "exerciseId": 287,
            "techniqueId": null,
            "duration": 20
        }
    response:
        content-type: text/plain
        body: <empty>
</api>

<api>
name: Get entries for list
path: GET /activitylistentry/all/{listId}/
locked: true
text: |
    Retrieves all entries from an activityList.

path-params:
    parameters:
        listId: The id of the activityList. | 10
query-params:
    text: |
        Token is needed to check ownership/editability of activity list.
    parameters:
        token: User token for authentication. | longTokenStringx123.

examples:
  - name: 200
    request: |
        Get /activitylistentry/all/1
    response:
        content-type: text/plain
        body: [
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
                    "technique": null,
                    "exercise": {
                    "id": 287,
                    "name": "Jumping Jacks",
                    "description": "Hoppa upp och brett isär benen samtidigt som du tar armarna upp ovanför huvudet, hoppa sedan tillbaka till startpositionen!",
                    "duration": 20
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
                        "id": 4,
                        "name": "grönt"
                        },
                        {
                        "id": 42,
                        "name": "rörelsetekniker"
                        },
                        {
                        "id": 26,
                        "name": "throws"
                        }
                    ]
                    },
                    "exercise": null
                }
            ]
</api>
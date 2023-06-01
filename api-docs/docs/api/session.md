<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Chimera | 1 Jun 2023 |
<!-- sign-off-sheet:end -->

# Session API

API for sessions.

<api>
name: Get session from id

path: GET /api/session/get

locked: true

text: |
    Get session by id

body:

    type: application/json
    parameters:
        id: The id of the session | 1

examples:
  - name: 200

    request: GET /api/session/get?id=1

    response:

        content-type: application/json
        body: |
            {
                "id": 2,
                "text": "Intermediate Judo träning",
                "workout": 3,
                "plan": 2,
                "date": "2023-04-02",
                "time": "14:00:00"
            }
</api>

<api>
name: Get sessions

path: GET /api/session/all

locked: true

text: |
    Returns all sessions.

examples:
  - name: 200

    request: GET /api/session/all

    response:

        content-type: application/json
        body: |
            [
                {
                    "id": 2,
                    "text": "Intermediate Judo träning",
                    "workout": 3,
                    "plan": 2,
                    "date": "2023-04-02",
                    "time": "14:00:00"
                },
                {
                    "id": 3,
                    "text": "Intermediate Judo träning",
                    "workout": 2,
                    "plan": 2,
                    "date": "2023-04-02",
                    "time": "14:00:00"
                }
            ]
</api>

<api>
name: Register session

path: POST /api/session/add

locked: true

text: |
    Adds a single session to the database.

body:

    type: application/json
    parameters:
        date: Date of session | 2023-06-01T08:07:00+000Z
        plan: id of linked plan | 1
        workout: id of linked workout | 1
        time: time of workout | 08:07

examples:
  - name: 200
  
      request: |

        POST /api/session/add
        {
            "date": "2023-06-01T08:07:00+000Z",
            "plan": 1,
            "workout": 1,
            "time": "08:07"
        }

    response:

        content-type: text/plain
        body: <empty>
</api>

<api>
name: Post addList

path: POST /api/session/addList

locked: true

text: |
    Adds a list of sessions into the database.

</api>

<api>
name: Remove session

path: DELETE /api/session/delete

locked: true

text: |
    Removes a session from id.

path-params:
    parameters:

        id: The id of the session to delete. | 1

examples:
  - name: 200

    request: DELETE /api/session/delete?id=1

    response:

        content-type: text/plain
        body: <empty>
  - name: 404

    request: DELETE /api/session/delete?id=-1000

    response:

        body: <empty>
</api>

<api>
name: Remove session from plan

path: DELETE /api/session/deleteByPlan

locked: true

text: |
    Removes a session by plan

path-params:
    parameters:
        id: The id of the plan to delete session from. | 1

examples:
  - name: 200

    request: DELETE /api/session/deleteByPlan?id=1

    response:

        content-type: text/plain
        body: <empty>
  - name: 404

    request: DELETE /api/session/deleteByPlan?id=-1000

    response:

        body: <empty>
</api>

<api>
name: Get session from plan

path: GET /api/session/getByPlan

locked: true

text: |
    Get session by plan id

body:

    type: application/json
    parameters:
        id: Plan id to get sessions from | 1

examples:
  - name: 200
    request: GET /api/session/getByPlan?id=1
    
    response:

        content-type: application/json
        body: |
            [
                {
                    "id": 2,
                    "text": "Intermediate Judo träning",
                    "workout": 3,
                    "plan": 2,
                    "date": "2023-04-02",
                    "time": "14:00:00"
                }
            ]
</api>

<api>
name: Get session from plans

path: GET /api/session/getByPlans

locked: true

text: |
    Get session by list of plan id:s

body:

    type: application/json
    parameters:
        id: list of plan id:s to get sessions from | 1, 2

examples:
  - name: 200
    request: GET /api/session/getByPlans?id=1&id=2
    
    response:

        content-type: application/json
        body: |
            [
                {
                    "id": 2,
                    "text": "Intermediate Judo träning",
                    "workout": 3,
                    "plan": 2,
                    "date": "2023-04-02",
                    "time": "14:00:00"
                }
            ]
</api>

<api>
name: Update session

path: PUT /api/session/update

locked: true

text: |
    Updates a session


body:

    type: application/json
    parameters:
        text: | "hejsan"
        time: Time of session | "08:07"
        workout: Id of linked workout | 1
        plan: Id of linked plan | 1
        date: Date of session | "2023-06-01T08:07:00+000Z"
  
examples:
  - name: 200
    request: |
        PUT /api/session/update?id=1

        {
            "text": "",
            "time": "08:07,
            "workout": 1,
            "plan": 1,
            "date": "2023-06-01T08:07:00+000Z"
        }
    response:

        content-type: text/plain
        body: <empty>
</api>
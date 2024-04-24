<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Cyclops | 1 June 2023 |
<!-- sign-off-sheet:end -->

# Plan API

API for plan.

<api>
name: Create a new plan. 
path: POST /api/plan/add
locked: true
text: |
    Creates a new plan.

body:
    type: application/json
    parameters:
        name: The name of the group. | "Grupp grön"
        belts: The belts assigned to the plan. | See example
        userId: The id of user that created the plan. | 1

examples:
  - name: 201
    request: |
        POST /api/plan/add
        
        {
            "name": "Ny grupp för test", 
            "belts": 
                [{
                    "id": 4,
                    "name": "Gult",
                    "color": "FFDD33",
                    "child": true
                },
                {
                    "id": 5,
                    "name": "Orange",
                    "color": "FFA133",
                    "child": false
                }]
            "userId": 1
        }
        
    response:
        content-type: application/json
        body: |
            {
                "id": 73
                "userId": 1
                "name": "Ny grupp för test", 
                "belts": 
                    [{
                        "id": 4,
                        "name": "Gult",
                        "color": "FFDD33",
                        "child": true
                    },
                    {
                        "id": 5,
                        "name": "Orange",
                        "color": "FFA133",
                        "child": false
                    }]   
            }

  - name: 409
    request: |
        POST /api/plan/add
        
        {
            "name": "Ny grupp för test", 
            "belts": 
                [{
                    "id": 4,
                    "name": "Gult",
                    "color": "FFDD33",
                    "child": true
                },
                {
                    "id": 5,
                    "name": "Orange",
                    "color": "FFA133",
                    "child": false
                }]
            "userId": 1
        }
        
    response:
        content-type: application/json
        body:

  - name: 400
    request: |
        POST /api/plan/add
        
        {
            "name": "", 
            "belts": 
                [{
                    "id": 4,
                    "name": "Gult",
                    "color": "FFDD33",
                    "child": true
                },
                {
                    "id": 5,
                    "name": "Orange",
                    "color": "FFA133",
                    "child": false
                }]
            "userId": 1
        }
        
    response:
        content-type: application/json
        body: 
</api>

<api>
name: Remove a plan. 
path: POST /api/plan/remove:id
locked: true
text: |
    Creates a new plan.

path-params:
    parameters:
        id: The id of the plan. | 9

examples:
  - name: 200
    request: |
        DELETE /api/plan/remove?id=9
        
    response:
        content-type: application/json
        body: 
        
  - name: 404
    request: |
        DELETE /api/plan/remove?id=-1
        
    response:
        content-type: application/json
        body: 
</api>

<api>
name: Update an existing plan.
path: PUT api/plan/update
locked: true
text: |
    Adds a new exercise.

body:
    type: application/json
    parameters:
        id: The id of the existing plan. | 1
        name: The name of the updated plan. | "Situps"
        startDate: Start date of the updated plan. | "2023-05-05"
        endDate: End date of the updated plan. | "2023-05-06"
        userId: Owner of the updated plan. | 5
        belts: A list of belts. | See example

examples:
  - name: 200
    request: |
        PUT api/plan/update

        {
            "id":1,
            "name":"updated plan",
            "startDate":"2020-03-23",
            "endDate":"2022-04-23",
            "userId":1,
            "belts": [
                {
                "belt_id": 1
                }
            ]
        }
    response:
        content-type: application/json
        body: |
            {
                "id":1,
                "name":"updated plan",
                "startDate":"2020-03-23",
                "endDate":"2022-04-23",
                "userId":1,
                "belts": [
                    {
                        "belt_id": 1
                    }
                ]
            }
</api>

<api>
name: Get all plans. 
path: POST /api/plan/all
locked: true
text: |
    Returns all plans.

examples:
  - name: 200
    request: |
        GET /api/plan/all
        
    response:
        content-type: application/json
        body: |
            [{
                "id": 2,
                "name": "Orange och Gult bälte träning",
                "userId": 1,
                "belts": [{
                    "id": 9,
                    "name": "Blått",
                    "color": "1E9CE3",
                    "child": false
                }, {
                    "id": 5,
                    "name": "Orange",
                    "color": "FFA133",
                    "child": false
                }]
            }, {
                "id": 3,
                "name": "Svart bälte träning",
                "userId": 1,
                "belts": [{
                    "id": 9,
                    "name": "Blått",
                    "color": "1E9CE3",
                    "child": false
                }]
            }]   
</api>

<!-- write documentation here! -->
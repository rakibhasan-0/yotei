<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name   | Date          |
| ------ | ------------- |
| Tomato | 26th May 2024 |

<!-- sign-off-sheet:end -->

# Activity List API

API for retrieving, creating, removing, and editing activity list objects.

<api>
name: Add Activity List
path: POST /api/activitylists/add
text: |
    Adds a new activity list. Requires a valid user token and a complete activity list request body.

body:
type: application/json
parameters:
id: The ID of the activity list. | 1
author: The ID of the author. | 1
name: The name of the activity list. | xx
desc: The description of the activity list. | king
hidden: Whether the list is hidden. | true
date: The date of the activity list. | [2024,5,3]

examples:

-   name: 201
    request: |
    POST /api/activitylists/add

        {
            "id": 1,
            "name": "my list",
            "desc": "description of list",
            "hidden": true,
            "date": [2024,5,3],
            "users": [1,2],
            "activities": [
                {
                    "type": "exercise",
                    "id": 286,
                    "duration": 20
                }
            ]
        }

        response:
            content-type: application/json
            body: 1

-   name: 401
    request: |
    POST /api/activitylists/add

        {
            "id": 1,
            "name": "my list",
            "desc": "description of list",
            "hidden": true,
            "date": [2024,5,3],
            "users": [1,2],
            "activities": [
                {
                    "type": "exercise",
                    "id": 286,
                    "duration": 20
                }
            ]
        }

        response:
            content-type: text/plain
            body: Unauthorized

-   name: 400
    request: |
    POST /api/activitylists/add

        {
            "desc": "hi"
        }

        response:
            content-type: text/plain
            body: Bad Request

-   name: 409
    request: |
    POST /api/activitylists/add

        {
            "id": 1,
            "author": 1,
            "name": "existing name",
            "desc": "king",
            "hidden": true,
            "date": [2024,5,3]
        }

        response:
            content-type: text/plain
            body: Conflict

-   name: 403
    request: |
    POST /api/activitylists/add

            {
                "id": 1,
                "author": 2,
                "name": "xx",
                "desc": "king",
                "hidden": true,
                "date": [2024,5,3]
            }

        response:
          content-type: text/plain
          body: Forbidden

</api>

<api>
name: Remove Activity List
path: DELETE /api/activitylists/remove
text: |
Removes an existing activity list. Requires a valid user token and the ID of the list to be removed.

parameters:
id: The ID of the activity list to remove. | 1

examples:

-   name: 200
    request: |
    DELETE /api/activitylists/remove?id=1

        response:
            content-type: text/plain
            body: OK

-   name: 401
    request: |
    DELETE /api/activitylists/remove?id=1

        response:
            content-type: text/plain
            body: Unauthorized

-   name: 403
    request: |
    DELETE /api/activitylists/remove?id=1

        response:
            content-type: text/plain
            body: Forbidden

-   name: 404
    request: |
    DELETE /api/activitylists/remove?id=1000

        response:
          content-type: text/plain
          body: Not Found

<api/>

<api>
name: Edit Activity List
path: PUT /api/activitylists/edit
text: |
    Edits an existing activity list. Requires a valid user token and the updated activity list request body.

body:
type: application/json
parameters:
id: The ID of the activity list. | 1
name: The new name for the activity list. | New Name
desc: The new description for the activity list. | New Description

examples:

-   name: 200
    request: |
    PUT /api/activitylists/edit

        {
            "id": 1,
            "name": "New Name",
            "desc": "New Description"
        }

        response:
            content-type: application/json
            body: 1

-   name: 401
    request: |
    PUT /api/activitylists/edit

        {
            "id": 1,
            "name": "New Name",
            "desc": "New Description"
        }

        response:
            content-type: text/plain
            body: Unauthorized

-   name: 404
    request: |
    PUT /api/activitylists/edit

        {
            "id": 1000,
            "name": "New Name",
            "desc": "New Description"
        }

        response:
            content-type: text/plain
            body: Not Found

-   name: 400
    request: |
    PUT /api/activitylists/edit

        {
            "id": 1,
            "desc": 123
        }

        response:
            content-type: text/plain
            body: Bad Request

-   name: 403
    request: |
    PUT /api/activitylists/edit

            {
                "id": 1,
                "name": "New Name",
                "desc": "New Description"
            }

        response:
          content-type: text/plain
          body: Forbidden

</api>

<api>
name: Get User Activity Lists
path: GET /api/activitylists/userlists
text: |
    Fetches all activity lists that the user has created. Requires a valid user token.

examples:

-   name: 200
    request: |
    GET /api/activitylists/userlists

        response:
            content-type: application/json
            body: |
            [
                {
                    "id": 1,
                    "name": "List 1",
                    "desc": "Description 1"
                },
                {
                    "id": 2,
                    "name": "List 2",
                    "desc": "Description 2"
                }
            ]

-   name: 204
    request: |
    GET /api/activitylists/userlists

        response:
            content-type: application/json
            body: []

-   name: 401
    request: |
    GET /api/activitylists/userlists

        response:
          content-type: text/plain
          body: Unauthorized

</api>

<api>
name: Get All Activity Lists
path: GET /api/activitylists
text: |
    Fetches all activity lists that the user has access to, with optional filters. Requires a valid user token.

parameters:
hidden: Whether to return hidden lists. | true
isAuthor: Whether to return only the lists created by the user. | true

examples:

-   name: 200
    request
    GET /api/activitylists?hidden=true&isAuthor=true

        response:
          content-type: application/json
          body: |
            [
                {
                    "id": 1,
                    "name": "List 1",
                    "desc": "Description 1"
                },
                {
                    "id": 2,
                    "name": "List 2",
                    "desc": "Description 2"
                }
            ]

-   name: 204
    request: |
    GET /api/activitylists?hidden=true&isAuthor=true

        response:
            content-type: application/json
            body: []

-   name: 401
    request: |
    GET /api/activitylists?hidden=true&isAuthor=true

        response:
          content-type: text/plain
          body: Unauthorized

</api>

<api>
name: Get Activity List Details
path: GET /api/activitylists/{id}
text: |
    Fetches the details of an activity list by its ID. Requires a valid user token and the ID of the activity list.

path-params:
parameters:
id: The ID of the activity list. | 1

examples:

-   name: 200
    request: GET /api/activitylists/1

        response:
            content-type: application/json
            body: |
            {
            "id": 1,
            "name": "List 1",
            "desc": "Description 1"
            }

-   name: 204
    request: GET /api/activitylists/1000

        response:
            content-type: application/json
            body: []

-   name: 401
    request: GET /api/activitylists/1

        response:
            content-type: text/plain
            body: Unauthorized

-   name: 403
    request: GET /api/activitylists/1

        response:
            content-type: text/plain
            body: Forbidden

-   name: 400
    request: GET /api/activitylists/invalid

        response:
            content-type: text/plain
            body: Bad Request

-   name: 500
    request: GET /api/activitylists/1

        response:
          content-type: text/plain
          body: Internal Server Error

</api>

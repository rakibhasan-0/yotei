<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Grupp 5 Cyclops | 1 Jun 2023 |
<!-- sign-off-sheet:end -->

# Comment API

API for comments.

<!-- write documentation here! -->

<api>
name: Post a comment for an exercise
path: POST /api/comment/exercise/add
locked: true
text: |
    Post a comment for an exercise.

    !!! tip
        This endpoint also needs the http header "userId" set to the user id of the user posting the comment.

body:
    type: application/json
    parameters:
        commentText: The text of the comment | "hej kommentar"

query-params:
    text: |

    parameters:
        id: The exercise id. | 359.


examples:
-   name: 201
    request: |
        POST /api/comment/exercise/add?id=12
        headers: userId: 13

        {
            "commentText": "hej kommentar"
        }
        
    response:
        content-type: application/json
        body:

</api>

<api>
name: Get all comments for an exercise
path: GET /api/comment/exercise/get
locked: true
text: |
    Get the comments for an exercise.

query-params:
    text: |

    parameters:
        id: The exercise id. | 359.


examples:
-   name: 200
    request: |
        GET /api/comment/exercise/get?id=12
        
    response:
        content-type: application/json
        body: |
            [
                {
                    "commentId" : 5,
                    "commentText" : "TTT55",
                    "date" : "2023-05-29",
                    "exerciseId" : 12,
                    "user" : "editor",
                    "userId" : 2,
                    "workoutId" : null
                }
            ]


</api>

<api>
name: Delete a comment by id.
path: DELETE /api/comment/delete
locked: true
text: |
    Delete a comment by its id.

query-params:
    text: |

    parameters:
        id: The comment id. | 359.


examples:
-   name: 200
    request: |
        DELETE /api/comment/delete?id=12
        
    response:
        content-type: application/json
        body: 

</api>
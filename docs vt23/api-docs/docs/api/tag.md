<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name | Date       |
| ---- | ---------- |
| Group 5 Cyclops | 31 May 2023 |

<!-- sign-off-sheet:end -->

# Tag API

API for tags.

<api>
name: Get all tags
path: GET /api/tags
locked: true
text: |
    Get all the tags.

examples:
  - name: 200
    request: |
        GET /api/tags
    response:
        content-type: application/json
        body: |
            [{
                "id": 12,
                "name": "ex1"
            },
            {
                "id": 13,
                "name": "ex2"
            }]

</api>

<api>
name: Delete a tag by id
path: DELETE /api/tags/:foo
locked: true
text: |
    Deletes a tag with id `:foo`.

path-params:
    parameters:
        foo: The id of the new user. | 1337

examples:
  - name: 200
    request: |
        DELETE /api/tags/12
    response:
        content-type: text/plain
        body: <empty>

</api>

<api>
name: Create a new tag
path: POST /api/tags
locked: true
text: |
    Creates a new tag.

body:
    type: application/json
    parameters:
        name: The name of the tag. | "my tag"

examples:
  - name: 200
    request: |
        POST /api/tags

        {
            "name": "my tag"
        }
    response:
        content-type: text/plain
        body: |
            {
                "id": 15,
                "name": "my tag"
            }
</api>

# Exercise Tag API

API for exercise tags.

<api>
name: Create an exercise tag mapping
path: POST /api/tags/exercises
locked: true
text: |
    Creates an exercise tag mapping for a tag and exercise.

body:
    type: application/json
    parameters:
        exerciseId: The exercise id. | 12

query-params:
    text: |

    parameters:
        tag: The tag to link the exercise to. | 359.

examples:
-   name: 200
    request: |
        POST /api/tags?tag=15

        {
            "exerciseId": 12
        }
        
    response:
        content-type: application/json
        body: |
            {
                "exerciseId": 12,
                "tag": {
                    "id": 15,
                    "name": "hej"
                }
            }

</api>

<api>
name: Get all tags for an exercise.
path: GET /api/tags
locked: true
text: |
    Gets all the tags that are linked to the specified exercise.

query-params:
    text: |

    parameters:
        exerciseId: The exercise id. | 359.

examples:
-   name: 200
    request: |
        GET /api/tags?exerciseId=350
        
    response:
        content-type: application/json
        body: |
            [{
                "tagId": 12,
                "tagName": "my tag"
            },
            {
                "tagId": 13,
                "tagName": "my tag 2"
            }]

</api>

<api>
name: Delete an exercise <-> tag mapping.
path: DELETE /api/tags/exercises
locked: true
text: |
    Gets all the tags that are linked to the specified exercise.

body:
    type: application/json
    parameters:
        exerciseId: The id of the exercise. | 12

query-params:
    text: |

    parameters:
        tag: The tag id. | 359.

examples:
-   name: 200
    request: |
        DELETE /api/tags/exercises?tag=350

        {
            "exerciseId": 12
        }
        
    response:
        content-type: text/plain
        body:

</api>

<api>
name: Removes all exercise <-> tag mappings for an exercise
path: DELETE /api/tags/exercises/:foo
locked: true
text: |
    Removes all exercise <-> tag mappings for an exercise.

path-params:
    parameters:
        foo: The id of the exercise. | 350

examples:
-   name: 200
    request: |
        DELETE /api/tags/exercises/350
        
    response:
        content-type: application/json
        body: 
</api>


<!-- write documentation here! -->

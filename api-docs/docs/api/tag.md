<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name | Date       |
| ---- | ---------- |
| None | 1 Jan 1970 |

<!-- sign-off-sheet:end -->

# Tag API

API for tags.

<api>
name: Get all tags
path: GET /api/tags
locked: true
text: |
    Get all the tags.

body:
    <empty>

examples:

-   name: 200
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

body:
    <empty>

path-params:
    parameters:
        foo: The id of the new user. | 1337

examples:

-   name: 200
        request: |
        DELETE /api/tags/12
        response:
            content-type: text/plain
            body: <empty>

</api>

# Exercise Tag API

API for exercise tags.

<api>
name: Create an exercise tag mapping. 
path: POST /api/tags/exercises
locked: true
text: |
    Creates an exercise tag mapping for a tag and exercise.

body:
	type: application/json
	parameters:
		exerciseId: The username for the user to log in as. | admin
		: The password for the user to log in as. | admin

query-params:
    text: |
        
    parameters:
        tagId: This is a query parameter. | example value.

examples:

-   name: 200
    request: |
		GET /api/tags
		
	response:
		content-type: application/json
		body: <empty>

</api>

<!-- write documentation here! -->

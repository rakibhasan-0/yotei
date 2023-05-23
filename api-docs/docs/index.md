# Introduction

All API documentation is consolidated here.

# Documentation progress

Remove this paragraph when documentation is done.

| API Name | Progress |
|--|--|
| User API      | Done & needs verification |
| Belt API      | Not started |
| Exercise API  | In progress (take over please) |
| Plan API      | Not started |
| Tag API       | Not started |
| Technique API | Not started |
| Workout API   | Not started |
| Session API   | Not started |
| Search API    | Needs verification |
| Export API    | Not started |
| Comment API   | Not started |

# Documenting endpoints

When documenting endpoints we use a `DSL` based on `yaml`
to ensure style-consistancy and simplify writing. This also allows us
to change the style in the future. 

Generally, the format is as follows:

```
name: Register user
path: POST /user/register/:foo
locked: true
text: |
    Register a new user with id `:foo`. The username must not
    be taken by another user.

body:
    type: application/json
    text: |
        Description about the request body.
    parameters:
        username: The username for the new user. | admin
        password: The password for the new user. | admin
        role: The role for the new user. | ADMIN, USER

path-params:
    parameters:
        foo: The id of the new user. | 1337

query-params:
    text: |
        Some notes on the query-parameters
    parameters:
        foo: This is a query parameter. | example value.

examples:
  - name: 200
    request: |
        POST /user/register

        {
            "username": "Björne Bjuding",
            "password": "Kladdkaka",
            "role": "USER"
        }
    response:
        content-type: text/plain
        body: <empty>
```

All api-blocks need to be wrapped in `<_api>HERE</_api>`, without the `_` to be rendered.

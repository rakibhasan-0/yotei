# Introduction

All API documentation is consolidated here.

# Installation guide

To serve the documentation locally, you will need `python3.8` and `pip3.8`.

```sh
cd api-docs
pip3.8 install --user mkdocs mkdocs-material
mkdocs serve
```

If `python --version` command reports `3.8`, you can probably use `pip install ...` instead.
The documentation will now be available at `localhost:8000`.

# Documentation progress

Remove this paragraph when documentation is done.

| API Name | Progress |
|--|--|
| User API      | Done & needs verification |
| Belt API      | Done |
| Exercise API  | In progress (take over please) |
| Plan API      | In progress |
| Tag API       | Done        |
| Technique API | Done        |
| Workout API   | In progress |
| Session API   | In progress |
| Search API    | Needs verification |
| Export API    | Done        |
| Import API    | Done        |
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

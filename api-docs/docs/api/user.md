<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Minotaur      | 23th May 2023   |
<!-- sign-off-sheet:end -->



# User API

API for accessing and modifying users.

<api>
name: Verify user
path: POST /api/users/verify
text: |
    Try to perform a login as a given user. Responds with the session JWT key, which should
    be stored in a `token` http header for future requests.

    !!! tip
        Most other requests require a `token` http header that should be set to what this
        request responds. If a `418: I'm a teapot` http status is recieved, you most likely
        forgot to login or the session has expired.
body:
    type: application/json
    parameters:
        username: The username for the user to log in as. | admin
        password: The password for the user to log in as. | admin

examples:
  - name: 200
    request: |
        POST /api/users/verify

        {
            "username": "admin",
            "password": "admin"
        }
    response:
        content-type: text/plain
        body: |
            eyJ0eXAiOiJKV1Qi...OYQbtZnoWHo7pKs
  - name: 406
    request: |
        POST api/users/verify

        {
            "username": "admin"
        }
    response:
        content-type: text/plain
        body: <empty>
</api>

<api>
name: Refresh token
path: POST /api/users/refresh
locked: true
text: |
    Refreshes the JWT token for a logged-in user. The new token
    should be stored in the `token` http header for future requests.

body:
    type: text/plain
    text: |
        The body should contain the full previous JWT token to refresh.

examples:
  - name: 200
    request: |
        POST /api/users/refresh

        eyJ0eXAiOiJKV1Qi...OYQbtZnoWHo7pKs        
    response:
        content-type: text/plain
        body: |
            e1J6eFAZIiJKVdQL...OZQbtZnonHo7ZKd
</api>

<api>
name: Update name
path: PUT /api/users/name
locked: true
text: |
    Updates the username of another user.

body:
    type: application/json
    parameters:
        id: The id of the user to rename. | 1
        newUsername: The new username for the user. | john
        password: The password of the user to rename. | admin

examples:
  - name: 200
    request: |
        PUT /api/users/name

        {
            "id": 1,
            "newUsername": "john",
            "password": "admin"
        }
    response:
        content-type: application/json
        body: |
            {
                "id": 1,
                "username": "john"
            }
</api>

<api>
name: Get users
path: GET /api/users
locked: true
text: |
    Returns all the users.

examples:
  - name: 200
    request: GET /api/users
    response:
        content-type: application/json
        body: |
            [
                {
                    "username": "admin",
                    "role": "ADMIN"
                },
                {
                    "username": "kalle",
                    "role": "USER"
                }
            ]
</api>

<api>
name: Get user
path: GET /api/users/:id
locked: true
text: |
    Register a new user. The username must not
    be taken by another user.

path-params:
    parameters:
        id: The id of the user to fetch. | 1

examples:
  - name: 200
    request: GET /api/users/1
    response:
        content-type: application/json
        body: |
            {
                "id": 1,
                "username": "admin",
                "role": "ADMIN"
            }
</api>

<api>
name: Register user
path: POST /api/users
locked: true
text: |
    Register a new user. The username must not
    be taken by another user.

body:
    type: application/json
    parameters:
        username: The username for the new user. | admin
        password: The password for the new user. | admin
        role: The role for the new user. | ADMIN, USER

examples:
  - name: 200
    request: |
        POST /api/users

        {
            "username": "Björne Bjuding",
            "password": "Kladdkaka",
            "role": "USER"
        }
    response:
        content-type: text/plain
        body: <empty>
</api>

<api>
name: Get username
path: GET /api/users/:id/name
locked: true
text: |
    Gets the username by a given id `:id`.

path-params:
    parameters:
        id: The id of the user to fetch. | 1

examples:
  - name: 200
    request: GET /api/users/1/name
    response:
        content-type: text/plain
        body: admin
</api>

<api>
name: Update password
path: PUT /api/users/password
locked: true
text: |
    Updates the password of another user.

body:
    type: application/json
    parameters:
        id: The id of the user. | 1
        newPassword: The new password for the user. | kladdkaka
        verifyNewPassword: Must be same as `newPassword`. | kladdkaka
        oldPassword: The password of the user. | admin
  
examples:
  - name: 200
    request: |
        PUT /api/users/password

        {
            "id": 1,
            "newPassword": "kladdkaka",
            "verifyNewPassword": "kladdkaka",
            "password": "admin"
        }
    response:
        content-type: text/plain
        body: <empty>
</api>

<api>
name: Remove user
path: DELETE /api/users/:id
locked: true
text: |
    Removes a user with the id `:id`.

path-params:
    parameters:
        id: The id of the user to delete. | 1

examples:
  - name: 200
    request: DELETE /api/users/1
    response:
        content-type: text/plain
        body: <empty>
  - name: 400
    request: DELETE /api/users/-1000
    response:
      content-type: text/plain
      body: Användaren finns inte
</api>

<api>
name: Change role for user
path: POST /api/users/:uid/role/:rid
locked: true
text: |
  Changes the role on a user with id `:uid` to role id `:rid`.

path-params:
  parameters:
    id: The id of the user to change role. | 1
    role: The role to change to. | 0,1,2

examples:
  - name: 200
    request: POST /api/users/1/role/1
    response:
      content-type: text/plain
      body: <empty>
  - name: 400
    request: POST /api/users/-1000/role/0
    response:
      content-type: text/plain
      body: Användaren finns inte
</api>
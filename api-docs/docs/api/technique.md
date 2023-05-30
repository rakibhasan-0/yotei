<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read and understood the documentation, please sign-off by adding your name and date below.





| Name          | Date            |
|--|--|
| Medusa Maneaters (Grupp 6) | 30 May 2023 |
<!-- sign-off-sheet:end -->

# Technique API

API for techniques.

<api>
name: Fetch all techniques
path: GET /api/techniques
text: |
    Fetch all techniques from the database as a single JSON object

examples:
    - name: 200
      request: GET /api/techniques
      response: 
        content-type: application/json
        body: |
            GET /api/techniques

            [
                {
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
                            "id": 26,
                            "name": "throws"
                        },
                        {
                            "id": 42,
                            "name": "rörelsetekniker"
                        },
                        {
                            "id": 4,
                            "name": "grönt"
                        }
                    ]
                },

            ]
    - name: 404
      request: GET /api/techniques
      response:
        content-type: text/plain
        body: Hittade inga sparade tekniker

</api>

<api>
name: Fetch one technique
path: GET /api/techniques/id
text: |
    Fetch a technique with the id `id` form the database. Is returned as a single JSON object

examples:
    - name: 200
      request: GET /api/techniques
      response: 
        content-type: application/json
        body: |
            GET /api/techniques

            [
                {
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
                            "id": 26,
                            "name": "throws"
                        },
                        {
                            "id": 42,
                            "name": "rörelsetekniker"
                        },
                        {
                            "id": 4,
                            "name": "grönt"
                        }
                    ]
                }
            ]

    - name: 404
      request: GET /api/techniques/1
      response:
        content-type: text/plain
        body: "Hittade ingen teknik med id: 1"
    - name: 400
      request: GET /api/techniques/-1
      response:
        content-type: text/plain
        body: "ID på tekniker kan inte vara negativa"
</api>


<api>
name: Add a new technique
path: POST /api/techniques
text: |
    Insert a new technique to the database. On success the new technique is returned in one JSON object

body:
    type: application/json
    text: |
        idfk
    parameters:
        name: The name of the technique | manadatory
        description: The description of the technique | optional
        belts: A list of belt IDs the technique should have | JSON list of IDs
        tags: A list of tag IDs the technique should have | JSON list of IDs 

examples:
    - name: 200
      request: |
        POST /api/techniques

        {
            "name": "Empi uchi, jodan och chudan (1 Kyu)",
            "description": "",
            "belts": [
                {
                    "id": 11,
                }
            ],
            "tags": [
                {
                    "id": 26,
                },
                {
                    "id": 42,
                },
                {
                    "id": 4,
                }
            ]
        }

      response:
        content-type: application/json
        body: |
            {
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
                        "id": 26,
                        "name": "throws"
                    },
                    {
                        "id": 42,
                        "name": "rörelsetekniker"
                    },
                    {
                        "id": 4,
                        "name": "grönt"
                    }
                ]
            }

    - name: 409 - CONFLICT
      request: |
        POST /api/techniques
        
        {
            "name": "Empi uchi, jodan och chudan (1 Kyu)",
            "description": "",
        }
      response:
        content-type: text/plain
        body: "Namnet på tekniken Empi uchi, jodan och chudan (1 Kyu) finns redan"

    - name: 406 - NOT ACCEPTABLE
      request: |
        POST /api/techniques
        
        {
            "name": "Ett .... långt namn mer än 255 karaktärer",
            "description": "",
        }
      response:
        content-type: text/plain
        body: "Fel format: Namn på teknik saknas eller är för långt."
</api>


<api>
name: Update an existing technique
path: PUT /api/techniques/
text: |
    Update an existing technique in the database with the provided. ID of the technique must be included in the body.

body:
    type: application/json
    text: Must include the technique ID. Omitted fields wil be set to null and removed from the object

examples:
    - name: 201 - CREATED
      request: |
        PUT /api/techniques
        {
            id: 1,
            name: "new cool_name",
            description: "cool_desc",
        }

      response:
        content-type: application/json
        body: |
            {
                id: 1,
                name: "new cool_name",
                description: "cool_desc",
            }

    - name: 404
      request: |
        PUT /api/techniques
        {
            id: 42069,
            name: "new cool_name",
            description: "cool_desc",
        }

      response:
        content-type: text/plain
        body: "Teknik med ID 42069 hittades inte"

    - name: 409 - CONFLICT
      request: |
        PUT /api/techniques
        {
            id: 1,
            name: "namn_som_finns",
            description: "cool_desc",
        }

      response:
        content-type: text/plain
        body: "Tekniken med namnet 'namn_som_redan_finns finns redan"

    - name: 406 - NOT ACCEPTABLE
      request: |
        PUT /api/techniques
        {
            id: 1,
            name: "",
            description: "cool_desc",
        }

      response:
        content-type: text/plain
        body: "Fel format: Namn på teknik saknas eller är för långt"
</api>

<api>
name: Delete a tehcnique
path: DELETE /api/techniques/id
text: |
    Removes the technique associated with the specified `id` from the database. Any workout containing this technique as an activity will lose it. 

examples:
    - name: 200
      request: DELETE /api/techniques/2
      response: 
        content-type: text/plain
        body: <empty>

    - name: 404
      request: DELETE /api/techniques/1337
      response: 
        content-type: text/plain
        body: "Ingen teknik med ID 1337 hittades"
</api>

<!-- write documentation here! -->
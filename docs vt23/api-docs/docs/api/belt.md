<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Cyclops | 1 June 2023 |
<!-- sign-off-sheet:end -->

# Belt API

API for belts.

<api>
name: Get belts
path: POST api/belts
locked: true
text: |
    Returns all belts.

examples:
  - name: 200
    request: GET api/belts
    response:
        content-type: application/json
        body: |
            [{
                "id": 1,
                "name": "Vitt",
                "color": "FCFCFC",
                "child": false
            }, {
                "id": 2,
                "name": "Vitt",
                "color": "BD3B41",
                "child": true
            }, {
                "id": 3,
                "name": "Gult",
                "color": "FFDD33",
                "child": false
            }, {
                "id": 4,
                "name": "Gult",
                "color": "FFDD33",
                "child": true
            }, {
                "id": 5,
                "name": "Orange",
                "color": "FFA133",
                "child": false
            }, {
                "id": 6,
                "name": "Orange",
                "color": "FFA133",
                "child": true
            }, {
                "id": 7,
                "name": "Grönt",
                "color": "0C7D2B",
                "child": false
            }, {
                "id": 8,
                "name": "Grönt",
                "color": "0C7D2B",
                "child": true
            }, {
                "id": 9,
                "name": "Blått",
                "color": "1E9CE3",
                "child": false
            }, {
                "id": 10,
                "name": "Blått",
                "color": "1E9CE3",
                "child": true
            }, {
                "id": 11,
                "name": "Brunt",
                "color": "83530C",
                "child": false
            }, {
                "id": 12,
                "name": "Brunt",
                "color": "83530C",
                "child": true
            }, {
                "id": 13,
                "name": "Svart",
                "color": "201E1F",
                "child": false
            }, {
                "id": 14,
                "name": "1 Dan",
                "color": "201E1F",
                "child": false
            }, {
                "id": 15,
                "name": "2 Dan",
                "color": "201E1F",
                "child": false
            }, {
                "id": 16,
                "name": "3 Dan",
                "color": "201E1F",
                "child": false
            }]
  - name: 404
    request: GET api/belts
    response:
        content-type: application/json
        body: |
            {
                "Hittade inga sparade bälten"
            }
</api>

<api>
name: Get belt by id
path: POST api/belts/:id
locked: true
text: |
    Returns all belts.

    !!! tip
        As of the 1st of June 2023, there exists 16 belts with a range of ids from 1-16. 

path-params:
    parameters:
        id: The id of the belt. | 9

examples:
  - name: 200
    request: GET api/belts?id=9
    response:
        content-type: application/json
        body: |
            [{
                "id": 9,
                "name": "Blått",
                "color": "1E9CE3",
                "child": false
            }]
  - name: 404
    request: GET api/belts?id=2000
    response:
        content-type: application/json
        body: |
            {
                "Kunde ej hitta bälte."
            }
  - name: 404
    request: GET api/belts?id=-1
    response:
        content-type: application/json
        body: |
            {
                "Felaktigt id."
            }
</api>

<!-- write documentation here! -->
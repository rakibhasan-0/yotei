<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Grupp 5 Cyclops | 1 June 2023 |
<!-- sign-off-sheet:end -->

# Import API

API for import.

<!-- write documentation here! -->

<api>
name: Import techniques
path: POST /api/import/techniques
locked: true
text: |
    Imports a list of techniques to the database.

body:
    type: application/json
    text: |
        A list of techniques, the same format as what is exported from the export API. Optionally the belts may be left out, this to preserve backwards compatability with the old format.

examples:
-   name: 200
    request: |
        POST /api/import/techniques

        {
            "techniques" : [
                {
                    "description" : "",
                    "name" : "Empi uchi, jodan och chudan (1 Kyu)",
                    "tags" : [
                        "grent",
                        "rarelsetekniker",
                        "throws"
                    ],
                    "belts": [
                        1,
                        2
                    ]
                }
            ]
        }
        
    response:
        content-type: application/json
        body: 

</api>

<api>
name: Import exercises
path: POST /api/import/exercises
locked: true
text: |
    Imports a list of exercises to the database.

examples:
-   name: 200
    request: |
        POST /api/import/exercises

        {
            "exercises" : [
                {
                    "description" : "Hoppa upp och brett isar benen samtidigt som du tar armarna upp ovanfer huvudet, hoppa sedan tillbaka till startpositionen!",
                    "duration" : 20,
                    "name" : "Jumping Jacks",
                    "tags" : [
                        "blatt",
                        "utbyte och sammanfaring av tekniker",
                        "jigo waza"
                    ]
                }
            ]
        }
        
    response:
        content-type: application/json
        body: 

</api>
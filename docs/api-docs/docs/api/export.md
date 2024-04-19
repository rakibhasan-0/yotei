<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Grupp 5 Cyclops | 31 May 2023 |
| Grupp 7 Coconut | 19 May 2024 |
<!-- sign-off-sheet:end -->

# Export API

API for export.

<!-- write documentation here! -->

<api>
name: Export techniques to JSON
path: GET /api/export/techniques
locked: true
text: |
    Gets all the techniques in the database in JSON format.

examples:
-   name: 200
    request: |
        GET /api/export/techniques
        
    response:
        content-type: application/json
        body: |
            {
                "techniques" : [
                    {
                        "description" : "",
                        "name" : "Empi uchi, jodan och chudan (1 Kyu)",
                        "videoUrls": [
                            "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        ],
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

</api>

<api>
name: Export exercises to JSON
path: GET /api/export/exercises
locked: true
text: |
    Gets all the exercises in the database in JSON format.

examples:
-   name: 200
    request: |
        GET /api/export/exercises
        
    response:
        content-type: application/json
        body: |
            {
                "exercises" : [
                    {
                        "description" : "Hoppa upp och brett isar benen samtidigt som du tar armarna upp ovanfer huvudet, hoppa sedan tillbaka till startpositionen!",
                        "duration" : 20,
                        "name" : "Jumping Jacks",
                        "videoUrls": [
                            "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        ],
                        "tags" : [
                            "blatt",
                            "utbyte och sammanfaring av tekniker",
                            "jigo waza"
                        ]
                    }
                ]
            }


</api>
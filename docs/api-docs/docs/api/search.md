<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Minotaur      | 12th May 2023   |
<!-- sign-off-sheet:end -->

# Search API

API for performing searches in the database. Most enpoints
implement fuzzing and filtering.

<api>
name: Search techniques
path: GET /api/search/techniques
locked: true
text: |
    Performs a search for techniques.
    If no name is entered the result will be filtered based on the ordering
    of the techniques. This order is decided by weights, based on the book
    that the customer uses.
    If a name is entered the result will be sorted based on the fuzzy search
    algorithm.

query-params:
    parameters:
        name: Name of technique to filter on. | Karate-kick, Kickflip
        beltColors: Name of the belt colors to filter on, separated by `,`. | "grön-barn,grön"
        kihon: If the technique is kihon. | true, false
        tags: Tags of technique to filter on, separated by `,`. | "kniv,spark"

examples:
  - name: 200
    request: |
        GET /api/search/techniques?name=lm+ao&beltColors=grön,grön-barn&kihon=false&tags=kniv
    response:
        content-type: application/json
        body: |
            {
                result: [
                    {
                        techniqueID: 1,
                        name: "Backflip karate kick",
                        description: "A karate kick while doing a backflip",
                        beltColors: [
                            { colorCode: "#123123", isChild: false, name: "shiny green" },
                            { colorCode: "#123124", isChild: true, name: "shinier green" }
                        ]
                    },
                    {
                        techniqueID: 2,
                        name: "Frontflip karate kick",
                        description: "A karate kick while doing a frontflip",
                        beltColors: [
                            {colorCode: "#123125", isChild: true, name: "shiniest green"}
                        ]
                    }
                ],
                tagCompletion: ["tag1", "tag2", "tag3"]
            }
</api>

<api>
name: Search workouts
path: GET /api/search/workouts
locked: true
text: |
    Performs a search for techniques.

    

query-params:
    text: |
        Note that the ID is required to filter with favourite. If no
        ID is given, the favourite filter is not used.
    parameters:
        name: Name of workout to filter on. | Karate-kick, Kickflip
        tags: Tags of workout to filter on, separated by `,`. | "kniv,spark"
        from: Start-date of filter. | 2023-06-09 (YYYY-MM-DD)
        to: End-date of filter. | 2023-06-11 (YYYY-MM-DD)
        favourite: If the workout must be a favourite. | true, false
        id: The id of the user performing a search. | 1

examples:
  - name: 200
    request: |
        GET /api/search/workouts?name=lmao&from=2023-04-20&to=2023-04-20&favourite=false&tags=kniv,spark&id=1
    response:
        content-type: application/json
        body: |
            {
                result: [
                    {
                        workoutID: 1,
                        favourite: false,
                        name: "Some workout"
                    },
                    {
                        workoutID: 2,
                        favourite: true,
                        name: "Some other workout"
                    }
                ],
                tagCompletion: ["tag1", "tag2", "tag3"]
            }
</api>

<api>
name: Search exercises
path: GET /api/search/exercises
locked: true
text: |
    Performs a search for exercises.

    

query-params:
    parameters:
        name: Name to filter on. | Karate-kick, Kickflip
        tags: Tags to filter on, separated by `,`. | "kniv,spark"

examples:
  - name: 200
    request: |
        GET /api/search/exercises?name=something+something&tags=kniv,spark
    response:
        content-type: application/json
        body: |
            {
                result: [
                    {
                        exerciseID: 1,
                        description: "Cool exercise",
                        duration: 13
                    },
                    {
                        exerciseID: 2,
                        description: "Another cool exercise",
                        duration: 14
                    }
                ],
                tagCompletion: ["tag1", "tag2", "tag3"]
            }
</api>

<api>
name: Search plans
path: GET /api/search/plans
locked: true
text: |
    Performs a search for plans.
    The tag completion array consists of a maximum of 3 tags that were found, these tags
    are based on the 'name' query parameter that was entered.

query-params:
    parameters:
        plans: Id's of specific groups to filter on, separated by `,`. | "6,9,4,2,0"
        id: Id of the user performing the search. | 1
        from: Start-date of filter. | 2023-06-09 (YYYY-MM-DD)
        to: End-date of filter. | 2023-06-11 (YYYY-MM-DD)

examples:
  - name: 200
    request: |
        GET /api/search/plans?from=2023-04-20&to=2023-04-20&previousSessions=false&plans=1,2,3&id=1
    response:
        content-type: application/json
        body: |
            {
                result: [
                    {
                        planID: 1,
                        name: "Cool plan 1",
                        planColors: [
                            { colorCode: "#123123", isChild: false, name: "orange" },
                            { colorCode: "#123124", isChild: true, name: "orangier" }
                        ],
                        sessions: [
                            {
                                sessionID: 1,
                                date: "2023-04-20",
                                time: "14:30",
                                text: "Sheesh"
                            },
                            {
                                sessionID: 2,
                                date: "2023-04-27",
                                time: "14:30"
                                text: "Sheesh"
                            }
                        ]
                    },
                    {
                        planID: 2,
                        name: "Cool group 2",
                        planColors: [],
                        sessions: []
                    }
                ]
            }
</api>

<api>
name: Search tags
path: GET /api/search/tags
locked: true
text: |
    Performs a search for tags.
    The returned tags are based on the 'name' query parameter that was entered using fuzzy search. 

query-params:
    parameters:
        name: Name of tag to filter on. | kn
        tagAmount: Number of suggestions to return. | 3
        tags: Already chosen tags, separated by `,`. | "kniv,spark"

examples:
  - name: 200
    request: |
        GET /api/search/tags?name=lmao&tagAmount=3&tags=kniv,spark
    response:
        content-type: application/json
        body: |
            {
                result: [
                    {
                        tagID: 1,
                        tagName: "tagSuggestion1"
                    },
                    {
                        tagID: 2,
                        tagName: "tagSuggestion2"
                    },
                    {
                        tagID: 3,
                        tagName: "tagSuggestion3"
                    }
                ]
            }
</api>
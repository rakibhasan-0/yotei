<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Coconut | 7 May 2024 |
<!-- sign-off-sheet:end -->

# Statistics API

API for statistics of techniques and exercises done in session reviews.

<api>
name: Get the annotated activites done in a groups session review.

path: GET /api/statistics/{id}

locked: true

text: |
    Get activity statistics by group id. Number of sessions shows the number of sessions 

body:
    type: application/json


path-params:
    parameters:
        id: The id of the group | 1

query-params:
    text: |
        All query parameters are optional. If no filter is applied, all results are returned.
    parameters:
        kihon: Show only activities that are associated with the "kihon" tag | true/false
        showexercises: Show both exercises and techniques | true/false
        startdate: Beginning of date filter | yyyy-MM-dd
        enddate: End of date filter | yyyy-MM-dd

examples:
  - name: 200

    request: GET /api/session/get?id=1

    response:
        content-type: application/json
        body: |
            {
                numberOfSessions: 2,
                averageRating: 3,
                activities: [
                    {
                        activity_id: 6,
                        name: "Seoi nage, mot grepp i ärmen, ude hishigi hiza gatame (1 Kyu)",
                        type: "technique",
                        count: 3,
                        beltColors: [
                            {
                            belt_color: "83530C",
                            belt_name: "Brunt",
                            is_child: false
                            }
                        ]
                    },
                    {
                        activity_id: 286,
                        name: "Burpees",
                        type: "exercise",
                        count: 1,
                        beltColors: null
                    },
                    {
                        activity_id: 287,
                        name: "Jumping Jacks",
                        type: "exercise",
                        count: 1,
                        beltColors: null
                    },
                    {
                        activity_id: 285,
                        name: "Springa",
                        type: "exercise",
                        count: 1,
                        beltColors: null
                    },
                    {
                        activity_id: 8,
                        name: "Ude hiza osae gatame (1 Kyu)",
                        type: "technique",
                        count: 1,
                        beltColors: [
                            {
                                belt_color: "83530C",
                                belt_name: "Brunt",
                                is_child: false
                            }
                        ]
                    },
                    {
                        activity_id: 7,
                        name: "Uki otoshi, mot grepp i ärmen, ude henkan gatame (1 Kyu)",
                        type: "technique",
                        count: 1,
                        beltColors: [
                            {
                                belt_color: "83530C",
                                belt_name: "Brunt",
                                is_child: false
                             }
                        ]
                    }
                ]
            }
</api>

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
name: Get the annotated activites done in a group's session reviews.

path: GET /api/statistics/{id}

locked: true

text: |
    Get activity statistics by group id. NumberOfSessions is the number of session reviews that matach the current filter and AverageRating is the average rating of those reviews. All techniques associated with the group that are not performed in any session are included with count = 0.



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

    request: GET /api/statistics/1

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
  - name: 204

    request: GET /api/session/get?id=10
    
    response:
        content-type: application/json
        body: |

</api>

<api>
name: Compares the techniques practiced by a group to a grading protocol.

path: GET /api/statistics/{id}/grading_protocol

locked: true

text: |
    Get the techniques of a grading protocol compared to the techniques practiced by a group.



path-params:
    parameters:
        id: The id of the group | 1

query-params:
    parameters:
        beltId: ID if the belt associated with the grading protocol to compare to.

examples:
  - name: 200

    request: GET /api/statistics/1/grading_protocol?beltId=3

    response:
        content-type: application/json
        body: |
            {
                code: "5 KYU",
                name: "GULT BÄLTE",
                belt: {
                    belt_color: "FFDD33",
                    belt_name: "Gult",
                    is_child: false
                },
                categories: [
                    {
                        name: "KIHON WAZA - ATEMI WAZA",
                        techniques: [
                        {
                            name: "Empi uchi, jodan och chudan (1 Kyu)",
                            id: 1,
                            count: 1
                        },
                        {
                            name: "Uraken uchi, jodan (1 Kyu)",
                            id: 2,
                            count: 1
                        },
                        {
                            name: "Yoko geri chudan (1 Kyu)",
                            id: 3,
                            count: 1
                        },
                        {
                            name: "Waki gatame, mot diagonalt grepp, ude osage gatame (1 Kyu)",
                            id: 4,
                            count: 1
                        }
                        ]
                    },
                    {
                        name: "KIHON WAZA - KANSETSU WAZA",
                        techniques: [
                        {
                            name: "hiji gatame, gripa, ude hishigi hiza gatame",
                            id: 5,
                            count: 1
                        },
                        {
                            name: "Seoi nage, mot grepp i ärmen, ude hishigi hiza gatame (1 Kyu)",
                            id: 6,
                            count: 4
                        },
                        {
                            name: "Uki otoshi, mot grepp i ärmen, ude henkan gatame (1 Kyu)",
                            id: 7,
                            count: 0
                        },
                        {
                            name: "Ude hiza osae gatame (1 Kyu)",
                            id: 8,
                            count: 1
                        }
                        ]
                    },
                    {
                        name: "KIHON WAZA - NAGE WAZA",
                        techniques: [
                        {
                            name: "Kata osae (1 Kyu)",
                            id: 9,
                            count: 0
                        },
                        {
                            name: "Nige no kata (1 Kyu)",
                            id: 10,
                            count: 0
                        },
                        {
                            name: "Randori mot en motståndare (1 Kyu)",
                            id: 11,
                            count: 0
                        },
                        {
                            name: "Randori mot en motståndare som angriper liggande (1 Kyu)",
                            id: 12,
                            count: 0
                        }
                        ]
                    },
                        {
                        name: "RENRAKU WAZA",
                        techniques: [
                        {
                            name: "Grepp i håret med två händer och knästöt, Gedan juji uke, waki gatame, kata osae",
                            id: 13,
                            count: 0
                        },
                        {
                            name: "Försök till stryptag, Uki otoshi, ude henkan gatame",
                            id: 14,
                            count: 0
                        },
                        {
                            name: "Stryptag med armen med drag, Uki otoshi, ude henkan gatame",
                            id: 15,
                            count: 0
                        },
                        {
                            name: "Kravattgrepp med neddrag, Frigöring, ude henkan gatame (1 Kyu)",
                            id: 16,
                            count: 0
                        }
                        ]
                    },
                        {
                        name: "YAKUSOKU GEIKO",
                        techniques: [
                        {
                            name: "Grepp i kragen med höger hand och svingslag, Jodan uchi uke, ude gatame, kata osae",
                            id: 17,
                            count: 0
                        },
                        {
                            name: "Grepp i kragen med vänster hand och svingslag, Jodan uchi uke, o soto otoshi, ude henkan gatame",
                            id: 18,
                            count: 0
                        },
                        {
                            name: "Grepp i håret mot liggande, Frigöring, ude henkan gatame",
                            id: 19,
                            count: 0
                        },
                        {
                            name: "Stryptag mot liggande, mellan benen, Juji gatame, shiho nage gatame",
                            id: 20,
                            count: 0
                        }
                    ]
                    }
                ]
            }

</api>
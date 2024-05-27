<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Coconut | 20 May 2024 |
<!-- sign-off-sheet:end -->

# Statistics API

API for grading protocol.

<api>
name: Get the id of all belts that have a grading protocol associated with them.

path: GET /api/grading_protocol/belts

locked: true


examples:
  - name: 200

    request: GET /api/grading_protocol/belts

    response:
        content-type: application/json
        body: |
            [
                {
                    beltId: 3
                },
                {
                    beltId: 5
                },
                {
                    beltId: 7
                },
                {
                    beltId: 9
                },
                {
                    beltId: 11
                }
            ]
</api>

<api>
name: Get the grading protocol associated with a belt id.

path: GET /api/grading_protocol

locked: true


query-params:
    parameters:
        beltId: ID of the belt of associated with the protocol | Integer

examples:
  - name: 200

    request: GET /api/grading_protocol?beltId=3

    response:
        content-type: application/json
        body: |
            {
                examination_protocol: {
                        code: "5 KYU",
                        color: "GULT BÄLTE"
                    },
                categories: [
                    {
                        category_name: "KIHON WAZA - ATEMI WAZA",
                        techniques: [
                            {
                                text: "1. Empi uchi, jodan och chudan (1 Kyu)"
                            },
                            {
                                text: "2. Uraken uchi, jodan (1 Kyu)"
                            },
                            {
                                text: "3. Yoko geri chudan (1 Kyu)"
                            },
                            {
                                text: "4. Waki gatame, mot diagonalt grepp, ude osage gatame (1 Kyu)"
                            }
                        ]
                    },
                    {
                        category_name: "KIHON WAZA - KANSETSU WAZA",
                        techniques: [
                            {
                                text: "1. hiji gatame, gripa, ude hishigi hiza gatame"
                            },
                            {
                                text: "2. Seoi nage, mot grepp i ärmen, ude hishigi hiza gatame (1 Kyu)"
                            },
                            {
                                text: "3. Uki otoshi, mot grepp i ärmen, ude henkan gatame (1 Kyu)"
                            },
                            {
                                text: "4. Ude hiza osae gatame (1 Kyu)"
                            }
                        ]
                    },
                    {
                        category_name: "KIHON WAZA - NAGE WAZA",
                        techniques: [
                            {
                                text: "1. Kata osae (1 Kyu)"
                            },
                            {
                                text: "2. Nige no kata (1 Kyu)"
                            },
                            {
                                text: "3. Randori mot en motståndare (1 Kyu)"
                            },
                            {
                                text: "4. Randori mot en motståndare som angriper liggande (1 Kyu)"
                            }
                        ]
                    },
                    {
                        category_name: "RENRAKU WAZA",
                        techniques: [
                            {
                                text: "1. Grepp i håret med två händer och knästöt, Gedan juji uke, waki gatame, kata osae"
                            },
                            {
                                text: "2. Försök till stryptag, Uki otoshi, ude henkan gatame"
                            },
                            {
                                text: "3. Stryptag med armen med drag, Uki otoshi, ude henkan gatame"
                            },
                            {
                                text: "4. Kravattgrepp med neddrag, Frigöring, ude henkan gatame (1 Kyu)"
                            }
                        ]
                    },
                    {
                        category_name: "YAKUSOKU GEIKO",
                        techniques: [
                            {
                                text: "1. Grepp i kragen med höger hand och svingslag, Jodan uchi uke, ude gatame, kata osae"
                            },
                            {
                                text: "2. Grepp i kragen med vänster hand och svingslag, Jodan uchi uke, o soto otoshi, ude henkan gatame"
                            },
                            {
                                text: "3. Grepp i håret mot liggande, Frigöring, ude henkan gatame"
                            },
                            {
                                text: "4. Stryptag mot liggande, mellan benen, Juji gatame, shiho nage gatame"
                            }
                        ]
                    }
                ]
            }
</api>

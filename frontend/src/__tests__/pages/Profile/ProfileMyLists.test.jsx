import { render, configure, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import ProfileMyLists from "../../../pages/Profile/ProfileMyLists"
import { rest } from "msw"
import { server } from "../../server"

/**
 * @author Team Tomato (Group 6)
 * Since 2024-05-05
 */


configure({testIdAttribute: "id"})
jest.mock("react-router", () => ({
    useNavigate: () => jest.fn()
}))

// Mock the Link component
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    Link: jest.fn().mockImplementation(({ children }) => children),
}))

//Utgår ifrån att komponeten heter MyLists
test("Should render 'Favoritpass' on init", async () => {
	render(<MyLists/>)
	//Gets the first "Planering" so there can exist a header and a tab title with the same name. 
	expect(screen.getAllByText("Favoritpass")[0]).toBeInTheDocument()
})

/*
test("should render data from the plan api", async () => {
    workout = 
    {
        "id": 1,
        "name": "Hugos bästa",
        "description": "This Judo workout focuses on practicing basic throws such as the hip throw, shoulder throw, and foot sweep. It includes both solo and partner drills to improve technique and timing.",
        "created": "2024-05-02",
        "changed": "2023-05-03",
        "date": "2023-04-29T22:00:00.000+00:00",
        "hidden": false,
        "author": {
            "user_id": 1,
            "username": "admin"
        },
        "activityCategories": [
            {
                "categoryName": "Träning",
                "categoryOrder": 2,
                "activities": [
                    {
                        "id": 3,
                        "exercise": null,
                        "technique": {
                            "id": 7,
                            "name": "Uki otoshi, mot grepp i ärmen, ude henkan gatame (1 Kyu)",
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
                                    "id": 49,
                                    "name": "säkerhetstekniker"
                                },
                                {
                                    "id": 42,
                                    "name": "rörelsetekniker"
                                },
                                {
                                    "id": 58,
                                    "name": "strypningstekniker"
                                }
                            ]
                        },
                        "text": "Empi uchi i 15 minuter",
                        "name": "Empi uchi träning",
                        "duration": 15,
                        "order": 1
                    },
                    {
                        "id": 4,
                        "exercise": null,
                        "technique": {
                            "id": 8,
                            "name": "Ude hiza osae gatame (1 Kyu)",
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
                                    "id": 1,
                                    "name": "kihon waza"
                                },
                                {
                                    "id": 90,
                                    "name": "utbyte och sammanföring av tekniker"
                                },
                                {
                                    "id": 14,
                                    "name": "nage waza"
                                }
                            ]
                        },
                        "text": "Waki gatame i 5 minuter",
                        "name": "Waki gatame träning",
                        "duration": 5,
                        "order": 2
                    },
                    {
                        "id": 5,
                        "exercise": null,
                        "technique": {
                            "id": 8,
                            "name": "Ude hiza osae gatame (1 Kyu)",
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
                                    "id": 1,
                                    "name": "kihon waza"
                                },
                                {
                                    "id": 90,
                                    "name": "utbyte och sammanföring av tekniker"
                                },
                                {
                                    "id": 14,
                                    "name": "nage waza"
                                }
                            ]
                        },
                        "text": "Waki gatame i 7 minuter",
                        "name": "Waki gatame träning",
                        "duration": 7,
                        "order": 3
                    }
                ]
            },
            {
                "categoryName": "Uppvärmning",
                "categoryOrder": 1,
                "activities": [
                    {
                        "id": 2,
                        "exercise": {
                            "id": 286,
                            "name": "Burpees",
                            "description": "Börja ståendes, gör en armhävning, hoppa upp och klappa händerna över huvudet!",
                            "duration": 30
                        },
                        "technique": null,
                        "text": "Burpees i 5 minuter",
                        "name": "Uppvärmning Burpees",
                        "duration": 5,
                        "order": 2
                    },
                    {
                        "id": 1,
                        "exercise": {
                            "id": 285,
                            "name": "Springa",
                            "description": "Placera ena foten framför den andra och upprepa!",
                            "duration": 10
                        },
                        "technique": null,
                        "text": "Springa i 10 minuter",
                        "name": "Uppvärmning Springa",
                        "duration": 10,
                        "order": 1
                    }
                ]
            },
            {
                "categoryName": "Avslut",
                "categoryOrder": 3,
                "activities": [
                    {
                        "id": 6,
                        "exercise": null,
                        "technique": {
                            "id": 8,
                            "name": "Ude hiza osae gatame (1 Kyu)",
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
                                    "id": 1,
                                    "name": "kihon waza"
                                },
                                {
                                    "id": 90,
                                    "name": "utbyte och sammanföring av tekniker"
                                },
                                {
                                    "id": 14,
                                    "name": "nage waza"
                                }
                            ]
                        },
                        "text": "Avsluta med Waki gatame i 15 minuter",
                        "name": "Waki gatame träning",
                        "duration": 15,
                        "order": 4
                    }
                ]
            }
        ],
        "tags": [
            {
                "id": 24,
                "name": "uke waza"
            },
            {
                "id": 25,
                "name": "judo"
            }
        ]
    }
    
	// ARRANGE
	render(<PlanIndex />)
	server.use(
		rest.get("api/plan/all", async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([{
					"id":1,"name":"Grönt bälte träning","userId":1,"belts":[{"id":7,"name":"Grönt","color":"00BE08","child":false}]
				}]),
			)
		})
	)
	server.use(
		rest.get("api/sessions/all", async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([{"id":3,"text":"Beginner Judo träning","workout":39,
					"plan":1,"date":"2023-04-03","time":"10:00:00"},]),
			)
		})
	)
	server.use(
		rest.get("api/workouts/all", async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([{"name":"test","id":39,"created":"2023-05-22","author":1}]),
			)
		})
	)
	
	await screen.findByTestId("groupRow-id-1")
	
	// ASSERT
	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
    
    
})

*/
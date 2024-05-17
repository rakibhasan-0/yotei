/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AccountContext } from "../../../../context"
import "@testing-library/jest-dom"
import { Route, createMemoryRouter, createRoutesFromElements, RouterProvider } from "react-router"

import { rest } from "msw"
import { server } from "../../../server"
import TechniqueDetail from "../../../../pages/Activity/Technique/TechniqueDetail/TechniqueDetail"
import TechniqueEdit from "../../../../pages/Activity/Technique/TechniqueEdit/TechniqueEdit"

/**
 * Tests for the technique edit page
 * 
 * @author Team Medusa (Grupp 6), Team Durian (Grupp 3)
 * @version 1.0
 * @since 2024-05-02
 */
const api = jest.fn()
server.events.on("request:start", api)

configure({testIdAttribute: "id"})

describe("verify that", () => {
	let user
	let technique

	// Some belts used to mock GET /api/belts
	const belts = [
		{
			"id": 1,
			"name": "Vitt",
			"color": "FCFCFC",
			"child": false
		},
		{
			"id": 2,
			"name": "Vitt",
			"color": "BD3B41",
			"child": true
		},
		{
			"id": 3,
			"name": "Gult",
			"color": "EDD70D",
			"child": false
		},
		{
			"id": 4,
			"name": "Gult",
			"color": "EDD70D",
			"child": true
		},
		{
			"id": 13,
			"name": "Svart",
			"color": "EDD70D",
			"child": false
		}
	]

	beforeEach(() => {
		user = userEvent.setup()

		technique = {
			id: 1,
			name: "Tekniknamn",
			description: "Test desc",
			belts: [
				{
					id: 13,
					color: "000000",
					child: false,
					name: "svart"
				}
			],
			tags: [
				{
					id: 4,
					name: "svart"
				}
			]
		}

		server.use(
			rest.get("/api/tags/filter", (req, res, ctx) => {
				return res(
					ctx.json({
						results: [
							{
								id: 1,
								name: "kihon waza",
							}
						]
					})
				)
			}),
			rest.get("/api/techniques/1", (req, res, ctx) => {
				return res(
					ctx.json(technique),
					ctx.status(200)
				)
			}),
			rest.put("/api/techniques", async (req, res, ctx) => {
				const newTechnique = await req.json()
				if (newTechnique.name === "") {
					return res(
						ctx.status(406)
					)
				}

				technique = newTechnique

				// The real technique api only takes IDs as parameters and joins the tables in the database to get
				// the information for each belt/tag.
				technique.belts = technique.belts.map((belt) => {
					return {
						id: belt.id,
						color: "000000",
						child: false,
						name: "svart" + belt.id
					}
				})

				technique.tags = technique.tags.map((tag) => {
					return {
						id: tag.id,
						name: tag.id === 2 ? "ny tagg" : "svart" // titta inte här
					}
				})

				return res(
					ctx.status(201)
				)
			}),
			rest.get("/api/belts", (req, res, ctx) => {
				return res(
					ctx.json(belts)
				)
			}),
			rest.post("/api/tags/add", async (req, res, ctx) => {
				const name = await req.json().name
				return res(
					ctx.json({
						id: 2,
						name: name
					})
				)
			})



		)

	})

	afterEach(() => {
		api.mockClear()
	})

	// Render the technique detail page with router and account context. Also waits for it to fully render.
	const renderWithRouter = async() => {
		const techniqueId = 1
		window.HTMLElement.prototype.scrollIntoView = jest.fn
		const router = createMemoryRouter(
			createRoutesFromElements( [
				<Route key={"key1"} path="technique/:techniqueId" element={<TechniqueDetail />}/> ,
				<Route key={"key2"} path="technique/:techniqueId/edit" element={<TechniqueEdit/>}/>
			]
			),
			{initialEntries: [`/technique/${techniqueId}`]}
		)

		render ( //eslint-disable-next-line no-dupe-keys
			<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", undefined }}>
				<RouterProvider router={router}/>
			</AccountContext.Provider>
		)

		await waitFor(() => {
			// The mock api is called 2 times before everything is fully rendered
			expect(api).toHaveBeenCalledTimes(3)
		})
	}

	test("checking the kihon checkbox adds and removes the kihon tag", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))

		await user.click(screen.getByLabelText("Kihon"))

		await waitFor(() => {
			expect(screen.getByText("kihon waza")).toBeInTheDocument()
		})

		await user.click(screen.getByLabelText("Kihon"))

		await waitFor(() => {
			expect(screen.queryByText("kihon waza")).not.toBeInTheDocument()
		})
		
	})

	//Funkar för tillfället ej :(
	/*test("adding/removing the kihon tag checks/unchecks the kihon checkbox", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))

		await user.click(screen.getByText("Hantera tagg"))

		expect(screen.getByText("svart")).toBeInTheDocument()

		await user.type(screen.getByPlaceholderText("Sök eller skapa tagg"), "kihon waza")

		await waitFor(() => {
			user.click(screen.getByTestId("tag-add-button"))
		})

		//await user.click(screen.getByTestId("tag-add-button"))

		await waitFor(() => {
			expect(screen.getByText("name")).toBeInTheDocument()
		})

		await user.click(screen.getByTestId("save-and-close-button"))

		await waitFor(() => {
			expect(screen.getByLabelText("Kihon")).toBeChecked()
		}) 
		await user.click(screen.getByText("kihon waza"))

		await waitFor(() => {
			expect(screen.getByLabelText("Kihon")).not.toBeChecked()
		})

	})*/

	test("changing the technique name and canceling shows the confirm popup", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.type(screen.getByPlaceholderText("Namn"), " med nytt namn")
		await user.click(screen.getByText("Avbryt"))

		await waitFor(() => {
			expect(screen.getByText("Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas.")).toBeInTheDocument()
		})

	})

	test("changing the technique name and canceling does not update the technique", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.type(screen.getByPlaceholderText("Namn"), " med nytt namn")
		await user.click(screen.getByText("Avbryt"))
		await user.click(screen.getByText("Lämna"))

		await waitFor(() => {
			expect(screen.getByText("Tekniknamn")).toBeInTheDocument()
		})

		await waitFor(() => {
			expect(screen.queryByText("Tekniknamn med nytt namn")).not.toBeInTheDocument()
		})

	})

	test("changing the technique name updates the technique", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.type(screen.getByPlaceholderText("Namn"), " med nytt namn")
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			expect(screen.getByText("Tekniknamn med nytt namn")).toBeInTheDocument()
		})

	})

	test("changing the technique description updates the technique", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.type(screen.getByPlaceholderText("Beskrivning av teknik"), " Ny beskrivning")
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			expect(screen.getByText("Test desc Ny beskrivning")).toBeInTheDocument()
		})

	})

	test("adding a belt updates the technique", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.click(screen.getByText("Bälten"))
		await user.click(screen.getByTestId("belt-adult-Gult"))
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			// The belt "adult white" with id 1 should be found in belts
			expect(technique.belts.find(b => b.id === 3)).toBeTruthy()
		})
	})

	//Funkar för tillfället ej :(
	/*test("adding a tag updates the technique", async () => {
		await renderWithRouter()

		await waitFor(() => {
			expect(screen.queryByText("ny tagg")).not.toBeInTheDocument()
		})

		// Add the tag
		await user.click(screen.getByTestId("technique-edit-button"))
		await user.click(screen.getByText("Hantera tagg"))

		await user.type(screen.getByPlaceholderText("Sök eller skapa tagg"), "ny tagg")

		await user.click(screen.getByText("ny tagg"))

		await user.click(screen.getByTestId("popup-close-button"))
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			expect(screen.getByText("ny tagg")).toBeInTheDocument()
		})

	})*/

	test("correct error message is shown when the updated name is empty", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.clear(screen.getByPlaceholderText("Namn"))
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Namn")).toHaveValue("")
		})

		await waitFor(() => {
			expect(screen.getByText("Tekniken måste ha ett namn")).toBeInTheDocument()
		})

	})

	test("a technique without belt can't be created", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.click(screen.getByText("Bälten"))
		await user.click(screen.getByTestId("belt-adult-Svart"))
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			expect(screen.getByText("En teknik måste minst ha en bältesgrad")).toBeInTheDocument()
		})

	})

})


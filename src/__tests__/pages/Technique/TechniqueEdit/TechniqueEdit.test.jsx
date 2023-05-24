/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TechniqueEdit from "../../../../pages/Technique/TechniqueEdit/TechniqueEdit"
import { AccountContext } from "../../../../context"
import "@testing-library/jest-dom"
import { Route, Routes, MemoryRouter } from "react-router"

import { rest } from "msw"
import { server } from "../../../server"
import TechniqueDetail from "../../../../pages/Technique/TechniqueDetail/TechniqueDetail"

/**
 * Tests for the technique edit page
 * 
 * @author Team Medusa (Grupp 6)
 * @version 1.0
 * @since 2023-05-23
 */
const api = jest.fn()
server.events.on("request:start", api)

configure({testIdAttribute: "id"})

describe("verify that", () => {
	let user

	let technique = {
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

	// Some belts used to mock GET /api/belts/all
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
		}
	]

	beforeEach(() => {
		user = userEvent.setup()

		server.use(
			rest.get("/api/search/tags", (req, res, ctx) => {
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
			rest.get("/api/belts/all", (req, res, ctx) => {
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

	test("checking the kihon checkbox adds and removes the kihon tag", async () => {
		render ( //eslint-disable-line
			<TechniqueEdit id={"technique-edit"} setIsOpen={true} technique={technique} /> 
		)

		await user.click(screen.getByLabelText("Kihon"))

		await waitFor(() => {
			expect(screen.getByText("Kihon Waza")).toBeInTheDocument()
		})

		await user.click(screen.getByLabelText("Kihon"))

		await waitFor(() => {
			expect(screen.queryByText("Kihon Waza")).not.toBeInTheDocument()
		})
	})

	test("adding/removing the kihon tag checks/unchecks the kihon checkbox", async () => {
		render ( //eslint-disable-line
			<TechniqueEdit id={"technique-edit"} setIsOpen={true} technique={technique} /> 
		)

		await user.click(screen.getByText("Lägg till tagg"))

		await user.type(screen.getByPlaceholderText("Sök efter taggar"), "kihon waza")

		// The tag suggestion and the create tag elements are identical, clicks the first one on the page.
		const allTags = screen.getAllByText("kihon waza")
		await user.click(allTags[0])

		await user.click(screen.getByTestId("popup-close-button"))

		await waitFor(() => {
			expect(screen.getByLabelText("Kihon")).toBeChecked()
		})

		await user.click(screen.getByText("kihon waza"))

		await waitFor(() => {
			expect(screen.getByLabelText("Kihon")).not.toBeChecked()
		})

	})

	// Render the technique detail page with router and account context. Also waits for it to fully render.
	const renderWithRouter = async() => {
		const techniqueId = 1

		render ( //eslint-disable-next-line no-dupe-keys
			<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", undefined }}>
				<MemoryRouter initialEntries={[`/technique/technique_page/${techniqueId}`]}>
					<Routes> 
						<Route path="technique/technique_page/:techniqueId" element={<TechniqueDetail />}/>
					</Routes>
				</MemoryRouter>
			</AccountContext.Provider>
		)

		await waitFor(() => {
			// The mock api is called 2 times before everything is fully rendered
			expect(api).toHaveBeenCalledTimes(2)
		})
	}

	test("changing the technique name and canceling does nothing", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("technique-edit-button"))
		await user.type(screen.getByPlaceholderText("Namn"), " med nytt namn")
		await user.click(screen.getByText("Avbryt"))

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
		await user.click(screen.getByTestId("belt-adult-Vitt"))
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			// The belt "adult white" with id 1 should be found in belts
			expect(technique.belts.find(b => b.id === 1)).toBeTruthy()
		})

	})

	test("adding a tag updates the technique", async () => {
		await renderWithRouter()

		await waitFor(() => {
			expect(screen.queryByText("ny tagg")).not.toBeInTheDocument()
		})

		// Add the tag
		await user.click(screen.getByTestId("technique-edit-button"))
		await user.click(screen.getByText("Lägg till tagg"))

		await user.type(screen.getByPlaceholderText("Sök efter taggar"), "ny tagg")

		await user.click(screen.getByText("ny tagg"))

		await user.click(screen.getByTestId("popup-close-button"))
		await user.click(screen.getByText("Spara"))

		await waitFor(() => {
			expect(screen.getByText("ny tagg")).toBeInTheDocument()
		})

	})

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

})


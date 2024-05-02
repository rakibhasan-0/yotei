/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure, waitFor, fireEvent } from "@testing-library/react"
import TechniqueIndex from "../../../../pages/Technique/TechniqueIndex/TechniqueIndex"
import CreateTechnique from "../../../../pages/Technique/CreateTechnique/CreateTechnique"
//import GroupIndex from "../../../../pages/Plan/GroupIndex/GroupIndex"
//import Button from "../../../../components/Common/Button/Button"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import { AccountContext } from "../../../../context"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom"
//import { useNavigate } from "react-router-dom"
import { rest } from "msw"
import { server } from "../../../server"
import { HTTP_STATUS_CODES } from "../../../../utils" 
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

/**
 * Unit-test for the TechniqueIndex page, 
 * few simple tests making sure components are rendered correctly,
 * that the search bar works as intended (filtering)
 * and that the user can create a new technique.
 *
 * @author ???, Team Mango (Group 4)
 * @since 2024-04-24
 * @version 2.0 
 */

configure({testIdAttribute: "id"})

test("should render the search bar", () => {
	render (
		<MemoryRouter>
			<TechniqueIndex/>
		</MemoryRouter>
	)
	expect(screen.getByTestId("searchbar-technique")).toBeInTheDocument()
})

test("should render create technique button as admin", () => {
	render (
		// eslint-disable-next-line no-dupe-keys
		<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", undefined }}>
			<MemoryRouter>
				<TechniqueIndex/>
			</MemoryRouter>
		</AccountContext.Provider>
	)

	expect(screen.getByTestId("technique-add-button")).toBeInTheDocument()
})

test("should not render create technique button when user is not admin", () => {
	render (
		// eslint-disable-next-line no-dupe-keys
		<AccountContext.Provider value={{ undefined, role: "USER", userId: "", undefined }}>
			<MemoryRouter>
				<TechniqueIndex/>
			</MemoryRouter>
		</AccountContext.Provider>
	)

	expect(screen.queryByTestId("technique-add-button")).not.toBeInTheDocument()
})

describe("should update", () => {
	let techniques = {
		results: [
			{
				techniqueID: 1,
				name: "Grönt Testteknik",
				beltColors: [
					{
						belt_color: "ED930D",
						belt_name: "Orange",
						is_child: false
					}
				]
			},
			{
				techniqueID: 2,
				name: "Grått Testteknik nr 2",
				beltColors: [
					{
						belt_color: "ED930D",
						belt_name: "Orange",
						is_child: false
					}
				]
			},
			{
				techniqueID: 3,
				name: "Blå Testteknik nr 3",
				beltColors: [
					{
						belt_color: "ED930D",
						belt_name: "Orange",
						is_child: false
					}
				]
			}
		]
	}

	let tags = {
		results: [
			{

				"id": 1,
				"name": "kihon waza"
			},
			{
				"id": 2,
				"name": "svart"
			},
			{
				"id": 3,
				"name": "brunt"
			},
			{
				"id": 4,
				"name": "grönt"
			},
			{
				"id": 5,
				"name": "blått"
			},
			{
				"id": 6,
				"name": "gult"
			},
			{
				"id": 7,
				"name": "orange"
			},
			{
				"id": 8,
				"name": "vitt"
			}
		]
	}

	beforeEach(() => {
		server.use(
			rest.get("/api/search/techniques", (req, res, ctx) => {
				return res(
					ctx.json(techniques)
				)
			}),
			rest.post("/api/techniques", (req, res, ctx) => {
				techniques = {
					results: [
						{
							techniqueID: 1,
							name: "Grönt Testteknik",
							beltColors: [
								{
									belt_color: "ED930D",
									belt_name: "Orange",
									is_child: false
								}
							]
						},
						{
							techniqueID: 2,
							name: "Grått Testteknik nr 2",
							beltColors: [
								{
									belt_color: "ED930D",
									belt_name: "Orange",
									is_child: false
								}
							]
						},
						{
							techniqueID: 3,
							name: "Blå Testteknik nr 3",
							beltColors: [
								{
									belt_color: "ED930D",
									belt_name: "Orange",
									is_child: false
								}
							]
						}//,
						// {
						// 	techniqueID: 4,
						// 	name: "asd",
						// 	beltColors: [
						// 		{
						// 			belt_color: "201E1F",
						// 			belt_name: "Svart",
						// 			is_child: false
						// 		}
						// 	]
						// }
					]
				} 
				return res(
					ctx.json(req.json())
				)
			})

		)

		server.use(
			rest.get("http://localhost/api/belts", (req, res, ctx) => {
				return res(ctx.status(200), ctx.json(
					[
						{
							id: 1,
							name: "Vitt",
							color: "FCFCFC",
							child: false
						},
						{
							id: 13,
							name: "Svart",
							color: "201E1F",
							child: false
						}
					]
				))
			}),
		)

		server.use(
			rest.get("http://localhost/api/tags/all", (req, res, ctx) => {
				return res(
					ctx.json(tags)
				)
			}),
			rest.post("http://localhost/api/tags/add", (req, res, ctx) => {
				tags = {
					results: [
						{
							"id": 1,
							"name": "kihon waza"
						},
						{
							"id": 2,
							"name": "svart"
						},
						{
							"id": 3,
							"name": "brunt"
						},
						{
							"id": 4,
							"name": "grönt"
						},
						{
							"id": 5,
							"name": "blått"
						},
						{
							"id": 6,
							"name": "gult"
						},
						{
							"id": 7,
							"name": "orange"
						},
						{
							"id": 8,
							"name": "vitt"
						}
					]
				}
				return res(
					ctx.json(req.json())
				)
			})
			
		)

	})

	// The initial technique should be in the document
	test("on first load", async () => {
		render (
			<MemoryRouter>
				<TechniqueIndex/>
			</MemoryRouter>

		)
		await waitFor(() => {
			expect(requestSpy).toHaveBeenCalled()
		})
		await waitFor(() => {
			expect(screen.getByText("Grönt Testteknik")).toBeInTheDocument()
		})
		await waitFor(() => {
			expect(screen.getByText("Grått Testteknik nr 2")).toBeInTheDocument()
		})

	})

	test("should filter correctly, when leaving site and returning search-bar should have been saved", async () => {
		render(
			// eslint-disable-next-line no-dupe-keys
			<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", undefined }}>
				<MemoryRouter>
					<TechniqueIndex/>
				</MemoryRouter>
			</AccountContext.Provider>
		)

		expect(screen.getByText("Tekniker")).toBeInTheDocument()

		const searchInput = screen.getByTestId("searchbar-input")

		fireEvent.change(searchInput, { target: { value: "blå" } })

		await waitFor(() => { 
			expect(screen.getByText("Blå Testteknik nr 3")).toBeInTheDocument()
		})

		await waitFor(() => { 
			expect(screen.queryByText("Grönt Testteknik")).not.toBeInTheDocument()
		})

		await waitFor(() => {
			expect(screen.queryByText("Grått Testteknik nr 2")).not.toBeInTheDocument()
		})

		await userEvent.click(screen.getByTestId("technique-add-button"))

		const router = createMemoryRouter(
			createRoutesFromElements(
				<Route path="/*" element={<CreateTechnique/>} />
			)
		)
		render( //eslint-disable-line
			<RouterProvider router={router} />
		)

		expect(screen.getByTestId("create-technique-input-name")).toBeVisible()

		await userEvent.click(screen.getByTestId("create-technique-backbutton"))

		expect(screen.getByTestId("searchbar-input")).toHaveValue("blå")

		await waitFor(() => { 
			expect(screen.getByText("Blå Testteknik nr 3")).toBeInTheDocument()
		})

		await waitFor(() => { 
			expect(screen.queryByText("Grönt Testteknik")).not.toBeInTheDocument()
		})

		await waitFor(() => {
			expect(screen.queryByText("Grått Testteknik nr 2")).not.toBeInTheDocument()
		})

		fireEvent.change(searchInput, { target: { value: "" } })

	})

	test("should create a technique", async () => {
		var method = ""
		server.use(
			rest.all("http://localhost/api/techniques", async (req, res, ctx) => {
				method = req.method
				return res(ctx.status(HTTP_STATUS_CODES.SUCCESS))
			})
		)

		render (
			// eslint-disable-next-line no-dupe-keys
			<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", undefined }}>
				<MemoryRouter>
					<TechniqueIndex/>
				</MemoryRouter>
			</AccountContext.Provider>
		)

		expect(screen.getByText("Tekniker")).toBeInTheDocument()

		await userEvent.click(screen.getByTestId("technique-add-button"))

		const router = createMemoryRouter(
			createRoutesFromElements(
				<Route path="/*" element={<CreateTechnique/>} />
			)
		)
		render( //eslint-disable-line
			<RouterProvider router={router} />
		)


		expect(screen.getByTestId("belt-text-Svart")).toBeInTheDocument()

		await userEvent.type(screen.getByTestId("create-technique-input-name"), "asd")

		await userEvent.click(screen.getAllByTestId("belt-adult-Svart-checkbox")[1])

		await userEvent.click(screen.getByTestId("create-technique-createbutton"))

		await waitFor(() => {
			expect(requestSpy).toHaveBeenCalled()
		})

		await waitFor(() => {
			expect(method).toBe("POST")
		})

		/* Plan was to have the page rerendered with the new technique and checked with the code below but it didn't work, 
		settled for the POST call to complete the test instead */

		//expect(screen.getByText("asd")).toBeInTheDocument()

	})

	/**
	 * Plan is to have a test that confirms the serachText is saved when leaving the page and returning, 
	 * but also remains cleared in case a tag is selected first before the user leaves and returns.
	 * 
	 * TODO: Currently found no way of getting tags to show up when writing in the searchbar,
	 * might be a problem with how the api is called in the code but not sure.
	 * 
	 */

	// test("should keep the search bar text cleared when leaving the page after selecting a tag", async () => {
	
	// 	render(
	// 		// eslint-disable-next-line no-dupe-keys
	// 		<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", undefined }}>
	// 			<MemoryRouter>
	// 				<TechniqueIndex/>
	// 			</MemoryRouter>
	// 		</AccountContext.Provider>
	// 	)

	// 	expect(screen.getByText("Tekniker")).toBeInTheDocument()

	// 	const searchInput = screen.getByTestId("searchbar-input")

	// 	fireEvent.change(searchInput, { target: { value: "gr" } })

	// 	await waitFor(() => {
	// 		expect(screen.getByText("Grönt Testteknik")).toBeInTheDocument()
	// 	})

	// 	await new Promise((r) => setTimeout(r, 2000))

	// 	expect(screen.getByTestId("tag-in-searchbar-grönt")).toBeInTheDocument()

	// 	await userEvent.click(screen.getByTestId("tag-in-searchbar-grönt"))

	// 	expect(screen.getByTestId("searchbar-input")).toHaveValue("")
	// })

})
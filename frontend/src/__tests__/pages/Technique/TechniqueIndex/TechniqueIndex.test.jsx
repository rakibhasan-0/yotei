/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure, waitFor } from "@testing-library/react"
// import userEvent from "@testing-library/user-event"
import TechniqueIndex from "../../../../pages/Technique/TechniqueIndex/TechniqueIndex"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import { AccountContext } from "../../../../context"


import { rest } from "msw"
import { server } from "../../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)


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
				name: "Testteknik",
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
							name: "Testteknik",
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
							name: "Testteknik nr 2",
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
			expect(screen.getByText("Testteknik")).toBeInTheDocument()
		})
		await waitFor(() => {
			expect(screen.queryByText("Testteknik nr 2")).not.toBeInTheDocument()
		})

	})

	// The initial technique and the added technique should be in the document
	// test("when a technique is created", async () => {
	// 	render (
	// 		// eslint-disable-next-line no-dupe-keys
	// 		<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", undefined }}>
	// 			<MemoryRouter>
	// 				<TechniqueIndex/>
	// 			</MemoryRouter>
	// 		</AccountContext.Provider>
	// 	)

	// 	const user = userEvent.setup() 
	// 	jest.setTimeout(10000)

	// 	// Add a technique
	// 	await user.click(screen.getByTestId("technique-add-button"))
	// 	await user.type(screen.getByPlaceholderText("Namn"), "Testteknik nr 2")
	// 	await user.click(screen.getByText("Lägg till"))

	// 	await waitFor(() => {
	// 		expect(requestSpy).toHaveBeenCalled()
	// 	})

	// 	await waitFor(() => {
	// 		expect(screen.getByText("Testteknik")).toBeInTheDocument()
	// 	})

	// 	await waitFor(() => {
	// 		expect(screen.getByText("Testteknik nr 2")).toBeInTheDocument()
	// 	})

	// })
})

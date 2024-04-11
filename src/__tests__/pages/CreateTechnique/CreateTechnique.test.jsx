/** @jest-environment jsdom */
// React/Jest imports
//import React, {useState as useStateMock} from "react"
import { render, screen, configure } from "@testing-library/react"
//import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
//import { HTTP_STATUS_CODES } from "../../../utils"


// Required for MSW mocking of API responses.
import { rest } from "msw"
import { server } from "../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

import CreateTechnique from "../../../pages/Technique/CreateTechnique/CreateTechnique"
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router-dom"
import userEvent from "@testing-library/user-event"
import TechniqueIndex from "../../../pages/Technique/TechniqueIndex/TechniqueIndex"

configure({ testIdAttribute: "id" })

/* jest.mock("react", () => ({
	...jest.requireActual("react"),
	useState: jest.fn(),
}))
const setState = jest.fn() */

/* beforeEach(() => {
	useStateMock.mockImplementation(init => [init, setState])
}) */

describe("CreateTechnique should render", () => {



	beforeEach(() => {
		const router = createMemoryRouter(
			createRoutesFromElements(
				<Route path="/*" element={<CreateTechnique/>} />
			)
		)
		render( //eslint-disable-line
			<RouterProvider router={router} />
		)
	})

	test("the title", () => {
		expect(screen.getByText("Skapa teknik")).toBeInTheDocument()
	})

	test("the name input", () => {
		expect(screen.getByPlaceholderText("Beskrivning av teknik")).toBeInTheDocument()
	})

	test("the description input", () => {
		expect(screen.getByPlaceholderText("Namn")).toBeInTheDocument()
	})

	test("the kihon checkbox", () => {
		expect(screen.getByText("Kihon")).toBeInTheDocument()
	})

	test("the beltpicker", () => {
		expect(screen.getByText("Bälten")).toBeInTheDocument()
	})

	test("the tags title", () => {
		expect(screen.getByText("Taggar")).toBeInTheDocument()
	})

	test("the add tags", () => {
		expect(screen.getByText("Lägg till tagg")).toBeInTheDocument()
	})

	test("the continue to create technique checkbox", () => {
		expect(screen.getByText("Fortsätt skapa tekniker")).toBeInTheDocument()
	})

	test("the clear fields checkbox", () => {
		expect(screen.getByText("Rensa fält")).toBeInTheDocument()
	})

	test("the back button", () => {
		expect(screen.getByText("Tillbaka")).toBeInTheDocument()
	})

	test("the add technique button", () => {
		expect(screen.getByText("Lägg till")).toBeInTheDocument()
	})
})

describe("CreateTechnique on back with unsaved values should", () => {

	test("show confirmation popup", async () => {
		const router = createMemoryRouter(
			createRoutesFromElements(
				<Route path="/*" element={<CreateTechnique/>}/>
			)
		)
		render( //eslint-disable-line
			<RouterProvider router={router} />
		)

		const user = userEvent.setup()
		await user.type(screen.getByPlaceholderText("Namn"), "Test")
		await user.click(screen.getByRole("button", { name: "Tillbaka" }))

		expect(screen.getByTestId("create-technique-confirm-popup")).toBeInTheDocument()
	})

	test("close popup when user clicks 'nej'", async () => {


		//Mock technique in order to make infinite scroller happy
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

		server.use(
			rest.get("/api/search/techniques", (req, res, ctx) => {
				return res(
					ctx.json(techniques)
				)
			}))

		const router = createMemoryRouter(
			createRoutesFromElements(
				<>
					<Route path="technique" element={<TechniqueIndex/>} />
					<Route path="technique/create" element={<CreateTechnique/>} />
				</>
			),
			{initialIndex: 1, initialEntries: ["technique", "/technique/create"]}
		)

		render( //eslint-disable-line
			<RouterProvider router={router} />
		)

		const user = userEvent.setup()
		await user.type(screen.getByPlaceholderText("Namn"), "Test")
		await user.click(screen.getByRole("button", { name: "Tillbaka" }))
		await user.click(screen.getByRole("button", { name: "Avbryt" }))

		expect(screen.getByText("Skapa teknik")).toBeInTheDocument()
	})

	test("close popup when user clicks 'ja'", async () => {

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

		server.use(
			rest.get("/api/search/techniques", (req, res, ctx) => {
				return res(
					ctx.json(techniques)
				)
			}))

		const router = createMemoryRouter(
			createRoutesFromElements(
				<>
					<Route path="technique" element={<TechniqueIndex/>} />
					<Route path="technique/create" element={<CreateTechnique/>} />
				</>
			),
			{initialIndex: 1, initialEntries: ["technique", "/technique/create"]}
		)

		render( //eslint-disable-line
			<RouterProvider router={router} />
		)

		const user = userEvent.setup()
		await user.type(screen.getByPlaceholderText("Namn"), "Test")
		await user.click(screen.getByRole("button", { name: "Tillbaka" }))
		await user.click(screen.getByRole("button", { name: "Lämna" }))

		expect(screen.getByText("Tekniker")).toBeInTheDocument()

	})
})

/* describe("CreateTechnique on post should", () => {
	
	

	test("call post", async () => {
		const setIsOpenMock = jest.fn()
		jest.spyOn(React, "useState").mockReturnValueOnce([false, setIsOpenMock])

		render( //eslint-disable-line
			<CreateTechnique id={"Test"} setIsOpen={setIsOpenMock} />
		)

		var method = ""
		server.use(
			rest.all("http://localhost/api/techniques", async (req, res, ctx) => {
				method = req.method
				return res(ctx.status(HTTP_STATUS_CODES.SUCCESS))
			})
		)

		//ACT
		const user = userEvent.setup()
		await user.click(screen.getByText("Lägg till"))

		//ASSERT
		expect(requestSpy).toHaveBeenCalled()
		expect(method).toBe("POST")

	})

	test("receive error when technique already exists", async () => {
		const setIsOpenMock = jest.fn()

		jest.spyOn(React, "useState").mockReturnValueOnce([false, setIsOpenMock])

		render( //eslint-disable-line
			<CreateTechnique id={"Test"} setIsOpen={setIsOpenMock} />
		)
		
		server.use(
			rest.all("http://localhost/api/techniques", async (req, res, ctx) => {
				return res(ctx.status(HTTP_STATUS_CODES.CONFLICT), ctx.json({ message: "Technique already exists" }))
			})
		)

		//ACT
		const user = userEvent.setup()
		await user.click(screen.getByText("Lägg till"))	
		
		//ASSERT
		expect(await screen.findByText("Tekniken finns redan")).toBeInTheDocument()
		
	})
}) */
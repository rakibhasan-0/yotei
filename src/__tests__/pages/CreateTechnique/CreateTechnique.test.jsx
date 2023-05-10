/** @jest-environment jsdom */
// React/Jest imports
//import React, {useState as useStateMock} from "react"
import { render, screen, configure } from "@testing-library/react"
//import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
//import { HTTP_STATUS_CODES } from "../../../utils"

// Required for MSW mocking of API responses.
//import { rest } from "msw"
import { server } from "../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

import CreateTechnique from "../../../pages/Technique/CreateTechnique/CreateTechnique"
import Popup from "../../../components/Common/Popup/Popup"

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
		render( //eslint-disable-line
			<Popup title={"Skapa teknik"} isOpen={true}>
				<CreateTechnique />
			</Popup>
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
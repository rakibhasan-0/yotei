/* eslint-disable linebreak-style */
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import SessionContainer from "../../../components/Plan/SessionContainer"
import { BrowserRouter } from "react-router-dom"

configure({testIdAttribute: "id"})


describe("SessionContainer", () => {
	describe("When initialized", () => {

		test("should render with given id -> testSessionContainer", async() => {
			render(<BrowserRouter><SessionContainer id = "testSessionContainer"/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toHaveAttribute("id", "testSessionContainer")
		})

		test("should render component with given session information", async() => {
			let session = {
				"id": "1",
				"text": "",
				"workout_id": "1",
				"plan_id": "1",
				"date": "2023-04-10",
				"time": "08:00"
			}

			let plan = {
				"plan_id": "1",
				"name": "Grön/Blå",
				"belts": [
					{id: "1", color: "#00BE08", name:"Grön", child: "false"},
					{id: "1", color: "#0DB7ED", name:"Blå", child: "false"}
				],
				"user_id": "1"
			}

			render(<BrowserRouter><SessionContainer id = "testSessionContainer" autoClose = "false" session = {session} plan={plan}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toHaveTextContent("08:00")
		})

		test("should render component with date 2023-05-16 day -> Tis", async () => {
			let session = {
				"id": "1",
				"text": "",
				"workout_id": "1",
				"plan_id": "1",
				"date": "2023-05-16",
				"time": "08:00"
			}

			let plan = {
				"plan_id": "1",
				"name": "Grön/Blå",
				"belts": [
					{id: "1", color: "#00BE08", name:"Grön", child: "false"},
					{id: "1", color: "#0DB7ED", name:"Blå", child: "false"}
				],
				"user_id": "1"
			}

			render(<BrowserRouter><SessionContainer id = "testSessionContainer" autoClose = "false" session = {session} plan = {plan}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toHaveTextContent("Tis")
		})

		test("should render component with given plan name -> Grön/Blå", async () => {
			let plan = {
				"plan_id": "1",
				"name": "Grön/Blå",
				"belts": [
					{id: "1", color: "#00BE08", name:"Grön", child: "false"},
					{id: "1", color: "#0DB7ED", name:"Blå", child: "false"}
				],
				"user_id": "1"
			}
			render(<BrowserRouter><SessionContainer id="testSessionContainer" autoClose = "false" plan={plan}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toHaveTextContent("Grön/Blå")
		})

		test("should render beltbox ig plan is valid", () => {
			let session = {
				"id": "1",
				"text": "",
				"workout_id": "1",
				"plan_id": "1",
				"date": "2023-05-16",
				"time": "08:00"
			}

			let plan = {
				"plan_id": "1",
				"name": "Grön/Blå",
				"belts": [
					{id: "1", color: "#00BE08", name:"Grön", child: "false"},
					{id: "1", color: "#0DB7ED", name:"Blå", child: "false"}
				],
				"user_id": "1"
			}

			render(<BrowserRouter><SessionContainer id = "testSessionContainer" autoClose = "false" session = {session} plan = {plan}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toContainHTML("<BeltBox")
		})
	})


	describe("Invalid input", () => {
		test("Should render placeholder if invalid ID", () => {
			const { container } = render(<BrowserRouter><SessionContainer/></BrowserRouter>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Kunde inte ladda in tillfället"))
		})

		test("Should render existing information from session and plan if existing, plan missing name", async() => {
			let plan = {
				"plan_id": "1",
				"belts": [
					{id: "1", color: "#00BE08", name:"Grön", child: "false"},
					{id: "1", color: "#0DB7ED", name:"Blå", child: "false"}
				],
				"user_id": "1"
			}

			let session = {
				"id": "1",
				"text": "",
				"workout_id": "1",
				"plan_id": "1",
				"date": "2023-05-16",
				"time": "08:00"
			}
			
			render(<BrowserRouter><SessionContainer id = "testSessionContainer" session={session} plan={plan}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toHaveTextContent("unnamed")
		})

		test("Should render existing information from session and plan if existing, session missing", async() => {
			let plan = {
				"plan_id": "1",
				"name": "Blå/Grön",
				"belts": [
					{id: "1", color: "#00BE08", name:"Grön", child: "false"},
					{id: "1", color: "#0DB7ED", name:"Blå", child: "false"}
				],
				"user_id": "1"
			}
			
			render(<BrowserRouter><SessionContainer id = "testSessionContainer" session={null} plan={plan}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toHaveTextContent("Blå/Grön")
		})

		test("Should render existing information from session and plan if existing, plan missing", async() => {
			let session = {
				"id": "1",
				"text": "",
				"workout_id": "1",
				"plan_id": "1",
				"date": "2023-05-16",
				"time": "08:00"
			}
			
			render(<BrowserRouter><SessionContainer id = "testSessionContainer" session={session} plan={null}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionContainer")).toHaveTextContent("16/05")
			expect(screen.getByTestId("testSessionContainer")).toHaveTextContent("08:00")
		})
	})

	describe("When interacted with", () => {
		test.todo("should not display content when initialized")
		test.todo("should open if closed and sessionheader is clicked")

		test.todo("should close if open and sessionheader is clicked")
	})
})
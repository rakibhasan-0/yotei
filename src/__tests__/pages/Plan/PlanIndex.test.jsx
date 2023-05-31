import { render, configure, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import PlanIndex from "../../../pages/Plan/PlanIndex"
import { rest } from "msw"
import { server } from "../../server"

configure({testIdAttribute: "id"})
jest.mock("react-router", () => ({
	useNavigate: () => jest.fn()
}))

// Mock the Link component
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	Link: jest.fn().mockImplementation(({ children }) => children),
}))

test("Should render title on init", async () => {
	render(<PlanIndex/>)
	expect(screen.getByText("Grupplanering")).toBeInTheDocument()
})

test("should render data from the plan api", async () => {
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


test.todo("should render data from the sessions api")

test.todo("should render data from the workout api")



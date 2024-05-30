import { render, configure, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import PlanIndex from "../../../pages/Plan/PlanIndex"
import { rest } from "msw"
import { server } from "../../server"
import GroupPicker from "../../../components/Plan/GroupPicker"

//TODO: Get permission tests working using correct imports and correct code... Compare with e.g. WorkoutIndex.test.jsx.
//import { AccountContext } from "../../../context"
//import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router"
//import { Route, createMemoryRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
//import { USER_PERMISSION_CODES, USER_PERMISSION_LIST_ALL } from "../../../utils"

/**
 * @author Team Durian (Group 3) (2024-04-23)  Team Mango (Group 4) (2024-05-29)
 * Updates: 2024-05-29: Added permission unit tests.
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

test("Should render title on init", async () => {
	render(<PlanIndex/>)
	//Gets the first "Planering" so there can exist a header and a tab title with the same name. 
	expect(screen.getAllByText("Planering")[0]).toBeInTheDocument()
})

test("should render data from the plan api", async () => {
	// ARRANGE	
	render(<GroupPicker id = {42}/>) //This is needed now since PlanIndex.jsx has been updated. PlanIndex should probably be rewritten to not require this.
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

//TODO remove these? Or do?
test.todo("should render data from the sessions api")
test.todo("should render data from the workout api")



//PERMISSION TESTS.
/*
describe("verify permissions", () => {

	// Render the PlanIndex page with router and account context.
const renderWithRouter = async(permissions_list) => {
	window.HTMLElement.prototype.scrollIntoView = jest.fn
	const router = createMemoryRouter(
		createRoutesFromElements( [
			<Route key={"key1"} path="plan" element={<PlanIndex/>}/> , //The path is found in index.js.
		]
		),
		{initialEntries: ["/plan"]}
	)

	render ( //eslint-disable-next-line no-dupe-keys
		<AccountContext.Provider value={{ undefined, userId: "", permissions: permissions_list, undefined }}>
			<RouterProvider router={router}/>
		</AccountContext.Provider>
	)
}

	test("Admin should see create session button", async () => {
		renderWithRouter(USER_PERMISSION_LIST_ALL)
		expect(screen.getByTestId("CreateSessionButton")).toBeInTheDocument()
	})

	test("Admin should see create session button", async () => {
		renderWithRouter([USER_PERMISSION_CODES.GRADING_ALL])
		expect(screen.getByTestId("CreateSessionButton")).toBeInTheDocument()
	})

	test("Admin should see create session button", async () => {
		renderWithRouter(USER_PERMISSION_LIST_ALL)
		expect(screen.getByTestId("CreateSessionButton")).toBeInTheDocument()
	})

})
*/
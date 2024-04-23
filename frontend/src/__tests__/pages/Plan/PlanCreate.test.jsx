import {configure, render} from "@testing-library/react"
// import {screen, waitFor, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import PlanCreate from "../../../pages/Plan/PlanCreate"
import { React} from "react"

// import userEvent from "@testing-library/user-event"
// import { rest } from "msw"
// import { server } from "../../server"


/**
 * Unit-test for the PlanCreate page, 
 *
 * @author Team Mango (Group 4)
 * @since 2024-04-22
 * @version 1.0 
 */
configure({testIdAttribute: "id"})
jest.mock("react-router", () => ({
	useNavigate: () => jest.fn(),
	unstable_useBlocker: () => jest.fn()
}))

test.todo("Should render some basics on init") 
test("Should render Skapa Grupp", async () => {
	render(<PlanCreate/>)

	//expect(screen.getByText("Skapa grupp")).toBeInTheDocument()
})


// test.todo("Should render a fail popup-isch to user on creating a plan that already exists")
test("Should render a toast error-message on creating duplicate groups", async () => {
	/* Render component*/

	/* Create a group */

	// Create the group again

	// await the message and expect it to be in the document
})

/*
 * TODO: The test is supposed to validate that no plan/group is added when an exception occrous.
 * The test would mock the API call to "api/plan/add" verify that no plan was created.
 * 
 * What works: 
 *      - mocking of the API
 *      - fireing event to add a group name
 * 		- expecting that the API url "api/plan/add" was called/not called
 * 
 * What didnt work:
 * 		- selecting a belt using "userevent.click" 
 * 		- selecting a belt by changing its selected status to true
 * 		- finding all belts using "server.use"
 * 
 * The test is incomplete because no belts coiuld be found, or selected. This causes the API to 
 * never be exectued because it alwaus fails. For the test to work, it would need to be able to pass the 
 * "valdiateFrom" function in "PlanCreate".
 */
// describe("Create group/plan should", ()=> {

// 	test("not create plan/group when error occours", async () => {
// 		// Mock fetch implementation
// 		jest.spyOn(global, "fetch").mockImplementation((url, options) => {
// 			// Check if the URL matches the API endpoint you want to ignore
// 			if (url === "/api/belts", {"headers": {"token": ""}}) {
// 				// Return a resolved Promise without performing any assertions
// 				return Promise.resolve()
// 			}

// 			// For other API calls, return a mock response or perform assertions if needed
// 			// You can add another mockImplementation for other API calls if required

// 			// Return a mock response for other API calls
// 			return Promise.resolve({ ok: true })
// 		})

// 		render(<PlanCreate/>)
		
// 		const namvaldiateFromeInput = screen.getByTestId("name")
// 		fireEvent.change(nameInput, {target:{value:"Test name"}})
	
// 		await userEvent.click(screen.getByTestId("form-belt-picker-dropdown"))
// 		expect(screen.getByText("Orange")).toBeInTheDocument()
// 		await userEvent.click(screen.getByTestId("belt-child-Vitt"))
		
// 		server.use(
// 			rest.get("api/belts/all", async (req, res, ctx) => {
// 				return res(
// 					ctx.status(200),
// 					ctx.json([
// 						{
// 							"id": 1,
// 							"name": "Vitt",
// 							"color": "FCFCFC",
// 							"child": false
// 						},
// 						{
// 							"id": 2,
// 							"name": "Vitt",
// 							"color": "BD3B41",
// 							"child": true
// 						}
// 					])
					
// 				)
// 			})valdiateFrom
// 		)

// 		await screen.findByTestId("form-belt-picker-children")
// 		fireEvent.click(screen.getByTestId("belt-child-Vitt"), {target:{checked:true}})
		
// 		await waitFor(() => {
// 			expect(global.fetch).toHaveBeenCalledWith(
// 				"/api/plan/add",
// 				{
// 					body: JSON.stringify({
// 						name: "Test name",
// 						belts: [],
// 						userId: 0,
// 					}),
// 					headers: {
// 						"Content-type": "application/json",
// 						token: "",
// 					},
// 					method: "POST",
// 				}
// 			)
// 		})
// 	})
// })



  
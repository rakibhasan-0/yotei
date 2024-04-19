import {configure, render, screen, waitFor, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import PlanCreate from "../../../pages/Plan/PlanCreate"
import userEvent from "@testing-library/user-event"
//import { rest } from "msw"
//import { server } from "../../server"
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

describe("Create group/plan should", ()=> {
	// beforeEach(() => {
	// 	global.fetch = jest.fn()
	// })
	
	test("not create plan/group when error occours", async () => {
    // Mock fetch implementation
    jest.spyOn(global, 'fetch').mockImplementation((url, options) => {
        // Check if the URL matches the API endpoint you want to ignore
        if (url === "/api/belts", {"headers": {"token": ""}}) {
            // Return a resolved Promise without performing any assertions
            return Promise.resolve();
        }

        // For other API calls, return a mock response or perform assertions if needed
        // You can add another mockImplementation for other API calls if required

        // Return a mock response for other API calls
        return Promise.resolve({ ok: true });
    });


		const setIsBlocking = jest.fn()
		const setSuccessToast = jest.fn()
		const navigate = jest.fn()
		const setBelts = jest.fn()
		const planData = { name: "Test Plan", startDate: "1", endDate: "2", weekdaysSelected: false }
		const beltsChosen = ["Yellow", "Green"]
		const userId = "123"
		const token = "fakeToken"
		const dateHandler = jest.fn()
		const blocker = false
		const weekdays = [
			{ name: "Mån", value: false, time: "" },
			{ name: "Tis", value: false, time: "" },
			{ name: "Ons", value: false, time: "" },
			{ name: "Tors", value: false, time: "" },
			{ name: "Fre", value: false, time: "" },
			{ name: "Lör", value: false, time: "" },
			{ name: "Sön", value: false, time: "" }
		]
		const BeltPicker = jest.fn()
		const PlanForm = jest.fn()
		const fieldCheck = {name: true, startDate: true, endDate: true}

		render(
			<PlanCreate
				// setIsBlocking={setIsBlocking}
				// setSuccessToast={setSuccessToast}
				// navigate={navigate}
				planData={planData}
				beltsChosen={beltsChosen}
				userId={userId}
				token={token}
				// dateHandler={dateHandler}
				// setBelts={setBelts}
				useBlocker={blocker}
				weekdays={weekdays}
				BeltPicker={BeltPicker}
				// PlanForm={PlanForm}
				fieldCheck={fieldCheck}
			/>)
	
		const nameInput = screen.getByTestId("name")
		fireEvent.change(nameInput, {target:{value:"Test name"}})

		await userEvent.click(screen.getByTestId("form-belt-picker-dropdown"))
		expect(screen.getByText("Orange")).toBeInTheDocument()
		// await userEvent.click(screen.getByTestId("belt-child-Vitt"))


		// expect(global.fetch).toHaveBeenCalledWith("/api/belts", {"headers": {"token": ""}})
		await userEvent.click(screen.getByText("Gå vidare"))
	
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("/api/plan/add", 
			{"body": "{\"name\":\"Test name\",\"belts\":[],\"userId\":0}", "headers": {"Content-type": "application/json", "token": ""}, "method": "POST"})
		})


	})
})



  
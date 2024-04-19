import {configure, render, screen} from "@testing-library/react"
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
		jest.spyOn(global, "fetch").mockImplementationOnce(() => Promise.resolve({}))

		const setIsBlocking = jest.fn()
		const setSuccessToast = jest.fn()
		const navigate = jest.fn()
		const setBelts = jest.fn()
		const planData = { name: "Test Plan" }
		const beltsChosen = ["Yellow", "Green"]
		const userId = "123"
		const token = "fakeToken"
		const dateHandler = jest.fn()
		const blocker = false
	
		render(
			<PlanCreate
				setIsBlocking={setIsBlocking}
				setSuccessToast={setSuccessToast}
				navigate={navigate}
				planData={planData}
				beltsChosen={beltsChosen}
				userId={userId}
				token={token}
				dateHandler={dateHandler}
				setBelts={setBelts}
				useBlocker={blocker}
			/>)
	
		await userEvent.click(screen.getByText("Gå vidare"))
	
		expect(global.fetch).not.toHaveBeenCalledWith("/api/plan/add")
	})
})



  
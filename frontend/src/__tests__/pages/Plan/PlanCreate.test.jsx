import {configure} from "@testing-library/react"
import "@testing-library/jest-dom"
//import { rest } from "msw"
//import { server } from "../../server"
configure({testIdAttribute: "id"})
jest.mock("react-router", () => ({
	useNavigate: () => jest.fn()
}))


test.todo("Should render some basics on init") 
test("Should render Skapa Grupp", async () => {
	//render(<PlanCreate/>)

	//expect(screen.getByText("Skapa grupp")).toBeInTheDocument()
})


// test.todo("Should render a fail popup-isch to user on creating a plan that already exists")
test("Should render a toast error-message on creating duplicate groups", async () => {
	/* Render component*/

	/* Create a group */

	// Create the group again

	// await the message and expect it to be in the document
})





  
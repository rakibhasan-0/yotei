import { render, configure, screen, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import GroupIndex from "../../../pages/Plan/GroupIndex/GroupIndex"
import { rest } from "msw"
import { server } from "../../server"

/**
 * Unit-test for the GroupIndex page, 
 * init as well as making sure search button is case insensitive
 *
 * @author Team Mango (Group 4)
 * @since 2024-04-18
 * @version 1.0 
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
	render(<GroupIndex/>)
	expect(screen.getByText("Grupper")).toBeInTheDocument()
})

// This test should make sure that the group search bar is working as intended (is case insensitive)
test("Should render a group when searching for it", async () => {
	render(<GroupIndex/>)
	
	server.use(
		rest.get("api/plan/all", async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{
						"id": 1,
						"name": "Grönt bälte träning",
						"userId": 1,
						"belts": [
							{
								"id": 7,
								"name": "Grönt",
								"color": "0C7D2B",
								"child": false
							}
						]
					},
					{
						"id": 2,
						"name": "Orange och Gult bälte träning",
						"userId": 1,
						"belts": [
							{
								"id": 5,
								"name": "Orange",
								"color": "FFA133",
								"child": false
							},
							{
								"id": 9,
								"name": "Blått",
								"color": "1E9CE3",
								"child": false
							}
						]
					},
				])
                
			)
		})
	)

	/*After rendering screen and fetching info, 
    the test finds the searchbar and gives it the input "grönt" 
    */

	/* Technical sidenote: Had good solution for test using queryselector("input"),
    however linter complained resulting in a much more ugly solution.
    Also test does not work if placeholder text changes. (fix ASAP if possible)
    */ 
	await screen.findByTestId("searchbar-groups")
	const searchInput = screen.getByTestId("searchbar-input")
    
	fireEvent.change(searchInput, { target: { value: "grönt" } })

	//Test 1: Should only one of the belts.
	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.queryByText("Orange och Gult bälte träning")).not.toBeInTheDocument()

	fireEvent.change(searchInput, { target: { value: "g" } })

	//Test 2: Change input which makes it so both belts should be found.
	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.getByText("Orange och Gult bälte träning")).toBeInTheDocument()
})
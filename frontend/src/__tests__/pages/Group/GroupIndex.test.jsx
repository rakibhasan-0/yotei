import { render, configure, screen, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import GroupIndex from "../../../pages/Plan/GroupIndex/GroupIndex"
import { rest } from "msw"
import { server } from "../../server"
import { act } from '@testing-library/react' //This is to get rid of warnings when testing.

/**
 * Unit-test for the GroupIndex page, 
 * init as well as making sure search button is case insensitive
 *
 * @author Team Mango (Group 4) (2024-05-02), Team Durian (Group 3) (2024-04-23)
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
	act( () => { render(<GroupIndex/>) } )
	//Gets the first "Grupper" so there can exist a header and a tab title with the same name.
	expect(screen.getAllByText("Grupper")[0]).toBeInTheDocument()
})

// This test should make sure that the group search bar is working as intended (is case insensitive)
test("Should render a group when searching for it", async () => {
act( () => {
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
})

	/*After rendering screen and fetching info, 
    the test finds the searchbar and gives it the input "grönt" 
    */
   
	await screen.findByTestId("searchbar-groups")
	const searchInput = screen.getByTestId("searchbar-input")
    
	act( () => fireEvent.change(searchInput, { target: { value: "gRöNt" } }) )

	//Test 2: Should only one of the belts, this time with uppercase letters.
	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.queryByText("Orange och Gult bälte träning")).not.toBeInTheDocument()

	act( () => fireEvent.change(searchInput, { target: { value: "g" } }) )

	//Test 3: Should find both belts.
	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.getByText("Orange och Gult bälte träning")).toBeInTheDocument()

	act( () => fireEvent.change(searchInput, { target: { value: "G" } }) )

	//Test 4: Should find both belts, this time with uppercase letters again.

	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.getByText("Orange och Gult bälte träning")).toBeInTheDocument()
})



//This tests the edge case of there being no groups (previously caused a bug).
test("Should display proper message when there are no groups", async () => {
	
	act( () => {

		render(<GroupIndex/>)

		server.use(
			rest.get("api/plan/all", async (req, res, ctx) => {
				return res(
					ctx.status(200),
					//ctx.json([{},]) //This needs to be commented out/removed. Leaving it empty still counts as a group being made.
				)
			})
		)

	} )
	await screen.findByTestId("searchbar-groups") //This is needed for the test to work.
	//const searchInput = screen.getByTestId("searchbar-input")
	//act( () => fireEvent.change(searchInput, { target: { value: "g" } }) )
	expect(screen.getByText("Det finns inga grupper att visa")).toBeInTheDocument() // This line should be changed to the updated error message if the test fails. Or this should not be tested in this way...
})

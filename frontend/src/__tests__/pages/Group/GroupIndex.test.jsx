import { render, configure, screen, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import GroupIndex from "../../../pages/Plan/GroupIndex/GroupIndex"
import { rest } from "msw"
import { server } from "../../server"

/**
 * Unit-test for the GroupIndex page, 
 * init as well as making sure search button is case insensitive
 *
 * @author Team Mango (Group 4) (2024-05-06), Team Durian (Group 3) (2024-04-23)
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

jest.mock('../../../utils', () => ({
	...jest.requireActual('../../../utils'),
	canEditGroups: jest.fn().mockReturnValue(true),
}));
  

test("Should render title on init", async () => {
	render(<GroupIndex/>)
	//Gets the first "Grupper" so there can exist a header and a tab title with the same name.
	expect(screen.getAllByText("Grupper")[0]).toBeInTheDocument()
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
   
	await screen.findByTestId("searchbar-groups")
	const searchInput = screen.getByTestId("searchbar-input")
    
	fireEvent.change(searchInput, { target: { value: "gRöNt" } })

	//Test 2: Should only one of the belts, this time with uppercase letters.
	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.queryByText("Orange och Gult bälte träning")).not.toBeInTheDocument()

	fireEvent.change(searchInput, { target: { value: "g" } })

	//Test 3: Should find both belts.
	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.getByText("Orange och Gult bälte träning")).toBeInTheDocument()

	fireEvent.change(searchInput, { target: { value: "G" } })

	//Test 4: Should find both belts, this time with uppercase letters again.

	expect(screen.getByText("Grönt bälte träning")).toBeInTheDocument()
	expect(screen.getByText("Orange och Gult bälte träning")).toBeInTheDocument()
})



//This tests the edge case of there being no groups (previously caused a bug).
test("Should display proper message when there are no groups", async () => {
	render(<GroupIndex/>)

	server.use(
		rest.get("api/plan/all", async (req, res, ctx) => {
			return res(
				ctx.status(200),
				//ctx.json([{},]) //This needs to be commented out/removed. Leaving it empty still counts as a group being made.
			)
		})
	)

	await screen.findByTestId("No-groups-visible-text") //This is needed for the test to work.
	expect(screen.getByTestId("No-groups-visible-text")).toBeInTheDocument()
})


//This tests the edge case of there being no groups (previously caused a bug).
test("Should not display groups missing message when there are groups", async () => {

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
				])
			) 
		})
	)

	await screen.findByTestId("Groups-are-visible") //This is needed for the test to work.
	expect(screen.getByTestId("Groups-are-visible")).toBeInTheDocument()
	//The code below would also work, but we want fast tests, so we instead opt for the unnecessary div solution.
	//await new Promise((r) => setTimeout(r, 2000))
	//expect(screen.queryByTestId("No-groups-visible-text")).not.toBeInTheDocument()

})

test("Should render statistics button next to group", async () => {

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
				])
			)
		})
	)

	await screen.findByTestId("statistics-page-button")


})
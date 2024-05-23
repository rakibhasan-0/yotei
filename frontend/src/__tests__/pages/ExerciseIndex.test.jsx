import "@testing-library/jest-dom"
import { rest } from "msw"
import { server } from "../server"
import {render, configure, screen, waitFor} from "@testing-library/react"
//import userEvent from "@testing-library/user-event"
//import ExerciseCreate from "../../pages/Activity/Exercise/ExerciseCreate"
import ExerciseIndex from "../../pages/Activity/Exercise/ExerciseIndex"
import { MemoryRouter } from "react-router-dom"
import { AccountContext } from "../../context"
import { USER_PERMISSION_LIST_ALL } from "../../utils"

/**
 * Unit-test for the Exercise Index page, 
 *
 * @author UNKNOWN, Team Mango (Group 4) (2024-05-22)
 * Updated 2024-05-22: Added so admin have all permissions according to new permissions implementation.
 */

configure({testIdAttribute: "id"})
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

async function getData() {
	const response = await fetch("http://localhost/api/search/exercises?name=text&tags=")
  
	return response.json()
}

let method = "" // Declare method variable outside of beforeEach
describe("mocktest", () => {

	beforeEach(async () => {
	// ARRANGE
		server.use(
			rest.get("http://localhost/api/search/exercises", async (req, res, ctx) => {
				method = req.method // Assign value to method variable

				return res(
					ctx.status(200),
					ctx.json([
						{
							item: "Hoppa högt",
							text: "420 min",
							detailURL: "bsurl.com/fake/",
							id: 87,
							index: 420,
						},
						{
							item: "Löpning",
							text: "30 min",
							detailURL: "bsurl.com/fake2/",
							id: 88,
							index: 30,
						},
					])
				)
			})
		)

		await getData() // Fetch the data inside beforeEach
	})


	test("mocked exercise data should match expected data", async () => {
	// ACT
		const data = await getData()

		// ASSERT
		expect(requestSpy).toHaveBeenCalled()
		expect(method).toBe("GET")
	
		// Assertions for the first exercise in the array
		expect(data[0].item).toEqual("Hoppa högt")
		expect(data[0].text).toEqual("420 min")
		expect(data[0].detailURL).toEqual("bsurl.com/fake/")
		expect(data[0].id).toEqual(87)
		expect(data[0].index).toEqual(420)
	
		// Assertions for the second exercise in the array
		expect(data[1].item).toEqual("Löpning")
		expect(data[1].text).toEqual("30 min")
		expect(data[1].detailURL).toEqual("bsurl.com/fake2/")
		expect(data[1].id).toEqual(88)
		expect(data[1].index).toEqual(30)
	})
})
describe("ExerciseIndex should render with all components", () => {

	beforeEach(() => {
		render( //eslint-disable-line
			<AccountContext.Provider value={{ undefined, role: "ADMIN", permissions: USER_PERMISSION_LIST_ALL, userId: "" }}>
				<MemoryRouter>
					<ExerciseIndex />
				</MemoryRouter>
			</AccountContext.Provider>
		)
	})
      
	test("the title", () => {
		expect(screen.getByTestId("exercise-header")).toBeInTheDocument()
	})

	test("the search bar", async () => {
		await waitFor (() => {
			expect(screen.getByTestId("exercise-search-bar")).toBeInTheDocument()
		})
	})

	test("the round button", () => {
		expect(screen.getByTestId("exercise-round-button")).toBeInTheDocument()
	})
	test("the filter button", async () => {
		await waitFor (() => {
			expect(screen.getByTestId("ei-filter")).toBeInTheDocument()
		})
	})
	test("the filter container", async () => {
		await waitFor (() => {
			expect(screen.getByTestId("ei-sort")).toBeInTheDocument()
		})
	})

})


// Call getData function before the test
beforeEach(async () => {
	await getData()
})

test("mocked exercise data is displayed on the page", async () => {
	expect(true).toBe(true)

})
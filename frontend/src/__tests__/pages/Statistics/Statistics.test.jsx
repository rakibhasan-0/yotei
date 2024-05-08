import "@testing-library/jest-dom"
import { render, screen, fireEvent, configure, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Statistics from "../../../pages/Statistics/Statistics"
import StatisticsPopUp from "../../../pages/Statistics/StatisticsPopUp"
configure({ testIdAttribute: "id" })

/**
 * @author Team Coconut
 * @since 2024-05-02
 * @version 1.0
 */
describe("Statistics Popup", () => {

	test("Clicking button should show popup", async () => {

		// Render the StatisticsPopup component
		render(<StatisticsPopUp />)

		// Simulate a click on the button
		fireEvent.click(screen.getByRole("button"))

		// Wait for the popup to appear
		await waitFor(() => {
			expect(screen.getByText("Statistik")).toBeInTheDocument()
		})

	})

})

describe("Statistics component", () => {

	test("renders group when data is fetched successfully", async () => {
		// Mock fetch API to return sample data
		// eslint-disable-next-line no-undef
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						{
							activity_id: 1,
							beltColors: [{
								belt_color: "0C7D2B",
								belt_name: "Grönt",
								is_child: false
							}],
							count: 6,
							name: "Sample Group",
							type: "technique",
						},
						{
							id: 1,
							name: "Sample Group",
							color: "0C7D2B",
							child: false
						}
					]),
			})
		)

		render(<BrowserRouter> <Statistics /> </BrowserRouter>)

		// Wait for group name to be rendered
		await screen.findAllByText("Sample Group")

		// Ensure "Sample Group" text is rendered
		expect(screen.getAllByText("Sample Group")[0]).toBeInTheDocument()

		// Assert if list of techniques is displayed 
		expect(screen.getByTestId("technique-exercise-list")).toBeInTheDocument()

	})

	test("displays error message when data fetching fails", async () => {
		// Suppress console error since test is supposed to generate one
		jest.spyOn(console, "error").mockImplementation(() => {})

		// Mock fetch API to simulate failure
		// eslint-disable-next-line no-undef
		global.fetch = jest.fn(() => Promise.reject(new Error("Failed to fetch")))

		render(<BrowserRouter> <Statistics/> </BrowserRouter>)

		// Wait for error message to be rendered
		await screen.findByText("Gruppen hittades inte")

		// Ensure error message is displayed
		expect(screen.getByText("Gruppen hittades inte")).toBeInTheDocument()
	})

	// Restore the original console error implementation after each test
	afterEach(() => {
		jest.restoreAllMocks()
	})

})

describe("FilterStatistics component", () => {

	test('FilterStatistics renders correctly within Statistics component', async () => {

		const fromDate = new Date("2022-05-08")
		const toDate = new Date("2024-05-08")
		const mockDates = [fromDate, toDate]		
		
		const mockGroupActivities = [{
			activity_id: 1,
			beltColors: [{
				belt_color: "0C7D2B",
				belt_name: "Grönt",
				is_child: false
			}],
			count: 6,
			name: "Sample Group",
			type: "technique",
		}]
		 
		const mockActivities = [{
			id: 1,
			name: "Sample Group",
			color: "0C7D2B",
			child: false
		}]

		const mockTechniques = [
			{
				id: 1,
				name: "Kebabkast, Henkes och grills (1 Kyu)",
				description: "Slöseri med mat",
				belts: [{
					id: 1,
					name: "Grönt",
					color: "0C7D2B",
					child: false
				}],
				tags: [{
					id: 1,
					name: "throws"
				}, {
					id: 2,
					name: "matkrig"
				}, {
					id: 3,
					name: "vuxenaktivitet"
				}]
			}, {
				id: 2,
				name: "Kurragömma (2 Kyu)",
				description: "Stealth technique",
				belts: [{
					id: 1,
					name: "Brunt",
					color: "83530C",
					child: false
				}],
				tags: [{
					id: 4,
					name: "tyst"
				}, {
					id: 3,
					name: "vuxenaktivitet"
				}]
			}]

			// global.fetch = jest.fn(() =>
			// 	Promise.resolve({
			// 		ok: true,
			// 		json: () =>
			// 			Promise.resolve([
			// 				mockGroupActivities,
			// 				mockActivities,
			// 				// mockTechniques
			// 			]),
			// 	})
			// )

			global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						{
							activity_id: 1,
							beltColors: [{
								belt_color: "0C7D2B",
								belt_name: "Grönt",
								is_child: false
							}],
							count: 6,
							name: "Sample Group",
							type: "technique",
						},
						{
							id: 1,
							name: "Sample Group",
							color: "0C7D2B",
							child: false
						}
					]),
			})
		)
	  
		render(	<BrowserRouter>	<Statistics	/> </BrowserRouter> )

		await screen.findAllByText("Sample Group")
		
		fireEvent.click(screen.getByTestId("filter-button"))

		expect(screen.getByTestId("statistics-filter-container")).toBeInTheDocument()
	  })

})
	




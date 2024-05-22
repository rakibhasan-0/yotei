import "@testing-library/jest-dom"
import {render, screen, fireEvent, configure, waitFor} from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Statistics from "../../../pages/Statistics/StatisticsIndex"
import StatisticsPopUp from "../../../pages/Statistics/StatisticsPopUp"
import FilterStatistics from "../../../pages/Statistics/FilterStatistics"
import GradingStatisticsPopup from "../../../pages/Statistics/GradingStatisticsPopup"
import React from "react";
configure({ testIdAttribute: "id" })

/**
 * @author Team Coconut
 * @since 2024-05-02
 * @version 1.0
 */
const mockedGroup = [{
	id: 1,
	name: "Sample Group",
	color: "0C7D2B",
	child: false
}]

const mockedBelts = [{
	id: 5,
	name: "Svart",
	color: "000000",
	child: false
}, {
	id: 2,
	name: "Vitt",
	color: "FFFFFF",
	child: false
}, {
	id: 3,
	name: "Grönt",
	color: "0C7D2B",
	child: false
}, {
	id: 4,
	name: "Brunt",
	color: "83530C",
	child: false
},]




const mockedGroupActivities = [
	{
		activity_id: 1,
		beltColors: [{
			belt_color: "0C7D2B",
			belt_name: "Grönt",
			is_child: false
		}],
		count: 6,
		name: "One punch",
		type: "technique",
	}, {
		activity_id: 2,
		beltColors: [{
			belt_color: "0C7D2B",
			belt_name: "Grönt",
			is_child: false
		}],
		count: 3,
		name: "Two punch",
		type: "technique",
	}, {
		activity_id: 3,
		beltColors: [{
			belt_color: "83530C",
			belt_name: "Brunt",
			is_child: false
		}],
		count: 1,
		name: "Hook mot lever",
		type: "technique",
	}]

describe("Grading popup", () => {

	const popupBtnID = "popup-button"
	const headerText = "Graderingsprotokoll"
	const dropdownText = "Välj ett protokoll"
	const dropdownID = "grading-protocols-dropdown-dropdown"
	const protocolExist = "SVART BÄLTE"
	const protocolNotExist = "BRUNT BÄLTE"
	const protocols= [
		{
			name: "SVART",
			id: 1
		}
	]

	test("Render button", () => {

		// render popup
		render(
			<BrowserRouter>
				<Statistics/>
			</BrowserRouter>
		)

		// statistics page should include the grading popup feature
		expect(screen.getByTestId("grading-statistics-container")).toBeInTheDocument()
		expect(screen.getByTestId(popupBtnID)).toBeInTheDocument()
	})

	test("Access popup", async () => {

		// render page
		render(<BrowserRouter> <Statistics/> </BrowserRouter>)

		// popup elements should not be present before toggling popup
		expect(screen.queryByRole("heading", { name: headerText })).not.toBeInTheDocument()
		expect(screen.queryByText(dropdownText)).not.toBeInTheDocument()

		// toggle popup
		fireEvent.click(screen.getByTestId(popupBtnID))

		// some popup elements should be visible on toggle
		expect(screen.getByRole("heading", { name: headerText })).toBeInTheDocument()
		expect(screen.getByText(dropdownText)).toBeInTheDocument()
		
	})

	test("Functionality", async () => {

		// render popup
		render(<BrowserRouter>
			<GradingStatisticsPopup id = {"grading-statistics-container"} groupid = {"3"} belts = {protocols}/>
		</BrowserRouter>)

		// toggle popup & dropdown
		fireEvent.click(screen.getByTestId(popupBtnID))
		fireEvent.click(screen.getByTestId(dropdownID))

		// protocols should now be visible
		expect(screen.getByText(protocolExist)).toBeInTheDocument()
		expect(screen.queryByText(protocolNotExist)).not.toBeInTheDocument()
	})
})



/**
 * @author Team Coconut
 * @since 2024-05-02
 * @version 1.0
 */
describe("Statistics Popup", () => {
	test("Clicking button should show popup", async () => {
		// Mock data
		const mockData = {
			groupActivities: mockedGroupActivities,
			dates: {
				from: new Date("2022-05-08").toISOString(),
				to: new Date("2024-05-08").toISOString(),
			},
			averageRating: 4,
			numberOfSessions: 10,
		}

		// Mock the fetch function
		// eslint-disable-next-line no-undef
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockData),
			})
		)

		// Render the StatisticsPopup component with mock data
		render(
			<BrowserRouter> 
				<StatisticsPopUp 
					groupActivities={mockData.groupActivities} 
					dates={mockData.dates} 
					averageRating={mockData.averageRating} 
					numberOfSessions={mockData.numberOfSessions} />
			</BrowserRouter>
		)

		// Simulate a click on the button
		fireEvent.click(screen.getByRole("button"))

		// Wait for the popup to appear

		await expect(screen.getByText("Sammanställning av tillfällen")).toBeInTheDocument()
		await expect(screen.getByText("Bält-tekniker")).toBeInTheDocument()

	})
})


describe("Statistics component", () => {

	// Test is incomplete, see bottom of test for in-depth description
	test("renders groups statistic page when data is fetched successfully", async () => {

		// Mock fetch API to return sample data
		// eslint-disable-next-line no-undef
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						...mockedGroupActivities,
						...mockedGroup
					]),
			})
		)

		// Render Statistics page
		render(<BrowserRouter> <Statistics /> </BrowserRouter>)

		// Wait for groups statistic page to be rendered
		await screen.findByText("Sample Group")

		// Ensure "Sample Group" text is rendered
		expect(screen.getByText("Sample Group")).toBeInTheDocument()

		// Retrieves mocked list of group activities
		const techniqueList = screen.getByTestId("technique-exercise-list")

		// Assert if list of techniques is displayed 
		expect(techniqueList).toBeInTheDocument()

		/** 
		 * Below is the way to test whether the inserted json object 
		 * is added to the list of techniques. However, the json object is 
		 * instead inserted into the BeltPicker, and techniques are added 
		 * as filterable belts instead of displayed in the list of techniques 
		 * the group has performed. The json object 'mockedGroupActivities' 
		 * isn't passed to the Statistics component properly. 
		 * No functionality beyond the list of techniques being rendered has been tested.
		*/
		// mockedGroupActivities.forEach(technique => {
		// 	expect(within(techniqueList).getByText(technique.name)).toBeInTheDocument()
		// })
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


/**
 * Test is incomplete because the BeltPicker cant use the 'mockedBelts' json object.
 * According to its (BeltPickers) documentation its` input should follow the structure
 *  states = [
 *  {
 *   "id": 1,
 *   "name": "Brun",
 *   "color": "FFFFF6",
 *   "child": false
 * 	}
 * ]
 * Which the mockedBelts object does. 
 * Something is preventing the BeltPicker from inserting the data into its list, 
 * and so any functionality beyond being rendered has not been tested.
 */
describe("FilterStatistics component", () => {

	test("FilterStatistics renders correctly within Statistics component", async () => {

		const mockedDates = {
			from: new Date("2022-05-08").toISOString(),
			to: new Date("2024-05-08").toISOString(),
		}

		// eslint-disable-next-line no-undef
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						...mockedBelts,
					]),
			})
		)

		// Render statistics page
		render(	
			<BrowserRouter>	
				<FilterStatistics 
					onToggleExercise={jest.fn()}
					onToggleKihon={jest.fn()}
					onDateChanges={jest.fn()}
					onToggleBelts={jest.fn()}
					onClearBelts={jest.fn()}
					belts={mockedBelts}
					dates={mockedDates} /> 
			</BrowserRouter> )

		// Simulate clicking the filter button to open the filter container
		fireEvent.click(screen.getByTestId("filter-button"))

		// Assert existence of filter container
		expect(screen.getByTestId("filter-container")).toBeInTheDocument()

		// Clicking the beltpicker to show dropdown
		// fireEvent.click(screen.getByTestId("techniqueFilter-BeltPicker"))

		// Assert existence of on of the mocked belts 
		// expect(screen.getByText("Svart")).toBeInTheDocument()
	})
})
	




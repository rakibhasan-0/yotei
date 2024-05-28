import "@testing-library/jest-dom"
import { render, screen, fireEvent, configure, waitFor, act } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Statistics from "../../../pages/Statistics/StatisticsIndex"
import StatisticsPopUp from "../../../pages/Statistics/StatisticsPopUp"
import FilterStatistics from "../../../pages/Statistics/FilterStatistics"
import GradingStatisticsPopup from "../../../pages/Statistics/GradingStatisticsPopup"
import React from "react"
import { server } from "../../server.js"
import { rest } from "msw"
import BeltPicker from "../../../components/Common/BeltPicker/BeltPicker.jsx"
import SortingArrowButton from "../../../components/Common/SortingArrowButton/SortingArrowButton.jsx"
configure({ testIdAttribute: "id" })

/**
 * @author Team Coconut
 * @since 2024-05-02
 * @version 1.0
 */

describe("Statistics Component", () => {

	// Shared data //

	const mockedGroup = [{
		id: 1,
		name: "Sample Group",
		color: "0C7D2B",
		child: false
	}]

	const testBelt = "Svart"

	const mockedBelts = [{
		id: 5,
		name: testBelt,
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
		name: testBelt,
		color: "000000",
		child: true
	},]

	const mockedGroupActivities = [{
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

	const mockedDates = {
		from: new Date("2022-05-08").toISOString(),
		to: new Date("2024-05-08").toISOString(),
	}

	// Tests //

	describe("Grading popup", () => {

		const popupBtnID = "popup-button"
		const headerText = "Graderingsprotokoll"
		const dropdownText = "Välj ett protokoll"
		const dropdownID = "grading-protocols-dropdown-dropdown"
		const protocolExist = "BLÅTT BÄLTE"
		const protocolNotExist = "Inga graderingsprotokoll tillgängliga"
		const belts= [
			{
				child: false,
				color: "0C7D2B",
				id: 9,
				inverted: false,
				name: "Grönt"
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
				<GradingStatisticsPopup id = {"grading-statistics-container"} groupid = {"1"} belts = {belts}/>
			</BrowserRouter>)

			// toggle popup & dropdown
			fireEvent.click(screen.getByTestId(popupBtnID))
			fireEvent.click(screen.getByTestId(dropdownID))


			const requestSpy = jest.fn()
			server.events.on("request:start", requestSpy)

			server.use(
				rest.get("http://localhost/api/statistics/next_belt?beltId=9", async (req, res, ctx) => {
					return res(ctx.status(200), ctx.json(
						[
							{
								id: 12,
								name: "Blått",
								color: "1E9CE3",
								child: false,
								inverted: false
							}
						]
					))
				})
			)

		
			// protocols should now be visible
			expect(screen.findByText(protocolNotExist)).not.toBeInTheDocument()
			expect(screen.getByText(protocolExist)).toBeInTheDocument()
			
		})

	})


	describe("Statistics Popup", () => {

		test("Clicking button should show popup", async () => {
			const mockData = {
				groupActivities: mockedGroupActivities,
				dates: mockedDates,
				averageRating: 4,
				numberOfSessions: 10,
			}

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


	describe("Technique & exercise list", () => {
		// Test is incomplete, see bottom of test for in-depth description
		test("renders groups statistic page when data is fetched successfully", async () => {
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

		describe("SortingArrowButton", () => {

			const mockChangeOrder = jest.fn()
			const sortBtnId = "sorting-button"

			test("calls the changeOrder function on button click", () => {

				// render button
				const { getByTestId } = render(<SortingArrowButton id={sortBtnId} changeOrder={mockChangeOrder} rotate={false} />)

				// click button
				fireEvent.click(getByTestId(sortBtnId))

				// Verify changeOrder was called
				expect(mockChangeOrder).toHaveBeenCalled()
			})
		})

		// Restore the original console error implementation after each test
		afterEach(() => {
			jest.restoreAllMocks()
		})

	})


	describe("Statistics Filter", () => {

		const togExercise = jest.fn()
		const togKihon = jest.fn()
		const togDateChange = jest.fn()
		const togBeltSelect = jest.fn()
		const togBeltClear = jest.fn()

		test("User interaction - filtering", () => {
			// eslint-disable-next-line no-undef
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve([
							...mockedBelts,
							...mockedDates
						]),
				})
			)

			// render component & mock toggles
			const {getByTestId} =
				render(<BrowserRouter>
					<FilterStatistics
						onToggleExercise={togExercise}
						onToggleKihon={togKihon}
						onDateChanges={togDateChange}
						onToggleBelts={togBeltSelect}
						onClearBelts={togBeltClear}
						belts={mockedBelts}
						dates={mockedDates}/>
				</BrowserRouter>)

			// simulate user interaction with checkboxes and date picker
			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				fireEvent.click(getByTestId("techniqueFilter-VisaÖvningar"))
				fireEvent.click(getByTestId("techniqueFilter-KihonCheck"))
				fireEvent.change(getByTestId("start-date-picker"), {target: {value: "2023-01-01"}})
				fireEvent.change(getByTestId("end-date-picker"), {target: {value: "2024-01-01"}})
			})
			// make sure it's been called right with the correct values
			expect(togExercise).toHaveBeenCalledWith(true)
			expect(togKihon).toHaveBeenCalledWith(true)
			expect(togDateChange).toHaveBeenCalledWith("from", "2023-01-01")
			expect(togDateChange).toHaveBeenCalledWith("to", "2024-01-01")

		})

		// TODO: test currently only works if launched by itself (isolated)
		// eslint-disable-next-line jest/no-disabled-tests
		test.skip("User interaction - select belts]", async () => {

			const requestSpy = jest.fn()
			server.events.on("request:start", requestSpy)

			server.use(
				rest.get("http://localhost/api/belts", async (req, res, ctx) => {
					return res(ctx.status(200), ctx.json(
						[{
							id: 5,
							name: "Svart",
							color: "000000",
							child: false
						}, {
							id: 2,
							name: "Svart",
							color: "000000",
							child: true
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
						}]
					))
				})
			)

			// render component & mock belt toggle
			render(<BeltPicker id={"bp"} onToggle={togBeltSelect}/>)

			await waitFor(() => {
				expect(requestSpy).toHaveBeenCalled()
			})

			// make sure belts been rendered successfully
			expect(screen.getByTestId(`belt-adult-${testBelt}`)).toBeInTheDocument()
			expect(screen.getByTestId(`belt-child-${testBelt}`)).toBeInTheDocument()
			expect(screen.getByTestId("belt-adult-Grönt")).toBeInTheDocument()
			expect(screen.getByTestId("belt-adult-Brunt")).toBeInTheDocument()

			/* Simulate user interaction toggling belts ON/OFF
			 * And check it's been called in the correct sequence using expect()
			 * */

			fireEvent.click(screen.getByTestId(`belt-adult-${testBelt}`))	// toggle adult ON
			expect(togBeltSelect).toHaveBeenCalledWith(true, {
				"child": false,
				"color": "000000",
				"id": 5,
				"name": `${testBelt}`
			})

			fireEvent.click(screen.getByTestId(`belt-child-${testBelt}`))	// toggle child ON
			fireEvent.click(screen.getByTestId(`belt-adult-${testBelt}`))	// toggle adult OFF

			expect(togBeltSelect).toHaveBeenCalledWith(true, {
				"child": true,
				"color": "000000",
				"id": 2,
				"name": `${testBelt}`
			})
			expect(togBeltSelect).toHaveBeenCalledWith(false, {
				"child": false,
				"color": "000000",
				"id": 5,
				"name": `${testBelt}`
			})

			fireEvent.click(screen.getByTestId(`belt-child-${testBelt}`))	// toggle child OFF
			expect(togBeltSelect).toHaveBeenCalledWith(false, {
				"child": true,
				"color": "000000",
				"id": 2,
				"name": `${testBelt}`
			})

		})

	})
})

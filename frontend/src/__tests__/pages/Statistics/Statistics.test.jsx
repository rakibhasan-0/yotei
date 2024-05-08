import "@testing-library/jest-dom"
import {render, screen, fireEvent, configure, waitFor, getByLabelText} from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Statistics from "../../../pages/Statistics/Statistics"
import StatisticsPopUp from "../../../pages/Statistics/StatisticsPopUp"
configure({ testIdAttribute: "id" })

const mockedGroup = [{
	id: 1,
	name: "Sample Group",
	color: "0C7D2B",
	child: false
}]

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
        await waitFor(() => {
            expect(screen.getByText("Sammanställning av tillfällen")).toBeInTheDocument()
        })
    })
})


describe("Statistics component", () => {

	test("renders groups statistic page when data is fetched successfully", async () => {
		// Mock fetch API to return sample data
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

		// Assert if mocked techniques are displayed in list
		mockedGroupActivities.forEach(technique => {
			expect(screen.getByText(technique.name)).toBeInTheDocument();
		});

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

	test("FilterStatistics renders correctly within Statistics component", async () => {

		// eslint-disable-next-line no-undef
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						...mockedGroupActivities,
						...mockedGroup,
					]),
			})
		)

		// Render statistics page
		render(	<BrowserRouter>	<Statistics	/> </BrowserRouter> )

		// Wait for rendering
		await screen.findAllByText("Sample Group")

		// Simulate clicking the filter button to open the filter container
		fireEvent.click(screen.getByTestId("filter-button"))

		// Assert existence of filter container
		expect(screen.getByTestId("filter-container")).toBeInTheDocument()

		// Try to assert existence of input mock techniques
		const filterContainer = screen.getByTestId("filter-container")
		// const filteredTechniqueList = screen.getByTestId("technique-exercise-list")
		console.log(filterContainer.innerHTML)
	})
})
	




import { render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import SessionHeader from "../../../components/Plan/SessionHeader"

configure({testIdAttribute: "id"})


describe("SessionHeader", () => {

	test("CanaryTest", () => {
		expect(true).toEqual(true)
	})

	describe("When initialized", () => {

		test("should render component with given ID -> testSessionHeader", async() => {
			render(<SessionHeader id = "testSessionHeader"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveAttribute("id", "testSessionHeader-session-header")
		})

		test("should render component containing given title -> testTitle", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("testTitle")
		})

		test("should render component containing given day Mån -> Mån", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" day="Mån"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Mån")
		})

		test("should render component containing given day Tis -> Tis", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" day="Tis"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Tis")
		})

		
		test("should render component when given weekday Ons -> Ons", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Ons" date="01/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Ons")
		})

		
		test("should render component when given weekday Tors -> Tors", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Tors" date="01/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Tors")
		})
		
		
		test("should render component when given weekday Fre -> Fre", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Fre" date="01/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Fre")
		})

		
		test("should render component when given weekday Lör->Lör", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Lör" date="01/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Lör")
		})

		
		test("should render component when given weekday Sön -> Sön", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Sön" date="01/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Sön")
		})

		test("should render component containing given date 01/01", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Sön" date="01/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("01/01")
		})
		
		test("should render component containing given time 00:00", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Sön" date="01/01" time="00:00:00"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("00:00")
		})

		test("should render component containing given time 12:30", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Sön" date="01/01" time="12:30:00"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("12:30")
		})

		test("should render component containing given time 23:59", async() => {
			render(<SessionHeader id = "testSessionHeader" title={test} day="Sön" date="01/01" time="23:59:00"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("23:59")
		})
	})

	describe("When given invalid input", () => {

		test("should not render component with invalid ID -> undefined", async() => {
			const { container } = render(<SessionHeader/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Error loading component"))
		})

		test("should render component with title \"unamed\" if title is invalid", async() => {
			render(<SessionHeader id = "testSessionHeader" title={null}/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("unnamed")
		})

		test("should render component when given invalid day input but without day-title", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" day="invalid"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("invalid")
		})

		test("should render component when given invalid date input but without date-title 00/01", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" time="13:37:00" day="mon" date="00/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("00/01")
		})

		test("should render component when given invalid date input but without date-title 32/01", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" time="13:37:00" day="mon" date="32/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("32/01")
		})

		test("should render component when given invalid date input but without date-title 01/13", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" time="13:37:00" day="mon" date="01/13"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("01/13")
		})

		test("should render component when given invalid date input but without date-title 1/01", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" time="13:37:00" day="mon" date="1/01"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("1/01")
		})

		test("should render component when given invalid date input but without date-title 01/1", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" time="13:37:00" day="mon" date="01/1"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("01/1")
		})

		test("should render component when given invalid time input but without time-title 24:00", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" day="mon" date="01/1" time="24:00:00"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("24:00")
		})
		
		test("should render component when given invalid time input but without time-title 23:60", async() => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" day="mon" date="01/1" time="23:60:00"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).not.toHaveTextContent("24:00")
		})

		
	})
})
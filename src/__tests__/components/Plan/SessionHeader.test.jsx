import { render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import SessionHeader from "../../../components/Plan/SessionHeader"

configure({testIdAttribute: "id"})


describe("SessionHeader", () => {

	test("CanaryTest", () => {
		expect(true).toEqual(true)
	})

	describe("When initialized", () => {

		test("should render component with given ID -> testSessionHeader", () => {
			render(<SessionHeader id = "testSessionHeader"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveAttribute("id", "testSessionHeader-session-header")
		})

		test("should render component containing given title -> testTitle", () => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("testTitle")
		})

		test("should render component containing given day Monday -> Mon", () => {
			render(<SessionHeader id = "testSessionHeader" title="testTitle" day="Mon"/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("Mon")
		})
	})

	describe("When given invalid input", () => {

		test("should not render component with invalid ID -> undefined", () => {
			const { container } = render(<SessionHeader/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Error loading component"))
		})

		test("should render component with title \"unamed\" if title is invalid", () => {
			render(<SessionHeader id = "testSessionHeader" title={null}/>)
			expect(screen.getByTestId("testSessionHeader-session-header")).toHaveTextContent("unnamed")
		})
	})
})
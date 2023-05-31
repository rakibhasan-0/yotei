import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import { server } from "../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)
import Popup from "../../../components/Common/Popup/Popup"
import ExerciseCreate from "../../../pages/Exercise/ExerciseCreate"
configure({ testIdAttribute: "id" })

describe ("ExerciseCreate should render", () => {

	beforeEach(() => {
        render(//eslint-disable-line
			<Popup title={"Skapa övning"} isOpen={true}>
				<ExerciseCreate />
			</Popup>
		)
	})

	test("Title", () => {
		expect(screen.getByText("Skapa övning")).toBeInTheDocument()
	})

	test("Name input", () => {
		expect(screen.getByPlaceholderText("Namn")).toBeInTheDocument()
	})

	test("Description input", () => {
		expect(screen.getByPlaceholderText("Beskrivning")).toBeInTheDocument()
	})

	test("Fortsätt skapa övningar checkbox", () => {
		expect(screen.getByText("Fortsätt skapa övningar")).toBeInTheDocument()
	})

	test("Rensa fält checkbox", () => {
		expect(screen.getByText("Rensa fält")).toBeInTheDocument()
	})

	test("Input field of minutepicker", () => {
		expect(screen.getByTestId("minute-picker-minuteSelect")).toBeInTheDocument()
	})

	test("Back button", () => {
		expect(screen.getByTestId("EC-BackBtn")).toBeInTheDocument()
	})

	test("Add button", () => {
		expect(screen.getByTestId("EC-AddBtn")).toBeInTheDocument()
	})

})
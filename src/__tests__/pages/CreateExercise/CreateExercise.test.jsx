import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import { server } from "../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)
import ExerciseCreate from "../../../pages/Exercise/ExerciseCreate"
import { MemoryRouter } from "react-router"
configure({ testIdAttribute: "id" })

describe("ExerciseCreate should render", () => {

	beforeEach(() => {
		render(//eslint-disable-line
			<MemoryRouter>
				<ExerciseCreate />
			</MemoryRouter>
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
})
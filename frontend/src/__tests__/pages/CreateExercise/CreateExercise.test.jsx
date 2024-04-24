import { render, screen,  configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import { server } from "../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)
import ExerciseCreate from "../../../pages/Exercise/ExerciseCreate"
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router-dom"
configure({ testIdAttribute: "id" })


describe("CreateTechnique should render", () => {



	beforeEach(() => {
		const router = createMemoryRouter(
			createRoutesFromElements(
				<Route path="/*" element={<ExerciseCreate/>} />
			)
		)
		render(
			<RouterProvider router={router} />
		)
	})


	test("Title", () => {
		expect(screen.getAllByText("Skapa övning")[0]).toBeInTheDocument()
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
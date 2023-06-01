import React from "react"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import ExerciseEdit from "../../../pages/Exercise/ExerciseEdit"
import { MemoryRouter } from "react-router"
configure({ testIdAttribute: "id" })

describe("ExerciseEdit should render", () => {

	beforeEach(() => {
		render( //eslint-disable-line
			<MemoryRouter>
				<ExerciseEdit/>         
			</MemoryRouter>
		)
	})

	test("Input field of name", () => {
		expect(screen.getByTestId("exerciseNameInput")).toBeInTheDocument()
	})

	test("Input field of description", () => {
		expect(screen.getByTestId("exerciseDescriptionInput")).toBeInTheDocument()
	})

	test("Input field of minutepicker", () => {
		expect(screen.getByTestId("minute-picker-minuteSelect")).toBeInTheDocument()
	})


	//todo: kolla att tagkomponenten finns





})
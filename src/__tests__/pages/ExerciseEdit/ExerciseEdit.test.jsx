import React from "react"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import ExerciseEdit from "../../../pages/Exercise/ExerciseEdit"
configure({ testIdAttribute: "id" })

describe("ExerciseEdit should render", () => {

	beforeEach(() => {
		render( //eslint-disable-line
			<ExerciseEdit/>          
		)
	})

	test("Input field of name", () => {
		expect(screen.getByTestId("exerciseNameInput")).toBeInTheDocument()
	})

	test("Input field of description", () => {
		expect(screen.getByTestId("exerciseDescriptionInput")).toBeInTheDocument()
	})

	test("Time divider", () => {
		expect(screen.getByTestId("timeSelectorTitle")).toBeInTheDocument()
	})

	test("Input field of minutepicker", () => {
		expect(screen.getByTestId("minute-picker-minuteSelect")).toBeInTheDocument()
	})

	test("Back button", () => {
		expect(screen.getByTestId("backBtn")).toBeInTheDocument()
	})

	test("Add button", () => {
		expect(screen.getByTestId("addBtn")).toBeInTheDocument()
	})

	//todo: kolla att tagkomponenten finns





})
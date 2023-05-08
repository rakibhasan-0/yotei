import React from "react"
import {render, screen, fireEvent, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import ActivityCategories from "../../../../../components/Workout/CreateWorkout/ActivityCategories"

configure({testIdAttribute: "id"})

describe("ActivityCategories component", () => {
	test("should render a list of categories and an input field", () => {
		const categories = [
			{ name: "Category 1", marked: false },
			{ name: "Category 2", marked: true },
			{ name: "Category 3", marked: false }
		]
		const setCategories = jest.fn()
		render(<ActivityCategories categories={categories} setCategories={setCategories} />)
		expect(screen.getByRole("list")).toBeInTheDocument()
		expect(screen.getAllByRole("listitem")).toHaveLength(4) // 3 categories + 1 input field
		expect(screen.getByPlaceholderText("+ Lägg till ny")).toBeInTheDocument()
	})

	test("should add a new category when the Enter key is pressed in the input field", () => {
		const categories = [
			{ name: "Category 1", marked: false },
			{ name: "Category 2", marked: true }
		]
		const setCategories = jest.fn()
		render(<ActivityCategories categories={categories} setCategories={setCategories} />)
		const input = screen.getByPlaceholderText("+ Lägg till ny")
		fireEvent.change(input, { target: { value: "New category" } })
		fireEvent.keyDown(input, { key: "Enter", keyCode: 13 })
		expect(setCategories).toHaveBeenCalledWith([
			{ name: "Category 1", marked: false },
			{ name: "Category 2", marked: false },
			{ name: "New category", marked: true }
		])
		expect(input).toHaveValue("")
	})

	test("should not add a new category if the input value is empty or already exists", () => {
		const categories = [
			{ name: "Category 1", marked: false },
			{ name: "Category 2", marked: true }
		]
		const setCategories = jest.fn()
		render(<ActivityCategories categories={categories} setCategories={setCategories} />)
		const input = screen.getByPlaceholderText("+ Lägg till ny")
		fireEvent.change(input, { target: { value: "" } })
		fireEvent.keyDown(input, { key: "Enter", keyCode: 13 })
		expect(setCategories).not.toHaveBeenCalled()
		fireEvent.change(input, { target: { value: "Category 1" } })
		fireEvent.keyDown(input, { key: "Enter", keyCode: 13 })
		expect(setCategories).not.toHaveBeenCalled()
	})

	test("should toggle the \"marked\" property of a category when a RadioButton is clicked", () => {
		const categories = [
			{ name: "Category 1", marked: false },
			{ name: "Category 2", marked: true }
		]
		const setCategories = jest.fn()
		render(<ActivityCategories id={"10"} categories={categories} setCategories={setCategories} />)

		expect(screen.getByTestId("radio-0")).toBeInTheDocument()

		const radioButton = screen.getByTestId("radio-0")
		fireEvent.click(radioButton)
		expect(setCategories).toHaveBeenCalledWith([
			{ name: "Category 1", marked: true },
			{ name: "Category 2", marked: false }
		])
	})
})

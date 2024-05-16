import React from "react"
import { screen, render, waitFor } from "@testing-library/react"
import Sorter from "../../../../components/Common/Sorting/Sorter"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

describe("Sorter", () => {
	const setSort = jest.fn()

	afterEach(() => {
		jest.clearAllMocks()
	})

	test("renders without crashing", () => {
		const sortOptions = [
			{label: "option"}
		]
		//ARRANGE
		render(<Sorter id="foo" 
			onSortChange={setSort} 
			selected={sortOptions[0]} 
			options={sortOptions} />)
	})

	test("renders correct number of listitems", () => {
		//ARRANGE
		const sortOptions = [
			{label: "super secret option"},
			{label: "super secret option 2"}
		]
		render(<Sorter id="foo" 
			onSortChange={setSort} 
			selected={sortOptions[0]} 
			options={sortOptions} />)

		//ACT
		expect(screen.getAllByRole("listitem", {hidden: true})).toHaveLength(2)
	})

	test("renders correct option labels", () => {
		//ARRANGE
		const sortOptions = [
			{label: "option1"},
			{label: "option2"}
		]
		render(<Sorter id="foo" 
			onSortChange={setSort} 
			selected={sortOptions[0]} 
			options={sortOptions} />)

		//ACT
		const options = screen.getAllByRole("listitem", {hidden: true})

		//ASSERT
		expect(options[0]).toHaveTextContent(sortOptions[0].label)
		expect(options[1]).toHaveTextContent(sortOptions[1].label)
	})

	test("calls onChange callback when input value changes", async () => {
		//ARRANGE
		const sortOptions = [
			{label: "option1"},
			{label: "option2"}
		]
		render(<Sorter id="foo" 
			onSortChange={setSort} 
			selected={sortOptions[0]} 
			options={sortOptions} />)
		//ACT
		const user = userEvent.setup()
		const options = screen.getAllByRole("listitem", {hidden: true})
		user.click(options[1])

		//ASSERT
		await waitFor(() => {expect(setSort).toHaveBeenCalled()})
	})
})

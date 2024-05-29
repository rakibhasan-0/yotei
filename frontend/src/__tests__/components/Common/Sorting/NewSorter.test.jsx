import React from "react"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import NewSorter from "../../../../components/Common/Sorting/NewSorter"


describe("NewSorter", () => {
	const options = [
		{ label: "Option 1", value: "option1" },
		{ label: "Option 2", value: "option2" },
		{ label: "Option 3", value: "option3" },
	]

	test("renders the component with options when clicked and without if not clicked", () => {
		render(<NewSorter id="sorter" selected={false} onSortChange={() => {}} options={options} />)
 
		expect(screen.getByText("Sortera efter")).toBeInTheDocument()

		expect(screen.queryByText("Option 1")).not.toBeInTheDocument()
		expect(screen.queryByText("Option 2")).not.toBeInTheDocument()
		expect(screen.queryByText("Option 3")).not.toBeInTheDocument()

		fireEvent.click(screen.getByText("Sortera efter"))

		expect(screen.getByText("Sortera efter")).toBeInTheDocument()
		expect(screen.getByText("Option 1")).toBeInTheDocument()
		expect(screen.getByText("Option 2")).toBeInTheDocument()
		expect(screen.getByText("Option 3")).toBeInTheDocument()
	})


	test("calls the onSortChange callback when an option is clicked", () => {
		const onSortChange = jest.fn()
		render(<NewSorter id="sorter" selected={false} onSortChange={onSortChange} options={options} />)
    
		fireEvent.click(screen.getByText("Sortera efter"))
		fireEvent.click(screen.getByText("Option 2"))
    
		expect(onSortChange).toHaveBeenCalledWith({ label: "Option 2", value: "option2" })
	})
})
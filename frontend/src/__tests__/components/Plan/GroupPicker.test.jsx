import { render, screen, configure, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import GroupPicker from "../../../components/Plan/GroupPicker"

configure({testIdAttribute:"id"})

describe("GroupPicker.jsx", () => {

	describe("Load tests", () => {
    
		test("GroupPicker: Should render if presented with correct ID.", async() => {
			render(<GroupPicker id ={1}/>)
			expect(screen.getByTestId("1")).toHaveAttribute("id", "1")
		})
    
		test("GroupPicker: should place placeholder if component has no ID", async() => {
			const { container } = render(<GroupPicker/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("error-load-group-picker"))
		})

		test("drop down exists", async() => {
			const { container } = render(<GroupPicker id = {1}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("gp-drop-down1"))
		})
	})

	describe("Functionality test", () => {

		test("should show children", async() => {

			render(<GroupPicker id={42}/>)
		})

		test("should try fetch plans", async() => {
        
		})

		test("should display name of all fetched groups", async() => {
            
			const fakeGroup = [
				{
					"id": 1,
					"name": "Grönt bälte träning",
					"userId": 1,
					"belts": [
						{
							"id": 7,
							"name": "Grönt",
							"color": "00BE08",
							"child": false
						}
					]
				},
				{
					"id": 2,
					"name": "Gult bälte träning",
					"userId": 1,
					"belts": [
						{
							"id": 4,
							"name": "Gult",
							"color": "00BE08",
							"child": false
						}
					]
				}
			]
            
			const fetchMethod = jest.fn()
			fetchMethod.mockReturnValue(fakeGroup)

			render(<GroupPicker id = {42} testFetchMethod= {fetchMethod}/>)
			fireEvent.click(screen.getByTestId("42"))
			expect(screen.getByTestId("groupRow-id-1").textContent).toBe("Grönt bälte träning")
			expect(screen.getByTestId("groupRow-id-2").textContent).toBe("Gult bälte träning")
		})

	})


    
	test("GroupPicker: should accept 2 belt group", async() => {
		//test should check what happens if a gorup contaisn two belt colors.
        
	})
    
})


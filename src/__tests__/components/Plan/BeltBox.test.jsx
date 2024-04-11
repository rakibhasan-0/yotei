import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import BeltBox from "../../../components/Plan/BeltBox"
import React from "react"



configure({testIdAttribute:"id"})

describe("BeltBox.jsx", () => {
	describe("When initialized", () => {
		test("should render component that has given ID -> 1", async() => {

			var incomingBelts = [{
				"id": "1",
				"color": "#00BE08",
				"child": false
			}]

			render(<BeltBox id ={"1"} width={35} height={320} belts = {incomingBelts}/>)
			expect(screen.getByTestId("1")).toHaveAttribute("id", "1")
		})
	})

	describe("When given invalid input", () => {
		const originalError = console.error

		afterEach(() => (console.error = originalError))
		
	
		test("should display error-load-belt-box if given ID is null", async() => {
			var incomingBelts = [{
				"id": "1",
				"color": "00BE08",
				"child": false
			}]
			
			const { container } = render(<BeltBox width={35} height={320} belts={incomingBelts}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("error-load-belt-box"))
		})


		test("should display \"Error loading component \" if given ID is null", async() => {
			var incomingBelts = [{
				"id": "1",
				"color": "00BE08",
				"child": false
			}]
			
			const { container } = render(<BeltBox width={35} height={320} belts={incomingBelts}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Error loading component"))
		})


		test("should error if belt is null", () => {
			var incomingBelts = null
			
			const { container } = render(<BeltBox id = "testBeltBox" width={35} height={320} belts={incomingBelts}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Error loading component"))
		})

		test("should display belt name when belt color has too many characters", () => {
			var incomingBelts = [{
				"id": "1",
				"color": "00BE088888",
				"name": "grön",
				"child": false
			}]

			const { container } = render(<BeltBox id = "testBeltBox" width = {35} height = {320} belts={incomingBelts}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("grön"))
		})

		test("should display undefined when belt.color is missing and belt name is unavailable has too many characters", () => {
			var incomingBelts = [{
				"id": "1",
				"child": false
			}]

			const { container } = render(<BeltBox id = "testBeltBox" width = {35} height = {320} belts={incomingBelts}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("undefined"))
		})

		test("should display belt-error when belt child is invalid", () => {
			var incomingBelts = [{
				"id": "1",
				"color": "00BE08",
				"name": "grön",
			}]

			const { container } = render(<BeltBox id = "testBeltBox" width = {35} height = {320} belts={incomingBelts}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("belt-error-child"))
		})

		test.todo("should display error-belt when belt ID is null")

		test.todo("should display belt name when belt ID is null")

		test.todo("Should display X when height is negative")

		test.todo("Should display X when width is negative")

		test.todo("Should console.error on invaalid input")
	})
})

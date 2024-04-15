import React from "react"
import {render, screen, configure, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import TechniqueFilter from "../../../../components/Common/Filter/TechniqueFilter"

configure({testIdAttribute: "id"})

describe("TechniqueFilter", () => {

	const setBelts = jest.fn()
	const belts = []
	const kihon = false
	const setKihon = jest.fn()

	//User stories
	test("TechniqueFilter: The component should not crash upon rendering.", async() => {
		
		render(
			<div>
				<TechniqueFilter id="techniqueFilterTest" belts={belts} onBeltChange={setBelts} kihon={kihon} onKihonChange={setKihon}/>
			</div>
		)
	})

	//Test that button, beltpicker, and kihon checkbox exists
	test("TechniqueFilter: check that components exist", async() => {

		render(
			<div>
				<TechniqueFilter id="techniqueFilterTest" belts={belts} onBeltChange={setBelts} kihon={kihon} onKihonChange={setKihon}/>
			</div>
		)

		const button = screen.getByTestId("filter-button")
		const picker = screen.getByTestId("techniqueFilter-BeltPicker")
		const checkBox = screen.getByTestId("techniqueFilter-KihonCheck")

		expect(button).toBeInTheDocument()
		expect(picker).toBeInTheDocument()
		expect(checkBox).toBeInTheDocument()
	})

	//Som en användare vill jag kunna filtrera efter kihon.
	test("TechniqueFilter: Filter after kihon is called", async() => {
		render(
			<div>
				<TechniqueFilter id="techniqueFilterTest" belts={belts} onBeltChange={setBelts} kihon={kihon} onKihonChange={setKihon}/>
			</div>
		)
		const checkBox = screen.getByTestId("techniqueFilter-KihonCheck")

		fireEvent.click(checkBox)

		expect(setKihon).toHaveBeenCalled()

		
	})
})
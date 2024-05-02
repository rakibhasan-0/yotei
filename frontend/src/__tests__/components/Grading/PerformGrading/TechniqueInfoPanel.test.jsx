import React from "react"
import {cleanup, render, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import TechniqueInfoPanel from "../../../../components/Grading/PerformGrading/TechniqueInfoPanel.jsx"

afterEach(() => {
	cleanup()
})

describe("TechniqueInfoPanel", () => {
	test("Main Category Text rendering", () => {
		render(<TechniqueInfoPanel id={"mainCategoryTextRendering"} mainCategoryTitle={"Test Main Category Title"}/>)
		const text = screen.getByTestId("mainCategoryTextRendering")
		expect(text).toBeInTheDocument()
	})

	test("displays the correct category title", () => {
		render(<TechniqueInfoPanel id={"subCategoryTitle"} categoryTitle="Jigo Waza" />)
		const text = screen.getByTestId("subCategoryTitle")
		expect(text).toBeInTheDocument()
	})
    
	test("displays the correct current technique", () => {
		render(<TechniqueInfoPanel id={"currentTechniqueTitle"} currentTechniqueTitle="Current Technique"/>)
		const text = screen.getByTestId("currentTechniqueTitle")
		expect(text).toBeInTheDocument()
	})
    
	test("displays the correct next technique", () => {
		render(<TechniqueInfoPanel id={"nextTechniqueTitle"} nextTechniqueTitle="Next Technique"/>)
		const text = screen.getByTestId("nextTechniqueTitle")
		expect(text).toBeInTheDocument()
	})

	test("applies correct background color", () => {
		render(<TechniqueInfoPanel id={"correctColor"} beltColor="#FFDD33" />)
		const fieldset = screen.getByRole("test")
		expect(fieldset).toHaveStyle("background-color: #FFDD33")
	})
})
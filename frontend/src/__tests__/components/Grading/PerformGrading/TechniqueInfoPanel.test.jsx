import React from "react"
import {cleanup, render, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import TechniqueInfoPanel from "../../../../components/Grading/PerformGrading/TechniqueInfoPanel.jsx"
/**
 * @author Team Apelsin (Group 5)
 * @since 2024-05-02
 */
afterEach(() => {
	cleanup()
})

describe("TechniqueInfoPanel", () => {
	test("Main Category Text rendering", () => {
		render(<TechniqueInfoPanel id={"mainCategoryTextRendering"} mainCategoryTitle={"Test Main Category Title"}/>)
		const text = screen.getByRole("mainCategoryTitle")
		expect(text).toBeInTheDocument()
	})

	test("displays the correct category title", () => {
		render(<TechniqueInfoPanel id={"categoryTitle"} categoryTitle="Jigo Waza" />)
		const text = screen.getByRole("categoryTitle")
		expect(text).toBeInTheDocument()
	})
    
	test("displays the correct current technique", () => {
		render(<TechniqueInfoPanel id={"currentTechniqueTitle"} currentTechniqueTitle="Current Technique"/>)
		const text = screen.getByRole("currentTechniqueTitle")
		expect(text).toBeInTheDocument()
	})
    
	test("displays the correct next technique", () => {
		render(<TechniqueInfoPanel id={"nextTechniqueTitle"} nextTechniqueTitle="Next Technique"/>)
		const text = screen.getByRole("nextTechniqueTitle")
		expect(text).toBeInTheDocument()
	})

	test("applies correct background color", () => {
		render(<TechniqueInfoPanel id={"correctColor"} beltColor="#FFDD33" />)
		const fieldset = screen.getByRole("fieldsetBelt")
		expect(fieldset).toHaveStyle("background-color: #FFDD33")
	})
})
import React from "react"
import {cleanup, render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import TechniqueInfoPanel from "../../../../components/Grading/PerformGrading/TechniqueInfoPanel.jsx"
/**
 * @author Team Apelsin (Group 5)
 * @since 2024-05-02
 * @version 1.0
 */
afterEach(() => {
	cleanup()
})
configure({testIdAttribute: "id"})

describe("TechniqueInfoPanel", () => {

	test("displays the correct category title", () => {
		render(<TechniqueInfoPanel id={"categoryTitle"} categoryTitle="Jigo Waza" />)
		const text = screen.getByTestId("categoryTitle")
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
	/* Should be removed if not used color on 2024-06-10
	test("applies correct background color", () => {
		render(<TechniqueInfoPanel id={"correctColor"} beltColor="#FFDD33" />)
		const fieldset = screen.getByRole("fieldsetBelt")
		expect(fieldset).toHaveStyle("background-color: #FFDD33")
	})
	*/
})
// TechniqueNavigation.test.js
import React from "react"
import { screen, configure, render } from "@testing-library/react"
import TechniqueNavigation from "../../../components/Grading/TechniqueNavigation"
import "@testing-library/jest-dom"
/**
 * Tests for the TechniqueNavigation button that should be used during grading.
 * 
 * Unsure if the component is necessary, and most of the functionallity is tested in Popup component 
 * 
 * @author Apelsin
 * @since 2024-05-06
 * @version 1.0 
 */

configure({testIdAttribute: "id"})

describe("TechniqueNavigation component", () => {
	it("renders without crashing", () => {
		render(<TechniqueNavigation id="test-technique-navigation" />)
	})

	it("Popup should not be open", () => {
		// ARRANGE
		render(<TechniqueNavigation></TechniqueNavigation>)
    
		{/* Query for the ID that is set inside the TechniqueNavigation component on the Popup */}
		const popup = screen.queryByTestId("navigation-popup")
    
		// ASSERT
		expect(popup).not.toBeInTheDocument()
	})
  
	// Add more tests as needed for other functionalities
})
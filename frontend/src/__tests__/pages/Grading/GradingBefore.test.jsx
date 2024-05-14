//import React from "react"
import { render, configure, screen, } from "@testing-library/react"
import "@testing-library/jest-dom"
import GradingBefore from "../../../pages/Grading/GradingBefore"
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router-dom"
configure({ testIdAttribute: "id" })

/**
 * Unit-test for the GradingBefore page, 
 * init page is tested
 *
 * @author Team Pomegrade (Group 1)
 * @since 2024-04-18
 * @version 1.0 
 */

// Render the technique detail page with router and account context. Also waits for it to fully render.
const renderWithRouter = async() => {
	const gradingId = 1
	window.HTMLElement.prototype.scrollIntoView = jest.fn
	const router = createMemoryRouter(
		createRoutesFromElements( [
			<Route key={"key1"} path="grading/:gradingId/1" element={<GradingBefore />}/> ,
		]
		),
		{initialEntries: [`/grading/${gradingId}/1`]}
	)

	render (
		<RouterProvider router={router}/>
	)
}

describe("Expected HTML elements exsists", () => {

	test("Add examine component", async () => {
		renderWithRouter()
		expect(screen.getByTestId("add-examinee")).toBeInTheDocument()
	})

	test("Back button", async () => {
		renderWithRouter()
		expect(screen.getByTestId("back-button")).toBeInTheDocument()
	})

	test("Continue button", async () => {
		renderWithRouter()
		expect(screen.getByTestId("continue-button")).toBeInTheDocument()
	})

})
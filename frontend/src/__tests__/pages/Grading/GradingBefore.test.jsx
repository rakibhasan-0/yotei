//import React from "react"
import { render, configure, screen, } from "@testing-library/react"
import "@testing-library/jest-dom"
import GradingBefore from "../../../pages/Grading/GradingBefore"
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router-dom"
import { AccountContext } from "../../../context"
import { USER_PERMISSION_CODES, USER_PERMISSION_LIST_ALL } from "../../../utils"
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
const renderWithRouter = async(permissions_list) => {
	const gradingId = 1
	window.HTMLElement.prototype.scrollIntoView = jest.fn
	const router = createMemoryRouter(
		createRoutesFromElements( [
			<Route key={"key1"} path="grading/:gradingId/1" element={<GradingBefore />}/> ,
		]
		),
		{initialEntries: [`/grading/${gradingId}/1`]}
	)

	render ( //eslint-disable-next-line no-dupe-keys
		<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: "", permissions: permissions_list, undefined }}>
			<RouterProvider router={router}/>
		</AccountContext.Provider>
	)

	render (
		<RouterProvider router={router}/>
	)
}

describe("Expected HTML elements exsists", () => {

	test("Add examine component", async () => {
		renderWithRouter(USER_PERMISSION_LIST_ALL)
		expect(screen.getByTestId("add-examinee")).toBeInTheDocument()
	})

	test("Back button", async () => {
		renderWithRouter([USER_PERMISSION_CODES.GRADING_ALL])
		expect(screen.getByTestId("back-button")).toBeInTheDocument()
	})

	test("Continue button", async () => {
		renderWithRouter(USER_PERMISSION_LIST_ALL)
		expect(screen.getByTestId("continue-button")).toBeInTheDocument()
	})

})
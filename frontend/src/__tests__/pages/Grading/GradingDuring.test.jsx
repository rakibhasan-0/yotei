//import React from "react"
import { render, configure, screen, } from "@testing-library/react"
import "@testing-library/jest-dom"
import DuringGrading from "../../../pages/Grading/During/DuringGrading"
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router-dom"
import { AccountContext } from "../../../context"
import { USER_PERMISSION_CODES, USER_PERMISSION_LIST_ALL } from "../../../utils"
configure({ testIdAttribute: "id" })

/**
 * Unit-test for the GradingBefore page, 
 * init page is tested
 *
 * @author Team Orange (Group 5, c19jen, ens21ljn)
 * @since 2024-05-28
 * @version 1.0 
 */
const renderWithRouter = async(permissions_list) => {
	const gradingId = 1
	window.HTMLElement.prototype.scrollIntoView = jest.fn
	const router = createMemoryRouter(
		createRoutesFromElements( [
			<Route key={"key1"} path="grading/:gradingId/2" element={<DuringGrading />}/> ,
		]
		),
		{initialEntries: [`/grading/${gradingId}/2`]}
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

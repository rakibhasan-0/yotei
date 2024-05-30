/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure, } from "@testing-library/react"
import { AccountContext } from "../../../../context"
import "@testing-library/jest-dom"
import { Route, createMemoryRouter, createRoutesFromElements, RouterProvider } from "react-router"

import { USER_PERMISSION_CODES, USER_PERMISSION_LIST_ALL } from "../../../../utils"
import WorkoutIndex from "../../../../pages/Workout/WorkoutIndex"

/**
 * Tests for the workout edit page. This was created specifically to test permissions, but should probably have more tests written.
 * 
 * @author Team Mango (Group 4)
 * @version 1.0
 * @since 2024-05-29
 * Updates: 2024-05-29: Added permission unit tests. (Team Mango)
 * 
 */

configure({testIdAttribute: "id"}) //This seems important for testing with IDs.

describe("verify that", () => {
    
	// Render the WorkoutIndex page with router and account context.
	const renderWithRouter = async(permissions_list) => {
		window.HTMLElement.prototype.scrollIntoView = jest.fn
		const router = createMemoryRouter(
			createRoutesFromElements( [
				<Route key={"key1"} path="workout" element={<WorkoutIndex/>}/> , //The path is found in index.js.
			]
			),
			{initialEntries: ["/workout"]}
		)

		render ( //eslint-disable-next-line no-dupe-keys
			<AccountContext.Provider value={{ undefined, userId: "", permissions: permissions_list, undefined }}>
				<RouterProvider router={router}/>
			</AccountContext.Provider>
		)
        
	}

	//PERMISSION TESTS

	test("Admin should see create button", async () => {
		await renderWithRouter(USER_PERMISSION_LIST_ALL)

		expect(screen.getByTestId("CreateWorkoutButton")).toBeInTheDocument()
	})

	test("someone with `edit all workouts` rights should see create button", async () => {
		await renderWithRouter([USER_PERMISSION_CODES.WORKOUT_ALL])

		expect(screen.getByTestId("CreateWorkoutButton")).toBeInTheDocument()
	})

	test("someone with `edit own workouts` rights should see create button", async () => {
		await renderWithRouter([USER_PERMISSION_CODES.WORKOUT_OWN])

		expect(screen.getByTestId("CreateWorkoutButton")).toBeInTheDocument()
	})

	test("someone without edit rights should not see create button", async () => {
		await renderWithRouter([])

		expect(screen.queryByTestId("CreateWorkoutButton")).not.toBeInTheDocument()
	})

	//END PERMISSION TESTS

    

})

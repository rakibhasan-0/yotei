import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import SessionWorkout from  "../../../components/Plan/SessionWorkout"
import { BrowserRouter } from "react-router-dom"
import React from "react"
import { AccountContext } from "../../../context"
import { USER_PERMISSION_LIST_ALL } from "../../../utils"

/**
 * Tests for SessionWorkout.test.jsx
 * 
 * @author UNKNOWN, Team Mango
 * @version 1.0
 * @updated 2024-05-20
 * Updates. 2024-05-20: Added permissions to user to fix a test by giving it all permissions.
 */


configure({testIdAttribute: "id"})


describe("SessionWorkout", () => {
	describe("When initialized", () => {
		var testID = "testSessionWorkout"
		var workout = {"id":2,"name":"Judo Randori","desc":"In this Judo workout, you will participate in randori.","duration":76,"created":"2023-04-30","changed":"2023-05-02","date":"2023-05-01T00:00:00.000+00:00","hidden":false,"author":1}

		test("should render component with valid ID -> testSessionWorkout", async() => {
			render(<BrowserRouter><SessionWorkout id={testID}/></BrowserRouter>)
			expect(screen.getByTestId(testID)).toHaveAttribute("id", testID)
		})

		test("should render component displaying given workout title -> Judo Randori", async() => {
			render(<BrowserRouter><SessionWorkout id = {testID} workout = {workout}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionWorkout")).toHaveTextContent(workout.name)
		})

		test("should render component displaying given workout description -> In this Judo workout, you will participate in randori", async() => {
			render(<BrowserRouter><SessionWorkout id = {testID} workoutConnected={true} workout = {workout}/></BrowserRouter>)
			expect(screen.getByTestId("testSessionWorkout")).toHaveTextContent(workout.desc)
		})

		test("should render component displaying placeholder text if workoutConnected is false", () => {
			render(<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: 1, permissions: USER_PERMISSION_LIST_ALL}}>
				<BrowserRouter>
					<SessionWorkout id={testID}/>
				</BrowserRouter>
			</AccountContext.Provider>)
			expect(screen.getByTestId(testID)).toHaveTextContent("Du kan trycka på pennan för att lägga till ett.")
		})

		test("should render workout-button if workoutConnected is true", async() => {
			render(<BrowserRouter><SessionWorkout id = {testID} workout={workout}/></BrowserRouter>)
			expect(screen.getByRole("details")).toBeInTheDocument()
		})

		test("should render workout-button if workoutConnected is false", async() => {
			render(<BrowserRouter><SessionWorkout id={testID}/></BrowserRouter>)
			expect(screen.queryByRole("details")).not.toBeInTheDocument()
		})

	})

	describe("When given invalid input", ()=> {
		var testID = "testSessionWorkout"
		var workout = {"id":2,"name":null,"desc":null,"duration":76,"created":"2023-04-30","changed":"2023-05-02","date":"2023-05-01T00:00:00.000+00:00","hidden":false,"author":1}
		test("should render placeholder component if ID is invalid", async() => {
			render(<BrowserRouter><SessionWorkout/></BrowserRouter>)
			expect(screen.getByTestId("SessionWorkoutError")).toHaveTextContent("Kunde inte ladda in passet")
		})

		test("should render component with placeholder title if no title is given", async() => {
			render(<BrowserRouter><SessionWorkout id={testID} workout={workout}/></BrowserRouter>)
			expect(screen.getByTestId(testID)).toHaveTextContent("Ingen titel")
		})

		test("should render component with placeholder title if no desc is given", async() => {
			render(<BrowserRouter><SessionWorkout id={testID} workout={workout}/></BrowserRouter>)
			expect(screen.getByTestId(testID)).toHaveTextContent("Passet saknar beskrivning")
		})
	})
})
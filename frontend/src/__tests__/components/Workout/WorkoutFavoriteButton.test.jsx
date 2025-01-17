/** @jest-environment jsdom */
// React/Jest imports
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

// Required for MSW mocking of API responses.
import { rest } from "msw"
import { server } from "../../server"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

import WorkoutFavoriteButton from "../../../components/Workout/WorkoutFavoriteButton"



configure({testIdAttribute: "id"})

test("Should have correct id in DOM", async() => {
	// ARRANGE
	let id = "testy"
	const workout = {
		workoutID: 0,
		favourite: true,
		name: "test"
	}
	render(<WorkoutFavoriteButton id={id} workout={workout}/>)

	// ACT
	const elem = screen.getByTestId(id)

	// ASSERT
	expect(elem).toBeTruthy()
	expect(elem.id).toEqual(id)
})

//test.todo("Should send DELETE if deselected")
test("Should send DELETE when deselected", async() => {
	// ARRANGE
	var method = ""
	server.use(
		rest.all("http://localhost/api/workouts/favorites", async (req, res, ctx) => {
			method = req.method
			return res(ctx.status(200))
		})
	)
	const workout = {
		workoutID: 0,
		favourite: true,
		name: "test"
	}
	const user = userEvent.setup()
	render(<WorkoutFavoriteButton id="test" workout={workout}/>)

	// ACT
	await user.click(screen.getByTestId("test"))

	// ASSERT
	expect(requestSpy).toHaveBeenCalled()
	expect(method).toBe("DELETE")
})

test("Should send POST when selected", async() => {
	// ARRANGE
	var method = ""
	server.use(
		rest.all("http://localhost/api/workouts/favorites", async (req, res, ctx) => {
			method = req.method
			return res(ctx.status(200))
		})
	)
	const workout = {
		workoutID: 0,
		favourite: false,
		name: "test"
	}
	const user = userEvent.setup()
	render(<WorkoutFavoriteButton id="test" workout={workout}/>)

	// ACT
	await user.click(screen.getByTestId("test"))

	// ASSERT
	expect(requestSpy).toHaveBeenCalled()
	expect(method).toBe("POST")
})


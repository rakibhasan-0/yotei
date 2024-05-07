import "@testing-library/jest-dom"
import React from "react"
import { render, screen, configure} from "@testing-library/react"
import Review from "../../../components/Plan/SessionReview/SessionReviewComponent"
import { BrowserRouter } from "react-router-dom"

configure({testIdAttribute: "id"})

describe("Initialization tests", () => {

	var componentId = "testComponent"
	var sessionId = 25
	var workoutId = 52

	test("Should render with correct id", async() => {
		render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={workoutId}/></BrowserRouter>)	
		expect(screen.getByTestId(componentId)).toHaveAttribute("id", componentId)
	})

	test("Should have save button", async() => {
		render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={workoutId}/></BrowserRouter>)
		expect(screen.getByTestId("saveButton")).not.toBeNull()
	})

	test("Should have last date saved display", async() => {
		render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={workoutId}/></BrowserRouter>)
		expect(screen.getByTestId("savedDateDisplay")).not.toBeNull()
	})

	test("Should have positive comment field", async() => {
		render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={workoutId}/></BrowserRouter>)
		expect(screen.getByTestId("positiveComment")).not.toBeNull()
	})

	test("Should have negative comment field", async() => {
		render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={workoutId}/></BrowserRouter>)
		expect(screen.getByTestId("negativeComment")).not.toBeNull()
	})

	/*test("Should throw error when negative workoutID", async() => {
        expect(() => {
            act(() => {
                render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={-1} shouldLoad={true}/></BrowserRouter>)
            })
        })
        .toThrow()
    })

    test("Should throw error when negative sessionID", async() => {
        expect(() => {
            act(() => {
                render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={-1} workout_id={workoutId} shouldLoad={true}/></BrowserRouter>)
            })
        })
        .toThrow()
    })*/
})


describe("Interaction tests", () => {



})
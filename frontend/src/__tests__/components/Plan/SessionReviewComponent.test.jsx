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

    test("Should render with correct session id", async() => {
        render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={workoutId} shouldLoad={false}/></BrowserRouter>)
        expect(screen.getByTestId(componentId)).toHaveAttribute("session_id", sessionId)
    })

    test("Should render with correct workout id", async() => {
        render(<BrowserRouter><Review id={componentId} isOpen={true} setIsOpen={true} session_id={sessionId} workout_id={workoutId} shouldLoad={false}/></BrowserRouter>)
        expect(screen.getByTestId(componentId)).toHaveAttribute("workout_id", workoutId)
    })

})


describe("Interaction tests", () => {



})
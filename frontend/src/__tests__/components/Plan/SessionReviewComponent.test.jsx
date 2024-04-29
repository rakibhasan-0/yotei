import "@testing-library/jest-dom"
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import SessionReviewComponent from "../../../../components/Plan/SessionReview/SessionReviewComponent"

configure({testIdAttribute: "id"})

describe("Initialization tests", async() => {

    beforeEach(async () => {

    })

    test("Should contain name of workout", async() => {
        


        render(<div><SessionReviewComponent isOpen={true} setIsOpen={true} session_id={workoutId}/></div>)
    })

})


describe("Interaction tests", async() => {

    beforeEach(async () => {

    })



})
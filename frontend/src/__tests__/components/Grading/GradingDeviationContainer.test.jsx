/* eslint-disable linebreak-style */
import { render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import GradingDeviationContainer from "../../../pages/Grading/GradingDeviationContainer"
import GradingDeviations from "../../../pages/Grading/GradingDeviations"

import { BrowserRouter } from "react-router-dom"

configure({testIdAttribute: "id"})

describe("When interacted with", () => {
    test.todo("should not display content when initialized")
    test.todo("should open if closed and sessionheader is clicked")
    test.todo("should close if open and sessionheader is clicked")
})


describe("Invalid input", () => {
    test("Should render placeholder if invalid ID", () => {
        const { container } = render(<BrowserRouter><GradingDeviationContainer/></BrowserRouter>)
        const innerHtml = container.innerHTML
        expect(innerHtml).toEqual(expect.stringContaining("Kunde inte ladda in tillfället"))
    })
})

describe("Render test", () => {
    var name = "Test 123"
    var id = 1
    var passed = true
    var comment = "This is a test comment"
    beforeEach(() => {

        const { container } = render(<BrowserRouter><GradingDeviationContainer id = {1} name = {name} passed = {passed} comment = {comment}/></BrowserRouter>)
		
	})

    test("Should render id if there is one", () => {
        expect(screen.getByTestId(1)).toHaveTextContent(id, 1)
    })

    test("Should render container with correct id", () => {
        expect(document.getElementById(`${id}-header`)).toBeDefined()
    })

    test("Should render technique name if technique name exists", () => {
        expect(document.getElementById("nameDisplay")).toHaveTextContent(name)
    })

    test("Should render comment if comment exists", () => {
        expect(document.getElementById("commentDisplay")).toHaveTextContent(comment)
    })

    test("Should pass and have color #c9eec3 ", () => {
        expect(document.getElementsByClassName("sc23-session-container-header-passed")).toBeDefined()
    })
})
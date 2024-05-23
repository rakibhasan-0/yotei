import {configure, screen, render, fireEvent} from "@testing-library/react"
import ExamineeBox from "../../../../components/Grading/PerformGrading/ExamineeBox.jsx"
import "@testing-library/jest-dom"
import React from "react"

configure({testIdAttribute: "id"})

describe("ExamineeBox name testing", () => {
	test("name rendering.", () => {
		const testText = "Förnamn Efternamn"
		render(<ExamineeBox id={"ExamineeBox"} examineeName={testText}/>)
		expect(screen.getByTestId("ExamineeName")).toHaveTextContent(testText)
	})
})

describe("ExamineeBox onClick testing", () => {
    test("ExamineeBox: function should run once on click", () => {
        const handleClick = jest.fn()
        render(<ExamineeBox id={"ExamineeBox"} onClick={handleClick}/>)
        fireEvent.click(screen.getByTestId("ExamineeBox"))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })
})
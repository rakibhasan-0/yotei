import {configure, screen, render} from "@testing-library/react"
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
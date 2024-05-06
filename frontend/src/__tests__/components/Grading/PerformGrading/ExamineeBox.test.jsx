import {render, screen} from "@testing-library/react"
import ExamineeBox from "../../../../components/Grading/PerformGrading/ExamineeBox.jsx"
import "@testing-library/jest-dom"
import React from "react"

describe("ExamineeBox", () => {
	test("name rendering.", () => {
		render(<ExamineeBox id={"ExamineeBox"} examineeName={"Test personnamn"}/>)
		const text = screen.getByRole("ExamineeName")
		expect(text).toBeInTheDocument()
	})
	test("Default name rendering.", () => {
		render(<ExamineeBox id={"ExamineeBox"}/>)
		const text = screen.getByRole("ExamineeName")
		expect(text).toBeInTheDocument()
	})
})
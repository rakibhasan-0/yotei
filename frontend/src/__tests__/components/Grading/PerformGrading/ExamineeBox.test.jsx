import {configure, screen, render, fireEvent, waitFor} from "@testing-library/react"
import ExamineeBox from "../../../../components/Grading/PerformGrading/ExamineeBox.jsx"
import "@testing-library/jest-dom"
import React from "react"

configure({testIdAttribute: "id"})

/**
 * Tests for the ExamineeBox component, making sure that
 * it swaps to the correct colors when clicked
 * 
 * @author Team Apelsin (Group 5)
 * @since 2024-05-23
 * @version 1.0
 */
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
		render(<ExamineeBox id={"ExamineeBox"} examineeName={"testname"} onClick={handleClick}/>)
		fireEvent.click(screen.getByTestId("ExamineeName"))
		expect(handleClick).toHaveBeenCalledTimes(1)
	})

	test("ExamineeBox: intial color should be white", () => {
		render(<ExamineeBox id="ExamineeBox" examineeName="testname"/>)
		const examineeBox = screen.getByTestId("ExamineeBox")
		expect(examineeBox).toHaveStyle({ backgroundColor: "white" })
	})

	test("ExamineeBox: clicked should swap colors to lightgreen", () => {
		const handleClick = jest.fn()
		render(<ExamineeBox id="ExamineeBox" examineeName="testname" onClick={handleClick} />)
		const examineeBox = screen.getByTestId("ExamineeBox")
		fireEvent.click(screen.getByTestId("ExamineeName"))
		expect(examineeBox).toHaveStyle({ backgroundColor: "lightgreen" })
	})

	test("ExamineeBox: clicked twice should swap colors to lightcoral", async () => {
		const handleClick = jest.fn()
		render(<ExamineeBox id="ExamineeBox" examineeName="testname" onClick={handleClick} />)
		const examineeBox = screen.getByTestId("ExamineeBox")
		fireEvent.click(screen.getByTestId("ExamineeName"))

		await waitFor(() => {
			expect(examineeBox).toHaveStyle({ backgroundColor: "lightgreen" })
		})

		fireEvent.click(screen.getByTestId("ExamineeName"))
		expect(examineeBox).toHaveStyle({ backgroundColor: "lightcoral" })
	})

	test("ExamineeBox: should have a comment button", () => {
		render(<ExamineeBox id="ExamineeBox" examineeName="testname"/>)
		const examineeCommentButton = screen.getByTestId("examinee-comment-button")
		expect(examineeCommentButton).toBeInTheDocument()
	})
})
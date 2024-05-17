import {configure, screen, render} from "@testing-library/react"
import ExamineePairBox from "../../../../components/Grading/PerformGrading/ExamineePairBox.jsx"
import "@testing-library/jest-dom"
import React from "react"

configure({testIdAttribute: "id"})

describe("ExamineePairBox Testing", () => {
	test("Pair Name Rendering.", () => {
		const testTextLeft = "FörnamnLeft EfternamnLeft"
		const testTextRight = "FörnamnRight EfternamnRight"
		render(
			<ExamineePairBox 
				id={"ExamineePairBox"}
				leftExaminee={testTextLeft}
				rightExaminee={testTextRight}
			/>
		)
		expect(screen.getByTestId("ExamineeLeftNameId")).toHaveTextContent(testTextLeft)
		expect(screen.getByTestId("ExamineeRightNameId")).toHaveTextContent(testTextRight)
	})

	test("Pair Number Rendering.", () => {
		const testPairNumber = "12"
		render(
			<ExamineePairBox
				id={"ExamineePairBox"}
				pairNumber={testPairNumber}
			/>
		)
		expect(screen.getByTestId("PairNumberId")).toHaveTextContent(testPairNumber)
	})

	test("Pair Row Color sets it to right color.", () => {
		const testColorHexColor = "#000000"
		render(
			<ExamineePairBox
				id={"ExamineePairBox"}
				rowColor={testColorHexColor}
			/>
		)
		expect(screen.getByTestId("ExamineePairBox")).toHaveStyle("background-color: " + testColorHexColor)
	})

	test("All parameters in ExamineePairBox component at once", () => {
		const testColorHexColor = "#000000"
		const testPairNumber = "12"
		const testTextLeft = "FörnamnLeft EfternamnLeft"
		const testTextRight = "FörnamnRight EfternamnRight"
		render(
			<ExamineePairBox
				id={"ExamineePairBox"}
				pairNumber={testPairNumber}
				leftExaminee={testTextLeft}
				rightExaminee={testTextRight}
				rowColor={testColorHexColor}
			/>
		)
		expect(screen.getByTestId("ExamineeLeftNameId")).toHaveTextContent(testTextLeft)
		expect(screen.getByTestId("ExamineeRightNameId")).toHaveTextContent(testTextRight)
		expect(screen.getByTestId("PairNumberId")).toHaveTextContent(testPairNumber)
		expect(screen.getByTestId("ExamineePairBox")).toHaveStyle("background-color: " + testColorHexColor)
	})
})
import React from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import FilterContainer from "../../../../components/Common/Filter/FilterContainer/FilterContainer"
import CheckBox from "../../../../components/Common/CheckBox/CheckBox"

configure({testIdAttribute: "id"})

test("FilterContainer: Should not crash when rendered", async() => {
	
	render(
		<div>
			<FilterContainer id={"testContainer"} status={true} />
		</div>
	)
	
})

test("FilterContainer: Container should exists in the document", async() => {
	
	render(
		<div>
			<FilterContainer id={"testContainer"} status={true} />
		</div>
	)

	const html = screen.getByTestId("testContainer")

	expect(html).toBeInTheDocument()

})

test("FilterContainer: Should be able to store a clickable checkbox without crashing", async() => {

	render(
		<FilterContainer id={"filterContainer"}>
			<CheckBox />
		</FilterContainer>	
	)
	
})

test("FilterContainer: Checkboxes should be interactible in the container", async() => {

	const mockFunc = jest.fn()

	render(
		<div>
			<FilterContainer id={"testContainer"} status={true}>
				<CheckBox id={"testCheckBox"} onClick={mockFunc} />
			</FilterContainer>
		</div>
	)

	screen.getByTestId("testCheckBox").click()

	expect(mockFunc).toBeCalled()
})
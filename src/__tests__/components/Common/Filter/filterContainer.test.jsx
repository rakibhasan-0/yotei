import React from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import FilterContainer from "../../../../components/Common/Filter/FilterContainer/FilterContainer"
import CheckBox from "../../../../components/Common/CheckBox/CheckBox"

configure({testIdAttribute: "id"})

test("Container exists", async() => {
	render(
		<div>
			<FilterContainer id={"testContainer"} status={true} />
		</div>
	)
	const html = screen.getByTestId("testContainer")
	expect(html).toBeInTheDocument()
})

test("Should be able to store a clickable checkbox", async() => {

	var kihon = false

	render(
		<FilterContainer id={"filterContainer"}>
			<CheckBox id={"checkbox"} onClick={()=>{kihon = true}}/>
		</FilterContainer>	
	)
	screen.getByTestId("checkbox").click()
	expect(kihon).toEqual(true)
})
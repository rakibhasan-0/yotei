import React from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import FilterBox from "../../../../components/Common/Filter/FilterBox/FilterBox"
import CheckBox from "../../../../components/Common/CheckBox/CheckBox"

configure({testIdAttribute: "id"})

test("Filter box exsists when rendered.", async() => {
	render(
		<div>
			<FilterBox id="filterBoxTest" status={true} />
		</div>
	)
	const html = screen.getByTestId("filterBoxTest")
	expect(html).toBeInTheDocument()
})

test("Filter hidden when status is false.", async() => {
	render(
        
		<FilterBox id="filterBoxTest" status={false}/>
	)

	const className  = screen.getByTestId("filterBoxTest").className

	expect(className).toBe("filterBox-pressed") 
})


test("FilterBox: Filter has children", async() => {
	render(
        
		<FilterBox id={"filterBox"} status={true}>
			<p id={"p"}className="kihon-text">Kihon</p>
			<CheckBox id={"check"} />
		</FilterBox>
	)

	const filterBox = screen.getByTestId("filterBox")

	expect(filterBox.contains(screen.getByTestId("p")) && filterBox.contains(screen.getByTestId("check"))).toBeTruthy()

})

test("FilterBox: works with no props", async() => {
	render(
		<FilterBox id={"filterBox"}/>	
	)

	const filterBox = screen.getByTestId("filterBox")

	expect(filterBox).not.toBeUndefined()

})


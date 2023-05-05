import React from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import FilterBox from "../../../../components/Common/Filter/FilterBox/FilterBox"

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
import React from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import FilterContainer from "../../../../components/Common/Filter/FilterContainer/FilterContainer"


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
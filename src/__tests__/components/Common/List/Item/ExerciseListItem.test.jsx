import React from "react"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"
import ExerciseListItem from "../../../../../components/Common/ExerciseCard/ExerciseListItem"

test("so that the component initializes properly.", async() => {

	const name = "Hoppa runt"
	const duration = "420 min"
	const pageId = 69
	const detailURL = "fakeurl.com/"
	const index = 420
	const description = "Hoppa riktigt hårt."
  
	// ACT
	const { getByTestId } = render(
		<ExerciseListItem
			data-testid="ExerciseListItem"
			item={name}
			text={duration}
			id={pageId}
			detailURL={detailURL}
			index={index}>
                
			{description}
		</ExerciseListItem>
	)
  
	// ASSERT
	expect(getByTestId("ExerciseListItem")).toBeDefined()
	expect(getByTestId("ExerciseListItem-item")).toHaveTextContent(name)
	expect(getByTestId("ExerciseListItem-text")).toHaveTextContent(duration)
	expect(getByTestId("ExerciseListItem-link")).toHaveAttribute("href", `${detailURL}${pageId}`)
})




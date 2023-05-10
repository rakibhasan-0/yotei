import React from "react"
import {render, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import ExerciseListItem from "../../../../../components/Common/List/Item/ExerciseListItem"

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

	const toggle = getByTestId("ExerciseListItem-toggle")

	fireEvent.click(toggle)
  
	
	// ASSERT
	expect(getByTestId("ExerciseListItem")).toBeDefined()
	expect(getByTestId("ExerciseListItem-item")).toHaveTextContent(name)
	expect(getByTestId("ExerciseListItem-text")).toHaveTextContent(duration)
	expect(getByTestId("ExerciseListItem-item")).toHaveAttribute("href", `${detailURL}${pageId}`)
	expect(getByTestId("ExerciseListItem-children")).toHaveTextContent(description)
})




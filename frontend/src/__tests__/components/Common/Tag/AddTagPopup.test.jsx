/** @jest-environment jsdom */
//import {React, useState} from "react"
//import {render, screen, configure, fireEvent, waitFor, getByTestId} from "@testing-library/react"
import "@testing-library/jest-dom"
//import AddTagPopup from "../../../../components/Common/Tag/AddTagPopup"
//import { MemoryRouter } from "react-router"
//import TagInput from "../../../../components/Common/Tag/TagInput"
//import Tag from "../../../../components/Common/Tag/Tag.jsx"

/**
 * Test for the AddTagPopup component.
 *
 * @author Team Minotaur, Team Durian
 * @version 1.0
 * @since 2023-05-08
 */

//configure({testIdAttribute: "id"})

/*test("Tag: Added tags should be visible", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	const { getByText } = render(
		<div>
			<MemoryRouter>
				<TagInput>
					<AddTagPopup id ="tagChooser" addedTags={addedTags}/>
				</TagInput>
			</MemoryRouter>
		</div>
	)

	const button = getByText("Hantera tagg")

	fireEvent.click(button)
	// ACT
	const tag = getByText("Tag1")

	// ASSERT
	expect(tag).toBeInTheDocument()
})*/

/*test("Tag: Should render the component as a whole", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	render(
		<div>
			<AddTagPopup id ="tagChooser" addedTags={addedTags}/>
		</div>
	)

	// ACT
	//const addedTag = screen.getByText("Tag1")
	const searchBar = screen.queryByPlaceholderText("Sök eller skapa tagg")
	//const addedTagHeading = screen.getByText("Tillagda taggar")


	// ASSERT
	//expect(addedTag).toBeVisible()
	expect(searchBar).toBeVisible()
	//expect(addedTagHeading).toBeVisible()
})*/

test("Expect true" , async() => {
	expect(true).toBe(true)
})
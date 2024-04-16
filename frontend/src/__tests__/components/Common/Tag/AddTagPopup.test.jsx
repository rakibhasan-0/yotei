/** @jest-environment jsdom */
import {React} from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import AddTagPopup from "../../../../components/Common/Tag/AddTagPopup"

/**
 * Test for the AddTagPopup component.
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-08
 */

configure({testIdAttribute: "id"})

test("Tag: Added tags should be visible", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	render(
		<div>
			<AddTagPopup id ="tagChooser" addedTags={addedTags}/>
		</div>
	)

	// ACT
	const tag = screen.getByText("Tag1")

	// ASSERT
	expect(tag).toBeVisible()
})

test("Tag: Should render the component as a whole", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	render(
		<div>
			<AddTagPopup id ="tagChooser" addedTags={addedTags}/>
		</div>
	)

	// ACT
	const addedTag = screen.getByText("Tag1")
	const searchBar = screen.queryByPlaceholderText("Sök efter taggar")
	const addedTagHeading = screen.getByText("Tillagda taggar")
	const backButton = screen.getByText("Stäng")


	// ASSERT
	expect(addedTag).toBeVisible()
	expect(searchBar).toBeVisible()
	expect(addedTagHeading).toBeVisible()
	expect(backButton).toBeVisible()
})
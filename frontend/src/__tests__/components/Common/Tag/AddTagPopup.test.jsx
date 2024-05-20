/** @jest-environment jsdom */
import {React} from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router"
import AddTagPopup from "../../../../components/Common/Tag/AddTagPopup"

/**
 * Test for the AddTagPopup component.
 *
 * @author Team Minotaur, Team Durian (Group 3)
 * @version 1.0
 * @since 2023-05-08
 */

configure({testIdAttribute: "id"})

//Simple component test. To test the functionallity of everything in the popup, write a playwright test. 
test("Tag: Should show popup", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	render(
		<div>
			<MemoryRouter>
				<AddTagPopup id ="tagChooser" addedTags={addedTags}/>
			</MemoryRouter>
		</div>
	)

	// ACT
	const searchbar = screen.getByPlaceholderText("Sök eller skapa tagg")
	const saveButton = screen.getByTestId("save-and-close-button")
	const sorter = screen.getByText("Sortering")

	// ASSERT
	expect(saveButton).toBeVisible()
	expect(searchbar).toBeVisible()
	expect(sorter).toBeVisible()
})
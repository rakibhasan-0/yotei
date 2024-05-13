/** @jest-environment jsdom */
import {React} from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import TagInput from "../../../../components/Common/Tag/TagInput"
import AddTagPopup from "../../../../components/Common/Tag/AddTagPopup"
import { fireEvent } from "@testing-library/react"

/**
 * Test for the TagInput component.
 *
 * @author Team Minotaur, Team Durian
 * @version 1.0
 * @since 2024-05-02
 */
configure({testIdAttribute: "id"})

test("Tag: Tag should be visible", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	render(
		<div>
			<TagInput id ="tagChooser" addedTags={addedTags}/>
		</div>
	)

	// ACT
	const tag = screen.getByText("Tag1")

	// ASSERT
	expect(tag).toBeVisible()
})

/*test("Tag: Should show popup onclick", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	// ACT
	const {getByText} =  render(<div><TagInput onClick={
		()=> <AddTagPopup id ="addTagPopupDiv" addedTags={addedTags}/>} id ="tagChooser" addedTags={addedTags}></TagInput></div>)

	// ACT
	const button = getByText("Hantera tagg")

	fireEvent.click(button)

	// ASSERT
	const popup = getByText("Tillagda taggar")
	expect(popup).toBeVisible()
})*/
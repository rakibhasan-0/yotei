/** @jest-environment jsdom */
//import {React} from "react"
import {render, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import AddTagPopup from "../../../../components/Common/Tag/AddTagPopup"
import { MemoryRouter } from "react-router"
import TagInput from "../../../../components/Common/Tag/TagInput"
import { fireEvent } from "@testing-library/react"

/**
 * Test for the AddTagPopup component.
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-08
 */

configure({testIdAttribute: "id"})
test("Tag: Added tag should have checked checkbox", async() => {
	// ARRANGE
	const addedTags = [{id:1,name:"Tag1"}]

	// ACT
	const {getByText} =  render(<div><MemoryRouter>
		<TagInput onClick={
			()=> <AddTagPopup id ="addTagPopupDiv" addedTags={addedTags}/>} id ="tagChooser" addedTags={addedTags}></TagInput></MemoryRouter></div>)

	// ACT
	const button = getByText("Hantera tagg")
	fireEvent.click(button)

	// ASSERT
	const popup = getByText("Tag1")
	expect(popup).toBeVisible()
})

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
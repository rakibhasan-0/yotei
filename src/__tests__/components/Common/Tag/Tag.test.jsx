import React from "react"
import {render, screen, configure} from "@testing-library/react"
import Tag from "../../../../components/Common/Tag/Tag"
import "@testing-library/jest-dom"

/**
 * Test for the Tag component.
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-08
 */
configure({testIdAttribute: "id"})

test("Tag: function should run once on one click", async() => {
	// ARRANGE
	let clicked = false
	render(
		<div>
			<Tag tagType = "default" onClick={()=> clicked=!clicked} id={"testTag"}></Tag>
		</div>
	)

	// ACT
	screen.getByTestId("testTag").click()

	// ASSERT
	expect(clicked).toEqual(true)
})

test("Tag: right text should be displayed", async() => {
	// ARRANGE
	let tagText = "taggtexten"
	render(
		<div>
			<Tag tagType = "default" text={tagText} id={"testTag"}></Tag>
		</div>
	)

	// ACT
	const tag = screen.getByTestId("testTag")

	// ASSERT
	expect(tag).toHaveTextContent(tagText)
})

test("Tag: right tag type should be displayed", async() => {
	// ARRANGE
	let tagType = "suggest"
	render(
		<Tag tagType = {tagType} text="tagText" id={"testTag"}></Tag>
	)

	// ACT
	const tag = screen.getByTestId("testTag")

	// ASSERT
	expect(tag).toHaveClass(tagType)    
})
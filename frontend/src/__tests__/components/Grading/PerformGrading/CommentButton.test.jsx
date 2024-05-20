import {configure, render, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import CommentButton from "../../../../components/Grading/PerformGrading/CommentButton.jsx"

configure({testIdAttribute: "id"})

/**
 * @author Team Apelsin (Group 5)
 * @since 2024-05-03
 * @version 1.0
 */
describe("CommentButtonTests", () => {
	test("CommentButton: function should run once on one click", async () => {
		// ARRANGE
		let clicked = false
		render(<div><CommentButton id={"testCommentbutton"} onClick={
			() => clicked = !clicked}></CommentButton></div>)

		// ACT
		screen.getByTestId("testCommentbutton").click()

		// ASSERT
		expect(clicked).toEqual(true)
	})

	test("CommentButton: function should run twice on two(2) clicks", async () => {
		// ARRANGE
		let timesClicked = 0
		render(<div><CommentButton onClick={
			() => timesClicked = timesClicked + 1} id={"testCommentbutton"}></CommentButton></div>)

		// ACT
		screen.getByTestId("testCommentbutton").click()
		screen.getByTestId("testCommentbutton").click()

		// ASSERT
		expect(timesClicked).toEqual(2)
	})

	test("CommentButton: nothing should happen on no clicks", async() => {
		// ARRANGE
		let clicked = false
		render(<div><CommentButton onClick={
			()=> clicked=!clicked} id={"testCommentbutton"}></CommentButton></div>)

		// ACT
		// *cricket sounds*

		// ASSERT
		expect(clicked).toEqual(false)
	})

	test("CommentButton: displays the notification circle only when a comment is saved", async() => {
		const { rerender } = render(<CommentButton id="test-button" onClick={() => {}} commentSaved={true} />)
		expect(screen.getByTestId("notification-circle")).toBeInTheDocument()
		rerender(<CommentButton id="test-button" onClick={() => {}} commentSaved={false} />)
		expect(() => screen.getByTestId("notification-circle")).toThrow()
	})
})
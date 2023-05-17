/** @jest-environment jsdom */
// React/Jest imports
import React from "react"
import { render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import ReviewComment from "../../../components/Workout/WorkoutReview/ReviewComment.jsx"

configure({testIdAttribute: "id"})

/**
 * Test for the review comment component.
 * 
 * @author Cyclops (Group 5) (2023-05-16)
 * @version 1.0
 */

test("Should only have positive comment", async() => {
	// ARRANGE
	const review = {
		workoutId: 1,
		userId: 1,
		rating: 0,
		positive_comment: "Tjena!",
		negative_comment: "",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} editable={true}/>)

	let positive = screen.getByRole("icon", {name: /positive/i})
	let negative = screen.queryByRole("icon", {name: /negative/i})

	expect(screen.queryByTestId("comment_divider")).not.toBeInTheDocument()
	expect(positive).toBeInTheDocument()
	expect(negative).not.toBeInTheDocument()
})

test("Should only have negative comment", async() => {
	
	const review = {
		workoutId: 1,
		userId: 1,
		rating: 0,
		positive_comment: "",
		negative_comment: "Tjena!",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} editable={true}/>)

	let positive = screen.queryByRole("icon", {name: /positive/i})
	let negative = screen.getByRole("icon", {name: /negative/i})

	expect(screen.queryByTestId("comment_divider")).not.toBeInTheDocument()
	expect(positive).not.toBeInTheDocument()
	expect(negative).toBeInTheDocument()
})

test("Should not have any comment", async() => {
	
	const review = {
		workoutId: 1,
		userId: 1,
		rating: 0,
		positive_comment: "",
		negative_comment: "",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} editable={true}/>)

	let positive = screen.queryByRole("icon", {name: /positive/i})
	let negative = screen.queryByRole("icon", {name: /negative/i})

	expect(screen.queryByTestId("comment_divider")).not.toBeInTheDocument()
	expect(positive).not.toBeInTheDocument()
	expect(negative).not.toBeInTheDocument()
})

test("Should have both positive, negative comment and a divider", async() => {
	
	const review = {
		workoutId: 1,
		userId: 1,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} editable={true}/>)

	let positive = screen.getByRole("icon", {name: /positive/i})
	let negative = screen.getByRole("icon", {name: /negative/i})

	expect(screen.getByTestId("comment_divider")).toBeInTheDocument()
	expect(positive).toBeInTheDocument()
	expect(negative).toBeInTheDocument()
})

test("Should not have (jag)", async() => {
	
	const review = {
		workoutId: 1,
		userId: 1337,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} editable={false}/>)

	expect(screen.queryByTestId("me")).not.toBeInTheDocument()
})

test("Should have (jag)", async() => {
	
	const review = {
		workoutId: 1,
		userId: 1337,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} editable={true}/>)

	expect(screen.getByTestId("me")).toBeInTheDocument()
})
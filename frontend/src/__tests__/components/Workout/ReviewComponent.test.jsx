/** @jest-environment jsdom */
// React/Jest imports
import React from "react"
import { render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import ReviewComment from "../../../components/Workout/WorkoutReview/ReviewComment.jsx"
import { AccountContext } from "../../../context"
import { USER_PERMISSION_LIST_ALL } from "../../../utils.js"
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

	expect(positive).toBeInTheDocument()
	expect(negative).toBeInTheDocument()
})

test("Should not have (jag)", async() => {

	const review = {
		workoutId: 1,
		user_id: 1337,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} testId={100}/>)

	expect(screen.queryByTestId("me")).not.toBeInTheDocument()
})

test("Should have (jag)", async() => {

	const review = {
		workoutId: 1,
		user_id: 1,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(<ReviewComment comment={review} testId={1}/>)

	expect(screen.getByTestId("me")).toBeInTheDocument()
})

test("Admin can see icon to remove user comment", async () => {
	const review = {
		workoutId: 1,
		user_id: 2,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(
		<AccountContext.Provider value={{ userId: 1, permissions: USER_PERMISSION_LIST_ALL }}>
			<ReviewComment comment={review} testId={1}/>
		</AccountContext.Provider>
	)
	expect(screen.getByTestId("trash_icon")).toBeInTheDocument()
})

test("Admin can not see pencil icon for user comment", async () => {
	const review = {
		workoutId: 1,
		user_id: 2,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(
		<AccountContext.Provider value={{ userId: 1 }}>
			<ReviewComment comment={review} testId={1}/>
		</AccountContext.Provider>
	)
	expect(screen.queryByTestId("pencil_icon")).not.toBeInTheDocument()
})

test("User can't see pencil icon for other user comment", async () => {
	const review = {
		workoutId: 1,
		user_id: 2,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(
		<AccountContext.Provider value={{ userId: 1, role: "USER" }}>
			<ReviewComment comment={review} testId={1}/>
		</AccountContext.Provider>
	)
	expect(screen.queryByTestId("pencil_icon")).not.toBeInTheDocument()
})

test("User can't see trash icon for other user comment", async () => {
	const review = {
		workoutId: 1,
		user_id: 2,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(
		<AccountContext.Provider value={{ userId: 1, role: "USER" }}>
			<ReviewComment comment={review} testId={1}/>
		</AccountContext.Provider>
	)
	expect(screen.queryByTestId("trash_icon")).not.toBeInTheDocument()
})

test("User can see both pencil and trash icon on own comment", async () => {
	const review = {
		workoutId: 1,
		user_id: 1,
		rating: 0,
		positive_comment: "tjooooo",
		negative_comment: "breeee",
		review_date: "2023-05-16"
	}

	render(
		<AccountContext.Provider value={{ userId: 1, role: "USER" }}>
			<ReviewComment comment={review} testId={1}/>
		</AccountContext.Provider>
	)
	expect(screen.getByTestId("pencil_icon")).toBeInTheDocument()
	expect(screen.getByTestId("trash_icon")).toBeInTheDocument()
})
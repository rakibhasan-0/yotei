import React from "react"
import { render, screen, configure } from "@testing-library/react"
import InputTextField from "../../../../components/Common/InputTextField/InputTextField"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

configure({testIdAttribute: "id"})

test("InputTextField: typed text should be returnable", async() => {
	// ARRANGE
	let text = "Hello world!"
	render(<div><InputTextField id={"testField"} ></InputTextField></div>)
	const inputTextField = screen.getByTestId("testField")

	// ACT
	await userEvent.type(inputTextField, text)

	// ASSERT
	expect(inputTextField).toHaveValue(text)
})
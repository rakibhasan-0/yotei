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

test("InputTextField: should display error message", async() => {
	render(<InputTextField id="testField" errorMessage="Something went wrong"/>)

	expect(screen.getByRole("textbox", {name: /something went wrong/i})).toBeInTheDocument()
})

test("InputTextField: should not display error message", async() => {
	render(<InputTextField id="testField" errorMessage=""/>)

	expect(screen.queryByRole("textbox", {name: /something went wrong/i})).not.toBeInTheDocument()
})

test("InputTextField: should not display error message, null", async() => {
	render(<InputTextField id="testField" errorMessage={null}/>)

	expect(screen.queryByRole("textbox", {name: /something went wrong/i})).not.toBeInTheDocument()
})

test("InputTextField: should not display error message, undefined", async() => {
	render(<InputTextField id="testField" errorMessage={undefined}/>)

	expect(screen.queryByRole("textbox", {name: /something went wrong/i})).not.toBeInTheDocument()
})
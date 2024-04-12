import React from "react"
import { render, screen, configure } from "@testing-library/react"
import TextArea from "../../../../components/Common/TextArea/TextArea"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

configure({testIdAttribute: "id"})

test("TextArea: typed text should be returnable", async() => {
	// ARRANGE
	let text = "Hello world!"
	render(<div><TextArea id={"testArea"} ></TextArea></div>)
	const textArea = screen.getByTestId("testArea")

	// ACT
	await userEvent.type(textArea, text)

	// ASSERT
	expect(textArea).toHaveValue(text)
})

test("TextArea: setting default text should return default text", async() => {
	// ARRANGE
	render(<div><TextArea defVal={"Default text"} id={"testArea"} ></TextArea></div>)
	const textArea = screen.getByTestId("testArea")

	// ACT
	// *cricket sounds*

	// ASSERT
	expect(textArea).toHaveValue("Default text")
})

test("TextArea: default text should be changeable", async() => {
	// ARRANGE
	render(<div><TextArea defVal={"Default text"} id={"testArea"} ></TextArea></div>)
	const textArea = screen.getByTestId("testArea")

	// ACT
	await userEvent.type(textArea, "!!!")

	// ASSERT
	expect(textArea).toHaveValue("Default text!!!")
})

test("TextArea: placeholder should not change value", async() => {
	// ARRANGE
	render(<div><TextArea placeholder={"Enter text here"} defVal={"Default text"} id={"testArea"} ></TextArea></div>)
	const textArea = screen.getByTestId("testArea")

	// ACT
	// *cricket sounds*

	// ASSERT
	expect(textArea).toHaveValue("Default text")
})

test("TextArea: should display error message", async() => {
	render(<TextArea id="testField" errorMessage="Something went wrong"/>)

	expect(screen.getByRole("textbox", {name: /something went wrong/i})).toBeInTheDocument()
})

test("TextArea: should not display error message, empty string", async() => {
	render(<TextArea id="testField" errorMessage=""/>)

	expect(screen.queryByRole("textbox", {name: /something went wrong/i})).not.toBeInTheDocument()
})

test("TextArea: should not display error message, null", async() => {
	render(<TextArea id="testField" errorMessage={null}/>)

	expect(screen.queryByRole("textbox", {name: /something went wrong/i})).not.toBeInTheDocument()
})

test("TextArea: should not display error message, undefined", async() => {
	render(<TextArea id="testField" errorMessage={undefined}/>)

	expect(screen.queryByRole("textbox", {name: /something went wrong/i})).not.toBeInTheDocument()
})
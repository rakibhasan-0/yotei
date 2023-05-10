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
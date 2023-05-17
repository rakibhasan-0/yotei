/** @jest-environment jsdom */
import React from "react"
import {fireEvent, render, screen} from "@testing-library/react"
import InputTextFieldBorderLabel from "../../../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import "@testing-library/jest-dom"

test("Tests the label prop in the textfield", async() => {
	const labelText = "Name"

	render(<InputTextFieldBorderLabel label={"Name"}></InputTextFieldBorderLabel>)

	const label = screen.getByText(labelText)

	expect(label).toBeInTheDocument()
})

test("Tests the onChange prop in the textfield", async() => {
	const onChangeMock = jest.fn()
	render(<InputTextFieldBorderLabel onChange={onChangeMock}></InputTextFieldBorderLabel>)
	const inputField = screen.getByRole("textbox")
	fireEvent.change(inputField, { target: { value: "Test value" } })
	expect(onChangeMock).toHaveBeenCalledTimes(1)
})


/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import Popup from "../../../../components/Common/Popup/Popup"

configure({ testIdAttribute: "id" })

test("No title prop popup should not have title", async () => {
	// ARRANGE
	render(<Popup id="popup" isOpen={ true }></Popup>)

	const title = screen.queryByRole("title")

	// ASSERT
	expect(title).not.toBeInTheDocument()
})

test("Popup should have correct title", async () => {
	// ARRANGE
	render(<Popup id="popup" title="Test" isOpen={ true }></Popup>)

	const popup = screen.getByTestId("popup")

	// ASSERT
	expect(popup).toHaveTextContent("Test")
})

test("Popup should not be open", async () => {
	// ARRANGE
	render(<Popup id="popup" title="Test" isOpen={ false }></Popup>)

	const popup = screen.queryByTestId("popup")

	// ASSERT
	expect(popup).not.toBeInTheDocument()
})

test("Popup should be open", async () => {
	// ARRANGE
	render(<Popup id="popup" title="Test" isOpen={ true }></Popup>)

	const popup = screen.queryByTestId("popup")

	// ASSERT
	expect(popup).toBeInTheDocument()
})
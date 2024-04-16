/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import MiniPopup from "../../../../components/Common/MiniPopup/MiniPopup"

configure({ testIdAttribute: "id" })

test("No title prop popup should not have title", async () => {
	// ARRANGE
	render(<MiniPopup id="MiniPopup" isOpen={ true }></MiniPopup>)

	const title = screen.queryByRole("title")

	// ASSERT
	expect(title).not.toBeInTheDocument()
})

test("MiniPopup should have correct title", async () => {
	// ARRANGE
	render(<MiniPopup id="MiniPopup" title="Test" isOpen={ true }></MiniPopup>)

	const popup = screen.getByTestId("MiniPopup")

	// ASSERT
	expect(popup).toHaveTextContent("Test")
})

test("MiniPopup should not be open", async () => {
	// ARRANGE
	render(<MiniPopup id="MiniPopup" title="Test" isOpen={ false }></MiniPopup>)

	const popup = screen.queryByTestId("MiniPopup")

	// ASSERT
	expect(popup).not.toBeInTheDocument()
})

test("MiniPopup should be open", async () => {
	// ARRANGE
	render(<MiniPopup id="MiniPopup" title="Test" isOpen={ true }></MiniPopup>)

	const popup = screen.queryByTestId("MiniPopup")

	// ASSERT
	expect(popup).toBeInTheDocument()
})
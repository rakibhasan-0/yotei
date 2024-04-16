/** @jest-environment jsdom */
import React from "react"
import {render, configure, screen, fireEvent} from "@testing-library/react"

import ErrorLogsDisplay from "../../../components/ErrorLogsDisplay/ErrorLogsDisplay"
import "@testing-library/jest-dom"
import { server } from "../../server"

const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

configure({testIdAttribute: "id"})


test("Error-log button renders once ErrorLogsDisplay is rendered", async () => {
	// ARRANGE
	render(<ErrorLogsDisplay id={1}></ErrorLogsDisplay>)

	// ACT
	let button = screen.getByTestId("errorlogsdisplay-button")

	// ASSERT
	expect(button).toBeInTheDocument()
})


test("Popup renders once button is pressed", async () => {
	// ARRANGE
	render(<ErrorLogsDisplay id={1} />)

	// ACT
	fireEvent.click(screen.getByTestId("errorlogsdisplay-button"))
	
	// ASSERT
	expect(screen.getByTestId("test-popup")).toBeInTheDocument()
})


test("Confirm-popup renders once trashbin is pressed", async () => {
	// ARRANGE
	render(<ErrorLogsDisplay id={1} />)
  
	// ACT
	fireEvent.click(screen.getByTestId("errorlogsdisplay-button"))
	fireEvent.click(screen.getByTestId("trash-test"))

	// ASSERT
	expect(screen.getByTestId("test-confirm-popup")).toBeInTheDocument()
})

test("Datepicker renders in the popup once error-log button is pressed", async () => {
	// ARRANGE
	render(<ErrorLogsDisplay id={1} />)
  
	// ACT
	fireEvent.click(screen.getByTestId("errorlogsdisplay-button"))

	// ASSERT
	expect(screen.getByTestId("test-datepicker")).toBeInTheDocument()
})

  

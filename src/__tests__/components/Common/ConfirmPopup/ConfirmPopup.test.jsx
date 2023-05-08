import { render, screen, configure, fireEvent } from "@testing-library/react"
import ConfirmPopup from "../../../../components/Common/ConfirmPopup/ConfirmPopup"
import "@testing-library/jest-dom"
import React from "react"

configure({testIdAttribute: "id"})

test("ConfirmPopup: when initialized with showPopup=false should not show", async() => {
	// ARRANGE
	render(<ConfirmPopup id={"confirmPopup"} showPopup={false}></ConfirmPopup>)

	// ACT
	const popup = screen.queryByTestId("confirmPopup")

	// ASSERT
	expect(popup).not.toBeInTheDocument()
})

test("ConfirmPopup: when initialized with showPopup=true should show", async() => {
	// ARRANGE
	render(<ConfirmPopup id={"confirmPopup"} showPopup={true}></ConfirmPopup>)

	// ACT
	const popup = screen.queryByTestId("confirmPopup")

	// ASSERT
	expect(popup).toBeInTheDocument()
})

test("ConfirmPopup: When \"Tillbaka\" is clicked popup should no longer show", async () => {
	// ARRANGE
	const setShowPopup = jest.fn() // Define and initialize setShowPopup
	const useStateMock = (initialState) => [initialState, setShowPopup]
	jest.spyOn(React, "useState").mockImplementation(useStateMock)
	
	render(<ConfirmPopup id="confirmPopup" showPopup={true} setShowPopup={setShowPopup} />)
  
	// ACT
	fireEvent.click(screen.getByText("Tillbaka"))
  
	// ASSERT
	expect(setShowPopup).toHaveBeenCalledWith(false)
})

test("ConfirmPopup: Function should run once when \"Radera\" is clicked", async() => {
	// ARRANGE 
	let clicked = false
	render(<ConfirmPopup id={"confirmPopup"} showPopup={true} onClick={
		()=> clicked=!clicked} setShowPopup={() => void 0} ></ConfirmPopup>)

	// ACT
	screen.getByText("Radera").click()

	// ASSERT
	expect(clicked).toEqual(true)
})

test("ConfirmPopup: When \"Radera\" is clicked popup should close", async() => {
	// ARRANGE 
	const setShowPopup = jest.fn() // Define and initialize setShowPopup
	const useStateMock = (initialState) => [initialState, setShowPopup]
	jest.spyOn(React, "useState").mockImplementation(useStateMock)
	render(<ConfirmPopup id={"confirmPopup"} showPopup={true} onClick={
		()=> void 0} setShowPopup={setShowPopup} ></ConfirmPopup>)

	// ACT
	screen.getByText("Radera").click()

	// ASSERT
	expect(setShowPopup).toHaveBeenCalledWith(false)
})
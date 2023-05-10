import Divider from "../../../../components/Common/Divider/Divider"
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"}) 

test("Divider should display given text -> vecka 24", () => {
	// ARANGE
	render(<Divider id = 'test' option= 'h1_center' title = 'vecka 24'/>)
	
	// ASSERT
	expect(screen.getByTestId("test")).toHaveTextContent("vecka 24")
})

test("Divider should not contain other than given text-> vecka 24", () => {
	// ARANGE
	render(<Divider id ='test' option= 'h1_center' title = 'vecka 24'/>)

	// ASSERT
	expect(screen.getByTestId("test")).not.toHaveTextContent("vecka 200")
})

test("Divider should contain class name divider_left on option=h1_left", () => {
	// ARANGE
	render(<Divider id ='test' option= 'h1_left' title = 'vecka 24'/>)

	// ASSERT
	expect(screen.getByTestId("test").classList.contains("divider_left")).toBeTruthy()
})

test("Divider should contain class name divider_left on option=h2_left", () => {
	// ARANGE
	render(<Divider id ='test' option= 'h2_left' title = 'vecka 24'/>)

	// ASSERT
	expect(screen.getByTestId("test").classList.contains("divider_left")).toBeTruthy()
})

test("Divider should contain class name divider_center on option=h1_center", () => {
	// ARANGE
	render(<Divider id ='test' option= 'h1_center' title = 'vecka 24'/>)

	// ASSERT
	expect(screen.getByTestId("test").classList.contains("divider_center")).toBeTruthy()
})

test("Divider should contain class name divider_center on option=h2_center", () => {
	// ARANGE
	render(<Divider id ='test' option= 'h2_center' title = 'vecka 24'/>)

	// ASSERT
	expect(screen.getByTestId("test").classList.contains("divider_center")).toBeTruthy()
})

test("Divider should contain class name divider_middle on option=h2_middle", () => {
	// ARANGE
	render(<Divider id ='test' option= 'h2_middle' title = 'vecka 24'/>)

	// ASSERT
	expect(screen.getByTestId("test").classList.contains("divider_middle")).toBeTruthy()
})

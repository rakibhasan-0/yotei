import ErrorState from "../../../../components/Common/ErrorState/ErrorState"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"}) 

test("ErrorState: should display error text", () => {
	render(<ErrorState message="Hello!" id="test"/>)

	expect(screen.getByTestId("test")).toHaveTextContent("Hello!")
})

test("ErrorState: should perform back action", () => {
	let clicked = false

	render(<ErrorState id="test" onBack={() => clicked = true}/>)

	screen.getByText("Tillbaka").click()

	expect(clicked).toBeTruthy()
})

test("ErrorState: should perform recover action", () => {
	let clicked = false

	render(<ErrorState id="test" onRecover={() => clicked = true}/>)

	screen.getByText("Försök igen").click()

	expect(clicked).toBeTruthy()
})

test("ErrorState: should be able to be called with no props", () => {
	render(<ErrorState />)
})

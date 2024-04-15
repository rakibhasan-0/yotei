/** @jest-environment jsdom */
import {render, configure, screen} from "@testing-library/react"
import PopupAdd from "../../../components/Plan/PopupAdd"
import userEvent from "@testing-library/user-event"

configure({testIdAttribute: "id"})

const mockNavigate = jest.fn()
jest.mock("react-router", () => ({
	useNavigate: () => mockNavigate
}))

afterEach(() => {
	jest.restoreAllMocks()
})

test("Should link to '/plan/create'", async () => {
	// ARRANGE
	render(<PopupAdd id='PopupAddTest' isOpen={true} setIsOpen={()=>({})}></PopupAdd>)

	// ACT
	await userEvent.click(screen.getByTestId("newPlan"))

	// ASSERT
	expect(mockNavigate).toHaveBeenCalledWith("/plan/create")
})

test("Should link to '/session/create'", async () => {
	// ARRANGE
	render(<PopupAdd id='PopupAddTest' isOpen={true} setIsOpen={()=>({})}></PopupAdd>)

	// ACT
	await userEvent.click(screen.getByTestId("newSession"))

	// ASSERT
	expect(mockNavigate).toHaveBeenCalledWith("/session/create")
})
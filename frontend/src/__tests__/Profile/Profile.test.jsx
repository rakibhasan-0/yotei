import { configure, render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Profile from "../../pages/Profile/Profile"
import "@testing-library/jest-dom"
import { toast } from "react-toastify"
/**
 * Unit-test for the GroupIndex page, 
 * init as well as making sure search button is case insensitive
 *
 * @author Team Mango (Group 4)
 * @since 2024-05-02
 * @version 1.0 
 */

configure({testIdAttribute: "id"})
jest.mock("react-router", () => ({
	useNavigate: () => jest.fn()
}))
jest.mock("react-toastify", () => ({

	toast: {
		success: jest.fn(),
	},
}))

test("Should render titles on init", async () => {
	render(<Profile />)
	expect(screen.getByText("Favoritpass")).toBeInTheDocument()
	expect(screen.getByText("Mina Pass")).toBeInTheDocument()
	expect(screen.getByText("Inställningar")).toBeInTheDocument()
})

test("should d", async () => {
	render(<Profile />)

	expect(screen.getByText("Inställningar")).toBeInTheDocument()

	const usernameInput = screen.getByTestId("username")
	const passwordInput = screen.getByTestId("change-username-password")

	fireEvent.change(usernameInput, { target: { value: "test" } })
	fireEvent.change(passwordInput, { target: { value: "test" } })

	await userEvent.click(screen.getByTestId("change-username-button"))

	expect(toast.success).toHaveBeenCalled()

	//expect(screen.getByText("Iställningar")).toBeInTheDocument()
	
})
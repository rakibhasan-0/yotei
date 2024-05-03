import { configure, render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Profile from "../../pages/Profile/Profile"
import "@testing-library/jest-dom"
import { toast } from "react-toastify"
import { rest } from "msw"
import { server } from "../server"
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

describe("should update", () => {
	beforeEach(() => {
		server.use(
			rest.get("api/users", async (req, res, ctx) => {
				return res(
					ctx.status(200),
					ctx.json(
						[

							{
								"userId": 1,
								"username": "admin",
								"userRole": "ADMIN"
							},
							{
								"userId": 2,
								"username": "editor",
								"userRole": "EDITOR"
							},
							{
								"userId": 3,
								"username": "user",
								"userRole": "USER"
							},
							{
								"userId": 5,
								"username": "1231",
								"userRole": "USER"
							},
							{
								"userId": 6,
								"username": "12",
								"userRole": "EDITOR"
							},
							{
								"userId": 4,
								"username": "david",
								"userRole": "USER"
							},
							{
								"userId": 8,
								"username": "danne",
								"userRole": "USER"
							},
							{
								"userId": 9,
								"username": "123",
								"userRole": "USER"
							}
						])
					
				)
			})
		)
	})
	
	test("should d", async () => {
		render(<Profile />)
	
		expect(screen.getByText("Inställningar")).toBeInTheDocument()
	
		const usernameInput = screen.getByTestId("username")
		const passwordInput = screen.getByTestId("change-username-password")
	
		fireEvent.change(usernameInput, { target: { value: "" } })
		fireEvent.change(passwordInput, { target: { value: "test" } })
	
		await userEvent.click(screen.getByTestId("change-username-button"))
	
		expect(toast.success).toHaveBeenCalled()

		const currPassword = screen.getByTestId("current-password")
		const newPassword = screen.getByTestId("new-password")
		const confirmPassword = screen.getByTestId("verify-password")
		
		fireEvent.change(currPassword, { target: { value: "admi" } })
		fireEvent.change(newPassword, { target: { value: "" } })
		fireEvent.change(confirmPassword, { target: { value: "" } })

		await userEvent.click(screen.getByTestId("change-password-button"))

		expect(toast.success).toHaveBeenCalled()
	
		expect(screen.getByText("Iställningar")).toBeInTheDocument()
		
	})

})

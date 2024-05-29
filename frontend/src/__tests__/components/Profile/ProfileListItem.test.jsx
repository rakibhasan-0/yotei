import { configure, render, screen } from "@testing-library/react"
import ProfileListItem from "../../../components/Profile/ProfileListItem"
import { Eye } from "react-bootstrap-icons"
import { AccountContext } from "../../../context"
import { USER_PERMISSION_LIST_ALL } from "../../../utils"
import { BrowserRouter } from "react-router-dom"
import "@testing-library/jest-dom"

configure({ testIdAttribute: "id" })

describe("ProfileListItem.jsx", () => {
	describe("When initialized", () => {
		const author = {
			username: "ADMIN",
			userId: 2,
		}
		const list = {
			id: 1,
			name: "test list",
			size: 3,
			author: author,
			hidden: false,
		}

		test("should render component that has given ID -> 1", async () => {
			render(
				<AccountContext.Provider
					value={{ undefined, userId: 1, permissions: USER_PERMISSION_LIST_ALL, username: "name" }}
				>
					<BrowserRouter>
						<ProfileListItem item={list} key={1} Icon={<Eye />} />
					</BrowserRouter>
				</AccountContext.Provider>
			)
			expect(screen.getByTestId("1")).toHaveAttribute("id", "1")
		})

		test("should render component and display information about the list", async () => {
			render(
				<AccountContext.Provider
					value={{ undefined, userId: 1, permissions: USER_PERMISSION_LIST_ALL, username: "name" }}
				>
					<BrowserRouter>
						<ProfileListItem item={list} key={1} Icon={<Eye />} />
					</BrowserRouter>
				</AccountContext.Provider>
			)
			expect(screen.getByText("test list")).toBeInTheDocument()
			expect(screen.getByText(/av\s+ADMIN/)).toBeInTheDocument()
			expect(screen.getByText(/3\s+aktiviteter/)).toBeInTheDocument()
		})
	})

	describe("when render component that has id -1", () => {
		const list = {
			id: -1,
			name: "Favoritpass",
			size: 10,
		}
		test("should render component that has id -1", () => {
			render(
				<AccountContext.Provider
					value={{ undefined, userId: 1, permissions: USER_PERMISSION_LIST_ALL, username: "name" }}
				>
					<BrowserRouter>
						<ProfileListItem item={list} key={-1} Icon={<Eye />} />
					</BrowserRouter>
				</AccountContext.Provider>
			)
			expect(screen.getByTestId("-1")).toHaveAttribute("id", "-1")
		})

		test("should render component and show information about favorite workouts", () => {
			render(
				<AccountContext.Provider
					value={{ undefined, userId: 1, permissions: USER_PERMISSION_LIST_ALL, username: "name" }}
				>
					<BrowserRouter>
						<ProfileListItem item={list} key={-1} Icon={<Eye />} />
					</BrowserRouter>
				</AccountContext.Provider>
			)
			expect(screen.getByText("Favoritpass")).toBeInTheDocument()
			expect(screen.getByText(/10\s+pass/)).toBeInTheDocument()
		})

		test("should render link to /profile/favouriteWorkouts", () => {
			render(
				<AccountContext.Provider
					value={{ undefined, userId: 1, permissions: USER_PERMISSION_LIST_ALL, username: "name" }}
				>
					<BrowserRouter>
						<ProfileListItem item={list} key={-1} Icon={<Eye />} />
					</BrowserRouter>
				</AccountContext.Provider>
			)
			const linkElement = screen.getByRole("link")
			expect(linkElement).toHaveTextContent("Favoritpass")
			expect(linkElement.getAttribute("href")).toBe("/profile/favouriteWorkouts")
		})
	})
})

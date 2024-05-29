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
		test("should render component that has given ID -> 1", async () => {
			const author = {
				username: "authors name",
				userId: 2,
			}
			const list = {
				id: 1,
				name: "test list",
				size: 3,
				author: author,
				hidden: false,
			}

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
	})
})

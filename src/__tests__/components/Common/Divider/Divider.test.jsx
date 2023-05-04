import Divider from "../../../../components/Common/Divider/Divider"
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"}) 

describe("Divider", () => {
	describe("when initialized", () => {
		test("should display given text -> vecka 24", async() => {
			render(<Divider id = 'test' option= 'h1_center' title = 'vecka 24'/>)
			expect(screen.getByTestId("test")).toHaveTextContent("vecka 24")
		})

		test("should not contain other than given text-> vecka 24", async() => {
			render(<Divider id ='test' option= 'h1_center' title = 'vecka 24'/>)
			expect(screen.getByTestId("test")).not.toHaveTextContent("vecka 200")
		})
	})
})

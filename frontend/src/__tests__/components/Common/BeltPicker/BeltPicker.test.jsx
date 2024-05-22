//it.todo("Should render the correct belts when selected")
//it.todo("all tests need to be rewritten to work with inverted belts category")
import { render, screen, configure, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import BeltPicker from "../../../../components/Common/BeltPicker/BeltPicker"
import { rest } from "msw"
import { server } from "../../../server"
import React from "react"

const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

configure({ testIdAttribute: "id" })

/** Note: This test throws an error (controlled input to be uncontrolled) that does not show up when run in frontend, nor affects the logic. */

/**
 * Set up mock server to mock the api call to get all belts
 */
beforeEach(() => {
	// ARRANGE
	server.use(
		rest.get("http://localhost/api/belts", async (req, res, ctx) => {
			return res(ctx.status(200), ctx.json(
				[
					{
						id: 1,
						name: "Vitt",
						color: "FCFCFC",
						child: false,
						inverted: true
					},
					{
						id: 2,
						name: "Vitt",
						color: "BD3B41",
						child: true,
						inverted: false
					},
					{
						id: 3,
						name: "Svart",
						color: "BD3B41",
						child: true,
						inverted: false
					},
                    {
						id: 5,
						name: "Vitt",
						color: "FCFCFC",
						child: false,
						inverted: false
					},
                    {
						id: 6,
						name: "Svart",
						color: "BD3B41",
						child: false,
						inverted: false
					},
                    {
						id: 1,
						name: "Svart",
						color: "BD3B41",
						child: true,
						inverted: true
					},
				]
			))
		})
	)
})

describe("BeltPicker.jsx", () => {
	test("Should render child when one is given", async () => {
		render(<BeltPicker id={"1"} />)

		// ASSERT
		await waitFor(() => {
			expect(requestSpy).toHaveBeenCalled()
		})
		expect(screen.getByTestId("belt-text-Vitt")).toBeInTheDocument()
		expect(screen.getByTestId("belt-inverted-Vitt")).toBeInTheDocument()
		expect(screen.getByTestId("belt-child-Vitt")).toBeInTheDocument()
	})

	test("Should render two children when on render", async () => {
		render(<BeltPicker id={"1"} />)

		// ASSERT
		await waitFor(() => {
			expect(requestSpy).toHaveBeenCalled()
		})
		await waitFor(() => {
			expect(screen.getByTestId("belt-text-Vitt")).toBeInTheDocument()
		})
		expect(screen.getByTestId("belt-adult-Vitt")).toBeInTheDocument()
		expect(screen.getByTestId("belt-child-Vitt")).toBeInTheDocument()
		expect(screen.getByTestId("belt-text-Svart")).toBeInTheDocument()
		expect(screen.getByTestId("belt-adult-Svart")).toBeInTheDocument()
		expect(screen.getByTestId("belt-child-Svart")).toBeInTheDocument()
	})
    
	/**
     * Beltpicker can not be tested further since it requires both a mock of the 
     * api call and a mock of the onToggle function, which is not possible to do
     * at the same time
     */
})
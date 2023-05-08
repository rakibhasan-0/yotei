import { render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import BeltBox from "../../../components/Plan/BeltBox"
import React from "react"



configure({testIdAttribute:"id"})

describe("BeltBox.jsx", () => {
	describe("When initialized", () => {
		test("component has given ID -> 1", async() => {

			var incomingBelts = [{
				"id": "1",
				"color": "#00BE08",
				"is_child": false
			}]

			render(<BeltBox id ="1" width="35" height="320" belts = {incomingBelts}/>)
			expect(screen.getByTestId("1")).toHaveAttribute("id", "1")
		})
	})
})

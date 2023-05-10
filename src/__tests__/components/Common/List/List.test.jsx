import React from "react"
import { render, screen, configure } from "@testing-library/react"
import List from "../../../../components/Common/List/Component"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

test("List: Creating an empty list should add no element to the list", async() => {
	// ARRANGE
	render(<div><List id={"testList"}></List></div>)

	// ACT
	// *cricket sound*
	
	// ASSERT
	expect(screen.getByTestId("testList-children").hasChildNodes()).toEqual(false)
})

test("List: Creating a child should add a child to the list", async() => {
	// ARRANGE
	render(<div><List id={"testList"}><div value="hello"></div> </List></div>)

	// ACT
	// *cricket sound*

	
	// ASSERT
	expect(screen.getByTestId("testList-children").hasChildNodes()).toEqual(true)
})

test("List: Creating two children without clicking should not show any children", async() => {
	// ARRANGE
	render(<div><List id={"testList"}><p>testText1</p><p>testText2</p></List></div>)

	// ACT
	// *cricket sound*
	
	// ASSERT
	expect(screen.getByText("testText1")).toBeInTheDocument(false)
	expect(screen.getByText("testText2")).toBeInTheDocument(false)
})

test("List: Creating two children and clicking should show both children", async() => {
	// ARRANGE
	render(<div><List id={"testList"}><p>testText1</p><p>testText2</p></List></div>)

	// ACT
	screen.getByTestId("testList-children").click()
	
	// ASSERT
	expect(screen.getByText("testText1")).toBeInTheDocument(true)
	expect(screen.getByText("testText2")).toBeInTheDocument(true)
})
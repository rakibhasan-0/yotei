/* eslint-disable linebreak-style */
import { render, screen, configure, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import GradingDeviationContainer from "../../../pages/Grading/GradingDeviationContainer"
import { BrowserRouter } from "react-router-dom"
import React from "react"

/**
 * The grading deviation container page.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-08
 */

configure({testIdAttribute: "id"})

describe("Invalid input", () => {
	test("Should render placeholder if invalid ID", () => {
		const { container } = render(<BrowserRouter><GradingDeviationContainer/></BrowserRouter>)
		const innerHtml = container.innerHTML
		expect(innerHtml).toEqual(expect.stringContaining("Kunde inte ladda in tillfället"))
	})
})

describe("Render test", () => {
	var name = "Test 123"
	var id = 1
	var passed = true
	var comment = "This is a test comment"

	test("Should render id if there is one", () => {
		render(
			<BrowserRouter>
				<GradingDeviationContainer
					id={id}
					name={name}
					passed={passed}
					comment={comment}
				/>
			</BrowserRouter>
		)
		expect(screen.getByTestId(1)).toHaveTextContent(id, 1)
	})

	test("Should render container with correct id", () => {
		render(
			<BrowserRouter>
				<GradingDeviationContainer
					id={id}
					name={name}
					passed={passed}
					comment={comment}
				/>
			</BrowserRouter>
		)
		expect(screen.getByTestId(`${id}-header`)).toBeDefined()
	})

	test("Should render technique name if technique name exists", () => {
		render(
			<BrowserRouter>
				<GradingDeviationContainer
					id={id}
					name={name}
					passed={passed}
					comment={comment}
				/>
			</BrowserRouter>
		)
		expect(screen.getByText(name)).toBeInTheDocument()
	})

	test("Should render comment if comment exists", () => {
		render(
			<BrowserRouter>
				<GradingDeviationContainer
					id={id}
					name={name}
					passed={passed}
					comment={comment}
				/>
			</BrowserRouter>
		)
		expect(screen.getByTestId("commentDisplay")).toHaveTextContent(comment)
	})

	test("Should render no comment if no comment entered", () => {
		render(
			<BrowserRouter>
			<GradingDeviationContainer
				id={id}
				name={name}
				passed={passed}
			/>
			</BrowserRouter>
		)
		expect(screen.queryByTestId("commentDisplay")).not.toBeDefined
	})

	test("Should render paircomment if paircomment exists", () => {
		render(
			<BrowserRouter>
				<GradingDeviationContainer
					id={id}
					name={name}
					passed={passed}
					pairComment={comment}
				/>
			</BrowserRouter>
		)
		expect(screen.getByTestId("commentPairDisplay")).toHaveTextContent(comment)
	})

	test("Should render no pair comment if no pair comment entered", () => {
		render(
			<BrowserRouter>
			<GradingDeviationContainer
				id={id}
				name={name}
				passed={passed}
			/>
			</BrowserRouter>
		)
		expect(screen.queryByTestId("commentPairDisplay")).not.toBeDefined
	})

	test("Should render general comment if general comment exists", () => {
		render(
			<BrowserRouter>
				<GradingDeviationContainer
					id={id}
					name={name}
					passed={passed}
					generalComment={comment}
				/>
			</BrowserRouter>
		)
		expect(screen.getByTestId("commentGeneralDisplay")).toHaveTextContent(comment)
	})

	test("Should render no general comment if no general comment entered", () => {
		render(
			<BrowserRouter>
			<GradingDeviationContainer
				id={id}
				name={name}
				passed={passed}
			/>
			</BrowserRouter>
		)
		expect(screen.queryByTestId("commentGeneralDisplay")).not.toBeDefined
	})
})



describe("When interacted with", () => {
	var name = "Test 123"
	var id = 1
	var passed = true
	var comment = "This is a test comment"

	test("Should toggle comment container on/off when clicking header", () => {
		render(<BrowserRouter><GradingDeviationContainer id = {1} name = {name} passed = {passed} comment = {comment}/></BrowserRouter>)
		
		expect(screen.getByTestId(`${id}-children`)).not.toBeVisible()
		fireEvent.click(screen.getByTestId(`${id}-clickable`))
		expect(screen.getByTestId(`${id}-children`)).toBeVisible()
		fireEvent.click(screen.getByTestId(`${id}-clickable`))
		expect(screen.getByTestId(`${id}-children`)).not.toBeVisible()
	}) 
})
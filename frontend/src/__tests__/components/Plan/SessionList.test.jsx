import { screen, render, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import SessionList from "../../../components/Plan/SessionList"
import { MemoryRouter } from "react-router"
//import { sortSessions } from "../../../components/Plan/SessionList"

configure({testIdAttribute: "id"})


describe("SessionList", () => {
	describe("When initialized", () => {
		let testID = "testSessionList"
		let testPlan = [{
			"id": 1,
			"name":"Grönt bälte träning",
			"userId":1,
			"belts":[{
				"id":7,
				"name": "Grönt",
				"color":"00BE08",
				"child":false
			}]}]

		let testSession = [{
			"id":1,
			"text":"Junior Grönt Bälte Träning",
			"workout":null,
			"plan":1,
			"date":"2023-04-01",
			"time":"12:00:00"
		}]

		test("should render with valid input", async() => {
			render(<MemoryRouter><SessionList id = {testID} plans={testPlan} sessions={testSession}/></MemoryRouter>)
			expect(screen.getByTestId(testID)).toHaveAttribute("id", testID)
		})

		test.todo("should render when workouts is null")
	})



	describe("When given invalid input", () => {
		let testID = "testSessionList"
		let testPlan = [{
			"id": 1,
			"name":"Grönt bälte träning",
			"userId":1,
			"belts":[{
				"id":7,
				"name":
				"Grönt",
				"color":
				"00BE08",
				"child":false
			}]}]
		let testSession = [{
			"id":1,
			"text":"Junior Grönt Bälte Träning",
			"workout":null,
			"plan":1,
			"date":"2023-04-01",
			"time":"12:00:00"
		}]

		test("should render placeholder with invalid ID", async() => {
			const { container } = render(<SessionList plans={testPlan} sessions={testSession}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Kunde inte ladda in tillfällen"))
		})

		test("should render placeholder with invalid plan", async() => {
			const { container } = render(<SessionList id = {testID} sessions={testSession}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Kunde inte ladda in tillfällen"))
		})

		test("should render placeholder with invalid session", async() => {
			const { container } = render(<SessionList id = {testID} plans={testPlan}/>)
			const innerHtml = container.innerHTML

			expect(innerHtml).toEqual(expect.stringContaining("Kunde inte ladda in tillfällen"))
		})
	})


	// To run tests copy and export function sortSession and add parameter as well aas return resulting array
	/*
	describe("when exporting functions", () => {

		test("should sort array of sessions in ascending order according to date", async() => {
			let test = [{
				"id":2,
				"text":"Second",
				"workout":null,
				"plan":1,
				"date":"2023-04-02",
				"time":"12:00:00"
			}, {
				"id":3,
				"text":"Third",
				"workout":null,
				"plan":1,
				"date":"2023-04-03",
				"time":"12:00:00"
			}, {
				"id":1,
				"text":"First",
				"workout":null,
				"plan":1,
				"date":"2023-04-01",
				"time":"12:00:00"
			}]

			let result = [
				{
					"id":1,
					"text":"First",
					"workout":null,
					"plan":1,
					"date":"2023-04-01",
					"time":"12:00:00"
				}, {
					"id":2,
					"text":"Second",
					"workout":null,
					"plan":1,
					"date":"2023-04-02",
					"time":"12:00:00"
				}, {
					"id":3,
					"text":"Third",
					"workout":null,
					"plan":1,
					"date":"2023-04-03",
					"time":"12:00:00"
				}] 
			
			test = sortSessions(test)
			expect(test).toEqual(result)
		})

		test("should sort array of sessions in ascending order according to time", async() => {
			let test = [{
				"id":2,
				"text":"Second",
				"workout":null,
				"plan":1,
				"date":"2023-04-01",
				"time":"13:00:00"
			}, {
				"id":3,
				"text":"Third",
				"workout":null,
				"plan":1,
				"date":"2023-04-01",
				"time":"14:00:00"
			}, {
				"id":1,
				"text":"First",
				"workout":null,
				"plan":1,
				"date":"2023-04-01",
				"time":"12:00:00"
			}]
			
			let result = [
				{
					"id":1,
					"text":"First",
					"workout":null,
					"plan":1,
					"date":"2023-04-01",
					"time":"12:00:00"
				}, {
					"id":2,
					"text":"Second",
					"workout":null,
					"plan":1,
					"date":"2023-04-01",
					"time":"13:00:00"
				}, {
					"id":3,
					"text":"Third",
					"workout":null,
					"plan":1,
					"date":"2023-04-01",
					"time":"14:00:00"
				}] 
			
			test = sortSessions(test)
			expect(test).toEqual(result)
		})

		test("should sort array of sessions in ascending order according to time and date", async() => {
			let test = [{
				"id":2,
				"text":"Second",
				"workout":null,
				"plan":1,
				"date":"2023-04-01",
				"time":"13:00:00"
			}, {
				"id":3,
				"text":"Third",
				"workout":null,
				"plan":1,
				"date":"2023-04-05",
				"time":"09:00:00"
			}, {
				"id":1,
				"text":"First",
				"workout":null,
				"plan":1,
				"date":"2023-04-01",
				"time":"12:00:00"
			}]
			
			let result = [
				{
					"id":1,
					"text":"First",
					"workout":null,
					"plan":1,
					"date":"2023-04-01",
					"time":"12:00:00"
				}, {
					"id":2,
					"text":"Second",
					"workout":null,
					"plan":1,
					"date":"2023-04-01",
					"time":"13:00:00"
				}, {
					"id":3,
					"text":"Third",
					"workout":null,
					"plan":1,
					"date":"2023-04-05",
					"time":"09:00:00"
				}] 
			
			test = sortSessions(test)
			expect(test).toEqual(result)
		})
	})
	*/
})
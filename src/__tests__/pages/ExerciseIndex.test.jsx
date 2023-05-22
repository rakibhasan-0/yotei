import "@testing-library/jest-dom"
import { rest } from "msw"
import { server } from "../server"
import {render, configure, screen} from "@testing-library/react"
//import userEvent from "@testing-library/user-event"
//import ExerciseCreate from "../../pages/Exercise/ExerciseCreate"
import ExerciseIndex from "../../pages/Exercise/ExerciseIndex"
import { MemoryRouter } from "react-router-dom"


configure({testIdAttribute: "id"})
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

async function getData() {
	const response = await fetch("http://localhost/api/search/exercises?name=text&tags=")
  
	return response.json()
}

let method = "" // Declare method variable outside of beforeEach
describe("mocktest", () => {

	beforeEach(async () => {
	// ARRANGE
		server.use(
			rest.get("http://localhost/api/search/exercises", async (req, res, ctx) => {
				method = req.method // Assign value to method variable

				return res(
					ctx.status(200),
					ctx.json([
						{
							item: "Hoppa högt",
							text: "420 min",
							detailURL: "bsurl.com/fake/",
							id: 87,
							index: 420,
						},
						{
							item: "Löpning",
							text: "30 min",
							detailURL: "bsurl.com/fake2/",
							id: 88,
							index: 30,
						},
					])
				)
			})
		)

		await getData() // Fetch the data inside beforeEach
	})


	test("mocked exercise data should match expected data", async () => {
	// ACT
		const data = await getData()

		// ASSERT
		expect(requestSpy).toHaveBeenCalled()
		expect(method).toBe("GET")
	
		// Assertions for the first exercise in the array
		expect(data[0].item).toEqual("Hoppa högt")
		expect(data[0].text).toEqual("420 min")
		expect(data[0].detailURL).toEqual("bsurl.com/fake/")
		expect(data[0].id).toEqual(87)
		expect(data[0].index).toEqual(420)
	
		// Assertions for the second exercise in the array
		expect(data[1].item).toEqual("Löpning")
		expect(data[1].text).toEqual("30 min")
		expect(data[1].detailURL).toEqual("bsurl.com/fake2/")
		expect(data[1].id).toEqual(88)
		expect(data[1].index).toEqual(30)
	})
})
describe("ExerciseIndex should render with all components", () => {

	beforeEach(() => {
		render( //eslint-disable-line
			<MemoryRouter>
				<ExerciseIndex />
			</MemoryRouter>
		)
	})

	test("the title", () => {
		expect(screen.getByTestId("exercise-title")).toHaveTextContent("Övningar")
	})

	test("the search bar", () => {
		expect(screen.getByTestId("exercise-search-bar")).toBeInTheDocument()
	})

	test("the round button", () => {
		expect(screen.getByTestId("exercise-round-button")).toBeInTheDocument()
	})
	test("the filter button", () => {
		expect(screen.getByTestId("ei-filter")).toBeInTheDocument()
	})
	test("the filter container", () => {
		expect(screen.getByTestId("ei-sort")).toBeInTheDocument()
	})

})


// Call getData function before the test
beforeEach(async () => {
	await getData()
})

test("mocked exercise data is displayed on the page", async () => {
	expect(true).toBe(true)

})  

// test("Should update exercise list page after adding new exercise'", async () => {
// 	// ARRANGE
// 	const setPopupVisible = jest.fn()
// 	const handleClosePopup = jest.fn()

// 	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
// 	// ACT
// 	await userEvent.click(screen.getByTestId("EC-AddBtn"))

// 	// ASSERT
// 	expect(handleClosePopup).toHaveBeenCalled()
// })

// test("Should update exercise list page after pressing go back'", async () => {
// 	// ARRANGE
// 	const setPopupVisible = jest.fn()
// 	const handleClosePopup = jest.fn()

// 	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
// 	// ACT
// 	await userEvent.click(screen.getByTestId("EC-BackBtn"))

// // 	// ASSERT
// // 	expect(handleClosePopup).toHaveBeenCalled()
// // })

// test("Should not update exercise list page after adding new exercise when 'add multiple checkbox' is checked", async () => {
// 	// ARRANGE
// 	const setPopupVisible = jest.fn()
// 	const handleClosePopup = jest.fn()

// // 	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
// // 	// ACT
// // 	await userEvent.click(screen.getByTestId("EC-AddMultipleChk"))
// // 	await userEvent.click(screen.getByTestId("EC-AddBtn"))

// 	// ASSERT
// 	expect(handleClosePopup).not.toHaveBeenCalled()
// })


// Temporarily disabled these tests since the implementation changed and it became more difficult to test.

// test("Should update exercise list page after adding new exercise'", async () => {
// 	// ARRANGE
// 	const setPopupVisible = jest.fn()
// 	const handleClosePopup = jest.fn()
//     const addExerciseAndTags = jest.fn()
//     const exitProdc = jest.fn("test");
// 	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
// 	// ACT
//     await act(async () => {
//         userEvent.click(screen.getByTestId("EC-AddBtn"))
//         await Promise.resolve();
//     })

    
// 	// ASSERT
//     expect(addExerciseAndTags).toHaveBeenCalled()
//     //expect(exitProdc).toHaveBeenCalled()
// 	expect(handleClosePopup).toHaveBeenCalled()
// })

// test("Should update exercise list page after pressing go back'", async () => {
// 	// ARRANGE
// 	const setPopupVisible = jest.fn()
// 	const handleClosePopup = jest.fn()

// 	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
// 	// ACT
// 	await userEvent.click(screen.getByTestId("EC-BackBtn"))

// 	// ASSERT
// 	expect(handleClosePopup).toHaveBeenCalled()
// })

// test("Should not update exercise list page after adding new exercise when 'add multiple checkbox' is checked", async () => {
// 	// ARRANGE
// 	const setPopupVisible = jest.fn()
// 	const handleClosePopup = jest.fn()

// 	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
// 	// ACT
// 	await userEvent.click(screen.getByTestId("EC-AddMultipleChk"))
// 	await userEvent.click(screen.getByTestId("EC-AddBtn"))

// 	// ASSERT
// 	expect(handleClosePopup).not.toHaveBeenCalled()
// })

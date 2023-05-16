import "@testing-library/jest-dom"
import { rest } from "msw"
import { server } from "../server"
import {render, configure, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ExerciseCreate from "../../pages/Exercise/ExerciseCreate"

configure({testIdAttribute: "id"})
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

async function getData( ){
	const response = await fetch("http://localhost/api/exercises/all")
    
	return response.json()
}

test("mocked exercise data should match expected data", async() => {

	// ARRANGE
	var method = ""
	server.use(
		rest.all("http://localhost/api/exercises/all", async (req, res, ctx) => {
			method = req.method
        
			return res(ctx.status(200), ctx.json({
				item: "Hoppa högt",
				text: "420 min",
				children: "Fall på fötterna.",
				detailURL: "bsurl.com/fake/",
				id: 87,
				index: 420
			}))
		})
	)

	// ACT
	const data = await getData()
    
	// ASSERT
	expect(requestSpy).toHaveBeenCalled()
	expect(method).toBe("GET")
	expect(data.item).toEqual("Hoppa högt")
	expect(data.text).toEqual("420 min")
	expect(data.detailURL).toEqual("bsurl.com/fake/")
	expect(data.id).toEqual(87)
	expect(data.index).toEqual(420)
})

test("Should update exercise list page after adding new exercise'", async () => {
	// ARRANGE
	const setPopupVisible = jest.fn()
	const handleClosePopup = jest.fn()

	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
	// ACT
	await userEvent.click(screen.getByTestId("EC-AddBtn"))

	// ASSERT
	expect(handleClosePopup).toHaveBeenCalled()
})

test("Should update exercise list page after pressing go back'", async () => {
	// ARRANGE
	const setPopupVisible = jest.fn()
	const handleClosePopup = jest.fn()

	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
	// ACT
	await userEvent.click(screen.getByTestId("EC-BackBtn"))

	// ASSERT
	expect(handleClosePopup).toHaveBeenCalled()
})

test("Should not update exercise list page after adding new exercise when 'add multiple checkbox' is checked", async () => {
	// ARRANGE
	const setPopupVisible = jest.fn()
	const handleClosePopup = jest.fn()

	render(<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>)
	// ACT
	await userEvent.click(screen.getByTestId("EC-AddMultipleChk"))
	await userEvent.click(screen.getByTestId("EC-AddBtn"))

	// ASSERT
	expect(handleClosePopup).not.toHaveBeenCalled()
})

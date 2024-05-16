/** @jest-environment jsdom */
import React from "react"
import { configure, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UploadMedia from "../../../components/Upload/UploadMedia"
import "@testing-library/jest-dom"

// Required for MSW mocking of API responses.
import { rest } from "msw"
import { server } from "../../server"
import { ToastContainer, toast } from "react-toastify"
const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

configure({testIdAttribute: "id"})

test("Link upload should call provided function", async() => {
	// ARRANGE
	var val
	const testFnc = jest.fn((data) => {val = data})
	render(<UploadMedia id={"uploadMedia"} fetchMediaMetaToBeUploaded={testFnc}/>)
	
	// ACT
	const user = userEvent.setup()
	
	const linkInput = screen.getByPlaceholderText(/klistra in länk/i)
	const linkUpload = screen.getByRole("button", {name: /länka till media/i})

	await user.type(linkInput, "test")
	await user.click(linkUpload)
	
	// ASSERT
	expect(testFnc).toHaveBeenCalledTimes(1)
	expect(val.url).toEqual("test")
})



test("Choose file should choose a file", async () => {
	render(<UploadMedia id={"uploadMedia"} />)
	let file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })

	// get the choose-file button
	let fileChooser = screen.getByTestId("choose-file")

	// ACT
	// simulate choose-file event and wait until finish
	const user = userEvent.setup()
	await user.upload(fileChooser, file)	

	// ASSERT
	// get the same uploader from the dom
	let image = screen.getByTestId("choose-file")

	// check if the file is there
	//expect(image.files[0].name).toBe("chucknorris.png")
	expect(image.files).toHaveLength(1)
})

test("Uploading a file should call upload-API", async () => {
	render(<UploadMedia id={"uploadMedia"} />)
	let file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })

	// get the choose-file button
	let fileChooser = screen.getByTestId("choose-file")

	// ACT
	// simulate choose-file event and wait until finish
	const user = userEvent.setup()
	user.upload(fileChooser, file)	

	//Click upload
	let uploadButton = screen.getByTestId("upload-file-button")
	await user.click(uploadButton)

	// ASSERT
	// check if an upload was made
	expect(requestSpy).toHaveBeenCalledTimes(1)
})


test("Uploading a file should call functions", async () => {
	var val
	let movementId = 2
	let filename = "chucknorris.png"
	let file = new File(["(⌐□_□)"], filename, { type: "image/png" })
	let mediaMeta = {description: "", image:true, localStorage: true, movementId: movementId, url:"/api/media/files/"+filename}
	const testFnc1 = jest.fn()
	const testFnc2 = jest.fn((data) => {val = data})
	server.use(
		rest.post("http://localhost/api/media/upload", async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json({
					filename: filename,
				})
			)
		})
	)
	render(<UploadMedia id={"uploadMedia"} fetchMediaFilesThatWasUploaded={testFnc1} fetchMediaMetaToBeUploaded={testFnc2} exerciseId={movementId}/>)

	// get the choose-file button
	let fileChooser = screen.getByTestId("choose-file")

	// ACT
	// simulate choose-file event and wait until finish
	const user = userEvent.setup()
	user.upload(fileChooser, file)
	
	//Click upload
	let uploadButton = screen.getByTestId("upload-file-button")
	await user.click(uploadButton)

	// ASSERT
	// check if Fetch-functions to parent was called + check that correct data was sent
	expect(testFnc1).toHaveBeenCalledTimes(1)
	expect(val).toEqual(mediaMeta)
	expect(testFnc2).toHaveBeenCalledTimes(1)
})

test("Retreiving error-status when uploading file should display error-toast", async () => {
	let errorMsg ="you got an error please"
	const testFnc = jest.fn()
	render(<div><UploadMedia id={"uploadMedia"}  fetchMediaFilesThatWasUploaded={testFnc} fetchMediaMetaToBeUploaded={testFnc}/><ToastContainer></ToastContainer></div>)
	let file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })
	//Clear all toasts
	toast.dismiss()
	server.use(
		rest.post("http://localhost/api/media/upload", async (req, res, ctx) => {
			return res(
				ctx.status(500),
				ctx.json(errorMsg)
			)
		})
	)

	// get the choose-file button
	let fileChooser = screen.getByTestId("choose-file")

	// ACT
	// simulate choose-file event and wait until finish
	const user = userEvent.setup()
	user.upload(fileChooser, file)

	//Click upload
	let uploadButton = screen.getByTestId("upload-file-button")
	await user.click(uploadButton)

	// ASSERT
	// check that error-toast is shown
	expect(await screen.findByText("\""+errorMsg+"\"")).toBeInTheDocument()
})


/** @jest-environment jsdom */
import React from "react"
import { configure, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UploadMedia from "../../../components/Upload/UploadMedia"
import "@testing-library/jest-dom"
//import { rest } from "msw"
import { server } from "../../server"

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
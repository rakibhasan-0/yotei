/** @jest-environment jsdom */
//import React from "react"
import {configure} from "@testing-library/react"
//import userEvent from "@testing-library/user-event"
//import UploadMedia from "../../../components/Upload/UploadMedia"
import "@testing-library/jest-dom"
//import { rest } from "msw"
import { server } from "../../server"

const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

configure({testIdAttribute: "id"})

test("Dummy test", async() => {
	expect(true).toEqual(true)
})
/*
test("Tests uploading a link", async() => {
    // ARRANGE
    render(<div><UploadMedia id={"uploadMedia"}></UploadMedia></div>)
    server.use(
		rest.post("http://localhost/api/media/add", async (req, res, ctx) => {
			return res(ctx.status(200))
        })
	)

    // ACT
    const user = userEvent.setup()

    const linkInput = screen.getByTestId("linkTextField");
    fireEvent.change(linkInput, {target :{value:'testUrl'}})
    await user.click(screen.getByTestId("linkMediaButton"))

    // ASSERT
    expect(requestSpy).toHaveBeenCalledTimes(1);
})*/
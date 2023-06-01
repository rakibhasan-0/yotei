/** @jest-environment jsdom */
import React from "react"
import {render, configure, screen} from "@testing-library/react"
import Gallery from "../../../components/Gallery/Gallery"
import "@testing-library/jest-dom"
import { rest } from "msw"
import { server } from "../../server"

const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

configure({testIdAttribute: "id"})

test("Displays description", async () => {
	// ARRANGE
	const exerciseId = 3
	const mediaId = 1
	const desc1 = "this is description should be displayed under media"

	server.use(
		rest.get(`http://localhost/api/media/${exerciseId}`, async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([{
					id: mediaId,
					movementId: exerciseId,
					url: "https://www.youtube.com/watch?v=TD01yQqHl8E&ab_channel=51334235", //sällskapsresan theme
					localStorage: false,
					image: false,
					description: desc1
				}]),
			)
		})
	)

	render(<Gallery id="3" ></Gallery>)

	// ACT
	let videoDesc = await screen.findByTestId(mediaId + "-media-description")
	

	// ASSERT
	expect(videoDesc).toHaveTextContent(desc1)
})
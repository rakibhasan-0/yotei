/** @jest-environment jsdom */
import React from "react"
import {render, configure, screen} from "@testing-library/react"
import EditGallery from "../../../components/Gallery/EditGallery"
import "@testing-library/jest-dom"
import { rest } from "msw"
import { server } from "../../server"
import userEvent from "@testing-library/user-event"

const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

configure({testIdAttribute: "id"})

// test("Upload-page for correct exercise/technique comes up when clicking +", async () => {

// 	// ARRANGE
// 	const exerciseId = 3
// 	render(<EditGallery id="edit-gallery" exerciseId={exerciseId}></EditGallery>)

// 	// ACT
// 	const user = userEvent.setup()
// 	await user.click(screen.getByTestId("add-media-button"))
// 	let UploadPage = screen.getByTestId(exerciseId + "-upload-page")
// 	let UploadPopup = screen.getByTestId(exerciseId + "-upload-popup")

// 	// ASSERT
// 	expect(UploadPage).toBeDefined()
// 	expect(UploadPopup).toBeDefined()
// })

test("NoMediaBox appears when no media is avaliable", async () => {
	// ARRANGE
	const exerciseId = 3
	render(<EditGallery id="edit-gallery" exerciseId={exerciseId}></EditGallery>)

	// ACT
	let NoMediaBox = screen.getByTestId("no-media-box")

	// ASSERT
	expect(NoMediaBox).toBeDefined()
})

test("Video appears if one media avaliable", async () => {
	// ARRANGE
	const exerciseId = 3
	const mediaId = 1
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
					description: "test-description"
				}]),
			)
		})
	)
	render(<EditGallery id="edit-gallery" exerciseId={exerciseId}></EditGallery>)

	// ACT
	let VideoPlayer = await screen.findByTestId(`${mediaId}-video-player`)

	// ASSERT
	expect(VideoPlayer).toBeDefined()
})

test("Second video appears if two media avaliable", async () => {
	// ARRANGE
	const exerciseId = 3
	const mediaId1 = 1
	const mediaId2 = 4
	server.use(
		rest.get(`http://localhost/api/media/${exerciseId}`, async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{
						id: mediaId1,
						movementId: exerciseId,
						url: "https://www.youtube.com/watch?v=TD01yQqHl8E&ab_channel=51334235", //sällskapsresan theme
						localStorage: false,
						image: false,
						description: "test-description"
					},
					{
						id: mediaId2,
						movementId: exerciseId,
						url: "https://www.youtube.com/watch?v=TD01yQqHl8E&ab_channel=51334235", //sällskapsresan theme
						localStorage: false,
						image: false,
						description: "test-description"
					}
				]),
			)
		})
	)
	render(<EditGallery id="edit-gallery" exerciseId={exerciseId}></EditGallery>)

	// ACT
	let VideoPlayer2 = await screen.findByTestId(`${mediaId2}-video-player`)

	// ASSERT
	expect(VideoPlayer2).toBeDefined()
})

test("Image appears if avaliable", async () => {
	// ARRANGE
	const exerciseId = 3
	const mediaId = 1
	server.use(
		rest.get(`http://localhost/api/media/${exerciseId}`, async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{
						id: mediaId,
						movementId: exerciseId,
						url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Peppa_Pig_logo.svg/1200px-Peppa_Pig_logo.svg.png", // peppa pig
						localStorage: false,
						image: true,
						description: "test-description"
					}
				]),
			)
		})
	)
	render(<EditGallery id="edit-gallery" exerciseId={exerciseId}></EditGallery>)

	// ACT
	let Image = await screen.findByTestId(`${mediaId}-image`)

	// ASSERT
	expect(Image).toBeDefined()
})




test("Correct trash bin button appears when video is avaliable", async () => {
	// ARRANGE
	const exerciseId = 3
	const mediaId = 1
	server.use(
		rest.get(`http://localhost/api/media/${exerciseId}`, async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([{
					id: mediaId,
					movementId: exerciseId,
					url: "test.url",
					localStorage: false,
					image: false,
					description: "test-description"
				}]),
			)
		})
	)
	render(<EditGallery id="edit-gallery" exerciseId={exerciseId}></EditGallery>)

	// ACT
	let trashButton = await screen.findByTestId(mediaId + "-removal-button")

	// ASSERT
	expect(trashButton).toBeDefined()
})

test("Confirm removal popup with correct id comes up when clicking remove on video", async () => {
	// ARRANGE
	const exerciseId = 3
	const mediaId = 1
	server.use(
		rest.get(`http://localhost/api/media/${exerciseId}`, async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([{
					id: mediaId,
					movementId: exerciseId,
					url: "test.url",
					localStorage: false,
					image: false,
					description: "test-description"
				}]),
			)
		})
	)
	render(<EditGallery id="edit-gallery" exerciseId={exerciseId}></EditGallery>)

	// ACT
	const user = userEvent.setup()
	await user.click(await screen.findByTestId(mediaId + "-removal-button"))
	let ConfirmPopup = await screen.findByTestId("confirm-remove-popup")

	// ASSERT
	expect(ConfirmPopup).toBeDefined()
})



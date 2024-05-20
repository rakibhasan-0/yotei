/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AccountContext } from "../../../../context"
import "@testing-library/jest-dom"
import { Route, createMemoryRouter, createRoutesFromElements, RouterProvider } from "react-router"

import { rest } from "msw"
import { server } from "../../../server"
import WorkoutEdit from "../../../../pages/Workout/WorkoutEdit"
import WorkoutView from "../../../../pages/Workout/WorkoutView/WorkoutView"
import { USER_PERMISSION_CODES, USER_PERMISSION_LIST_ALL } from "../../../../utils"

/**
 * Tests for the workout edit page
 * 
 * @author Kiwi, Team Mango
 * @version 1.0
 * @since 2024-04-23
 * Updates. 2024-05-20: Added permissions to user to fix a test by giving it all permissions.
 */

const api = jest.fn()
server.events.on("request:start", api)

configure({testIdAttribute: "id"})

describe("WorkoutEdit", () => {
	let user
	let workout
	let user_query

	beforeEach(() => {
		user = userEvent.setup()

		workout = 
		{
			"id": 1,
			"name": "Basic Judo Throws",
			"description": "This Judo workout focuses on practicing basic throws such as the hip throw, shoulder throw, and foot sweep. It includes both solo and partner drills to improve technique and timing.",
			"duration": 90,
			"created": "2023-04-29",
			"changed": "2023-05-02",
			"date": "2023-04-29T22:00:00.000+00:00",
			"hidden": false,
			"author": {
				"user_id": 1,
				"username": "admin"
			},
			"activityCategories": [
				{
					"categoryName": "Träning",
					"categoryOrder": 2,
					"activities": [
						{
							"id": 3,
							"exercise": null,
							"technique": {
								"id": 7,
								"name": "Uki otoshi, mot grepp i ärmen, ude henkan gatame (1 Kyu)",
								"description": "",
								"belts": [
									{
										"id": 11,
										"name": "Brunt",
										"color": "83530C",
										"child": false
									}
								],
								"tags": [
									{
										"id": 49,
										"name": "säkerhetstekniker"
									},
									{
										"id": 42,
										"name": "rörelsetekniker"
									},
									{
										"id": 58,
										"name": "strypningstekniker"
									}
								]
							},
							"text": "Empi uchi i 15 minuter",
							"name": "Empi uchi träning",
							"duration": 15,
							"order": 1
						},
						{
							"id": 4,
							"exercise": null,
							"technique": {
								"id": 8,
								"name": "Ude hiza osae gatame (1 Kyu)",
								"description": "",
								"belts": [
									{
										"id": 11,
										"name": "Brunt",
										"color": "83530C",
										"child": false
									}
								],
								"tags": [
									{
										"id": 1,
										"name": "kihon waza"
									},
									{
										"id": 90,
										"name": "utbyte och sammanföring av tekniker"
									},
									{
										"id": 14,
										"name": "nage waza"
									}
								]
							},
							"text": "Waki gatame i 5 minuter",
							"name": "Waki gatame träning",
							"duration": 5,
							"order": 2
						},
						{
							"id": 5,
							"exercise": null,
							"technique": {
								"id": 8,
								"name": "Ude hiza osae gatame (1 Kyu)",
								"description": "",
								"belts": [
									{
										"id": 11,
										"name": "Brunt",
										"color": "83530C",
										"child": false
									}
								],
								"tags": [
									{
										"id": 1,
										"name": "kihon waza"
									},
									{
										"id": 90,
										"name": "utbyte och sammanföring av tekniker"
									},
									{
										"id": 14,
										"name": "nage waza"
									}
								]
							},
							"text": "Waki gatame i 7 minuter",
							"name": "Waki gatame träning",
							"duration": 7,
							"order": 3
						}
					]
				},
				{
					"categoryName": "Uppvärmning",
					"categoryOrder": 1,
					"activities": [
						{
							"id": 2,
							"exercise": {
								"id": 286,
								"name": "Burpees",
								"description": "Börja ståendes, gör en armhävning, hoppa upp och klappa händerna över huvudet!",
								"duration": 30
							},
							"technique": null,
							"text": "Burpees i 5 minuter",
							"name": "Uppvärmning Burpees",
							"duration": 5,
							"order": 2
						},
						{
							"id": 1,
							"exercise": {
								"id": 285,
								"name": "Springa",
								"description": "Placera ena foten framför den andra och upprepa!",
								"duration": 10
							},
							"technique": null,
							"text": "Springa i 10 minuter",
							"name": "Uppvärmning Springa",
							"duration": 10,
							"order": 1
						}
					]
				},
				{
					"categoryName": "Avslut",
					"categoryOrder": 3,
					"activities": [
						{
							"id": 6,
							"exercise": null,
							"technique": {
								"id": 8,
								"name": "Ude hiza osae gatame (1 Kyu)",
								"description": "",
								"belts": [
									{
										"id": 11,
										"name": "Brunt",
										"color": "83530C",
										"child": false
									}
								],
								"tags": [
									{
										"id": 1,
										"name": "kihon waza"
									},
									{
										"id": 90,
										"name": "utbyte och sammanföring av tekniker"
									},
									{
										"id": 14,
										"name": "nage waza"
									}
								]
							},
							"text": "Avsluta med Waki gatame i 15 minuter",
							"name": "Waki gatame träning",
							"duration": 15,
							"order": 4
						}
					]
				}
			],
			"tags": [
				{
					"id": 24,
					"name": "uke waza"
				},
				{
					"id": 25,
					"name": "judo"
				}
			]
		}
		
		user_query = 
		{
			"results": [
				{
					"userId": 1,
					"name": "admin",
					"role": "ADMIN"
				},
				{
					"userId": 2,
					"name": "editor",
					"role": "EDITOR"
				},
				{
					"userId": 3,
					"name": "user",
					"role": "USER"
				}
			],
			"tagCompletion": []
		}

		server.use(
			rest.get("/api/workouts/detail/1", (req, res, ctx) => {
				return res(
					ctx.json(workout),
					ctx.status(200)
				)
			}),
			rest.get("api/search/users?name=", (req, res, ctx) => {
				return res(
					ctx.json(user_query),
					ctx.status(200)
				)
			})
		)
	})

	const renderWithRouter = async() => {
		window.HTMLElement.prototype.scrollIntoView = jest.fn
		const workoutId = 1
		const router = createMemoryRouter(
			createRoutesFromElements( [
				<Route key={"key1"} path="workout/:workoutId" element={<WorkoutView />} />,
				<Route key={"key2"} path="workout/edit/:workoutId" element={<WorkoutEdit />} />
			]
			),
			{initialEntries: [`/workout/${workoutId}`]}
		)

		render ( //eslint-disable-next-line no-dupe-keys
			<AccountContext.Provider value={{ undefined, role: "ADMIN", userId: 1, permissions: USER_PERMISSION_LIST_ALL, undefined }}>
				<RouterProvider router={router}/>
			</AccountContext.Provider>
		)

		await waitFor(() => {
			expect(api).toHaveBeenCalledTimes(2)
		})
	}

	afterEach(() => {
		api.mockClear()
	})

	test("should render view page", async () => {
		await renderWithRouter()

		await waitFor(() => {
			const elementWithText = screen.queryAllByText("Författare")
			expect(elementWithText).not.toHaveLength(0)
		})
	})

	test("should navigate to edit page on click edit", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("edit_pencil"))

		await waitFor(() => {
			const elementWithText = screen.getByTestId("edit_pencil_0")
			expect(elementWithText).toBeInTheDocument()
		})
	})

	test("should open edit popup when edit clicked", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("edit_pencil"))

		await waitFor(() => {
			const elementWithText = screen.getByTestId("edit_pencil_0")
			expect(elementWithText).toBeInTheDocument()
		})

		await user.click(screen.getByTestId("edit_pencil_0"))

		await waitFor(() => {
			const edit_activity = screen.queryAllByText("Redigera aktivitet")
			expect(edit_activity).toHaveLength(1)
		})
	})

	test("should remove activityList when edited to be empty", async () => {
		await renderWithRouter()

		await user.click(screen.getByTestId("edit_pencil"))

		await waitFor(() => {
			const elementWithText = screen.getByTestId("edit_pencil_0")
			expect(elementWithText).toBeInTheDocument()
		})

		await user.click(screen.getByTestId("edit_pencil_0"))

		await waitFor(() => {
			const edit_activity = screen.queryAllByText("Redigera aktivitet")
			expect(edit_activity).not.toHaveLength(0)
		})

		await user.click(screen.getByTestId("cateogry-radio-2"))
		await user.click(screen.getByTestId("popup_save_button"))

		await user.click(screen.getByTestId("edit_pencil_1"))

		await user.click(screen.getByTestId("cateogry-radio-2"))
		await user.click(screen.getByTestId("popup_save_button"))

		await waitFor(() => {
			const edit_activity = screen.queryAllByText("Uppvärmning")
			expect(edit_activity).toHaveLength(0)
		})
	})
})
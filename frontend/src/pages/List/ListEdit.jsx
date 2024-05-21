/* eslint-disable no-unused-vars */
import { useContext, useEffect, useReducer, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ListFormComponent from "../../components/Common/List/ListFormComponent.jsx"
import { AccountContext } from "../../context.js"
import {
	listCreateReducer,
	ListCreateInitialState,
	LIST_CREATE_TYPES,
} from "../../components/Common/List/ListCreateReducer.js"
import { ListCreateContext } from "../../components/Common/List/ListCreateContext.js"
import styles from "./WorkoutModify.module.css"
import { setSuccess, setError } from "../../utils.js"
import { Spinner } from "react-bootstrap"

/**
 * This is the page for editing a saved workout.
 *
 * @author Team Minotaur, Team Kiwi, Team Durian (Group 3) (2024-04-23)
 * @version 2.0
 * @since 2023-05-24
 * @updated 2024-04-23 Team Kiwi, Removed blockers and Pop-up for redirecting to technique descriptions
 */
const ListEdit = () => {
	const [listCreateInfo, listCreateInfoDispatch] = useReducer(
		listCreateReducer,
		JSON.parse(JSON.stringify(ListCreateInitialState))
	)
	const navigate = useNavigate()
	const { token, userId } = useContext(AccountContext)
	const location = useLocation()
	const { activityListId } = useParams()
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	/**
	 * Submits the form data to the API.
	 */
	async function submitHandler() {
		setIsSubmitted(true)
		const data = parseData(listCreateInfo.data)
		console.log("Data: " + JSON.stringify(data))
		// const listId = await updateActivityList(data)

		// if (listId) {
		// 	setSuccess("Träningen uppdaterades!")
		// } else {
		// 	setError("Träningen kunde inte uppdateras.")
		// }
		navigate(-1)
	}

	/**
	 * Parses the data from the listCreateInfo state to a format that the API accepts.
	 *
	 * @param {*} data
	 * @returns The parsed data.
	 */
	function parseData(data) {
		let activities = []
		data.activities.forEach((a) => {
			const activity = {
				entryId: a.entryId ? a.entryId : null,
				type: a.type,
				id: a.id,
				duration: a.duration,
			}
			activities.push(activity)
		})

		return {
			id: data.id,
			name: data.name,
			desc: data.desc,
			hidden: data.hidden,
			author: userId,
			activities: activities,
			users: data.users.map((user) => user.userId),
		}
	}

	const updateActivityList = async (body) => {
		const requestOptions = {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-type": "application/json",
				token,
			},
			body: JSON.stringify(body),
		}

		const response = await fetch("/api/activitylists/edit", requestOptions)
		const jsonResp = await response.json()

		return jsonResp.workoutId
	}

	/**
	 * Fetches the data from the local storage and context.
	 */
	useEffect(() => {
		setIsLoading(true)
		const item = localStorage.getItem("listCreateInfoEdit")
		const listData = location.state?.list
		const userData = location.state?.list.users
		if (listData) {
			listCreateInfoDispatch({
				type: LIST_CREATE_TYPES.INIT_EDIT_DATA,
				payload: { listData, userData: userData ? userData : [] },
			})
			window.history.replaceState({}, document.title)
		} else if (item) {
			listCreateInfoDispatch({
				type: LIST_CREATE_TYPES.INIT_WITH_DATA,
				payload: JSON.parse(item),
			})
		} else {
			navigate(-1, { replace: true })
		}
		setIsLoading(false)
	}, [])

	/**
	 * Saves the data to local storage when the user leaves the page.
	 * Or removes it if the user has submitted the form.
	 */
	useEffect(() => {
		localStorage.setItem("listCreateInfoEdit", JSON.stringify(listCreateInfo))

		return () => {
			if (isSubmitted) localStorage.removeItem("listCreateInfoEdit")
		}
	}, [listCreateInfo, isSubmitted])
	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<ListCreateContext.Provider value={{ listCreateInfo, listCreateInfoDispatch }}>
						<title>Redigera lista</title>
						<h1 className={styles.title}>Redigera lista</h1>

						<ListFormComponent
							callback={submitHandler}
							listCreateInfoDispatchProp={listCreateInfoDispatch}
						/>
					</ListCreateContext.Provider>
				</>
			)}
		</>
	)
}
export default ListEdit

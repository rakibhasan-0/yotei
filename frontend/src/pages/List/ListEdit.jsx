import { useContext, useEffect, useReducer, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ListFormComponent from "../../components/Common/List/ListFormComponent.jsx"
import { AccountContext } from "../../context.js"
import {
	listCreateReducer,
	ListCreateInitialState,
	LIST_CREATE_TYPES,
} from "../../components/Common/List/ListCreateReducer.js"
import { ListCreateContext } from "../../components/Common/List/ListCreateContext.js"
import styles from "./WorkoutModify.module.css"
import { Spinner } from "react-bootstrap"
import { setSuccess, setError } from "../../utils.js"

/**
 * This is the page for editing a saved list.
 *
 * @author Team Tomato (6)
 * @version 1.0
 * @since 2024-05-22
 */

const ListEdit = () => {
	const [listCreateInfo, listCreateInfoDispatch] = useReducer(
		listCreateReducer,
		JSON.parse(JSON.stringify(ListCreateInitialState))
	)
	const isEdit = window.location.href.toString().includes("edit")

	const navigate = useNavigate()
	const { userId, token } = useContext(AccountContext)

	const location = useLocation()
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const localStorageDestination = isEdit ? "listCreateInfoEdit" : "listCreateInfoCreate"
	/**
	 * Submits the form data to the API.
	 */
	async function submitHandler() {
		setIsSubmitted(true)
		const data = parseData(listCreateInfo.data)
		let listId
		if (isEdit) {
			listId = await updateActivityList(data)
			if (listId) {
				setSuccess("Träningen uppdaterades!")
			} else {
				setError("Träningen kunde inte uppdateras hejhej.")
			}
		} else {
			listId = await createActivityList(data)
			if (listId) {
				setSuccess("Träningen skapades!")
			} else {
				setError("Träningen kunde inte skapas.")
			}
		}
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

		return jsonResp
	}

	const createActivityList = async (body) => {
		const requestOptions = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-type": "application/json",
				token,
			},
			body: JSON.stringify(body),
		}
		const response = await fetch("/api/activitylists/add", requestOptions)
		const jsonResp = await response.json()

		return jsonResp
	}
	/**
	 * Fetches the data from the local storage and context.
	 */
	useEffect(() => {
		setIsLoading(true)
		const item = localStorage.getItem(localStorageDestination)
		const listData = location.state?.list
		const userData = location.state?.list.users
		if (listData && isEdit) {
			listCreateInfoDispatch({
				type: LIST_CREATE_TYPES.INIT_EDIT_DATA,
				payload: { listData, userData: userData ? userData : [] },
			})
			window.history.replaceState({}, document.title)
		} else if (!item && !isEdit) {
			listCreateInfoDispatch({ type: LIST_CREATE_TYPES.SET_INITIAL_STATE })
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
		localStorage.setItem(localStorageDestination, JSON.stringify(listCreateInfo))

		return () => {
			if (isSubmitted) localStorage.removeItem(localStorageDestination)
		}
	}, [listCreateInfo, isSubmitted])
	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<ListCreateContext.Provider value={{ listCreateInfo, listCreateInfoDispatch }}>
						{isEdit ? (
							<>
								<title>Redigera lista</title>
								<h1 className={styles.title}>Redigera lista</h1>
							</>
						) : (
							<>
								<title>Skapa lista</title>
								<h1 className={styles.title}>Skapa lista</h1>
							</>
						)}

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

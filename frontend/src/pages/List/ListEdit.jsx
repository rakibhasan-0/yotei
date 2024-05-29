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
import { setSuccess, setError, parseActivityListToDTO } from "../../utils.js"

/**
 * This is the page for editing a saved list.
 *
 * @author Team Tomato (6)
 * @version 1.0
 * @since 2024-05-22
 * @updated 2024-05-29 by Team Tomato, refactoring
 */

const ListEdit = () => {
	const [listCreateInfo, listCreateInfoDispatch] = useReducer(listCreateReducer, ListCreateInitialState)

	const navigate = useNavigate()
	const { userId, token } = useContext(AccountContext)

	const location = useLocation()
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const localStorageDestination = "listCreateInfoEdit"

	/**
	 * Submits the form data to the API.
	 */
	async function submitHandler() {
		setIsSubmitted(true)
		const data = parseActivityListToDTO(listCreateInfo.data, userId)

		const listId = await updateActivityList(data)
		if (listId) {
			setSuccess("Listan uppdaterades!")
		} else {
			setError("Listan kunde inte uppdateras.")
		}
		localStorage.removeItem(localStorageDestination)
		navigate(-1)
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

	/**
	 * Fetches the data from the local storage and context.
	 */
	useEffect(() => {
		setIsLoading(true)
		const item = localStorage.getItem(localStorageDestination)
		const listData = location.state?.list
		const userData = location.state?.list?.users
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

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
 * This is the page for creating a new list
 *
 * @author Team Tomato (6)
 * @version 1.0
 * @since 2024-05-29
 */

const ListCreate = () => {
	const [listCreateInfo, listCreateInfoDispatch] = useReducer(
		listCreateReducer,
		JSON.parse(JSON.stringify(ListCreateInitialState))
	)

	const navigate = useNavigate()
	const { userId, token } = useContext(AccountContext)

	const location = useLocation()
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const localStorageDestination = "listCreateInfoCreate"
	const returnTo = location.state?.returnTo || "/activity"

	/**
	 * Submits the form data to the API.
	 */
	async function submitHandler() {
		setIsSubmitted(true)
		const data = parseActivityListToDTO(listCreateInfo.data, userId)
		let listId

		listId = await createActivityList(data)

		if (listId) {
			setSuccess("Listan skapades!")
		} else {
			setError("Listan kunde inte skapas.")
		}
		localStorage.removeItem(localStorageDestination)
		navigate("/profile/list/" + listId, { state: { returnTo: returnTo } })
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
		if (!item) {
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
						<title>Skapa lista</title>
						<h1 className={styles.title}>Skapa lista</h1>

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
export default ListCreate

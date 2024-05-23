import { useEffect, useState, useContext } from "react"
import Button from "../Common/Button/Button"
import InfiniteScrollComponent from "../Common/List/InfiniteScrollComponent"
import SearchBar from "../Common/SearchBar/SearchBar"
import { AddToListItem } from "../SavedList/AddToListItem"
import styles from "./AddToListPopup.module.css"
import { getLists } from "../Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../context"
import useMap from "../../hooks/useMap"
import { setError, setSuccess } from "../../utils"
import { Link } from "react-router-dom"

export const AddToListPopupContent = ({ techExerID, setShowMorePopup }) => {
	const [lists, setLists] = useState([])
	const [searchListText, setSearchListText] = useState("")
	const { token } = useContext(AccountContext)
	const [map, mapActions] = useMap()

	const [selectedLists, setSelectedLists] = useState([])

	/**
	 * Adds or removes the ID of the item from the checkboxed list.
	 * @param {string} id - The ID of the item.
	 * @returns {void}
	 */
	const handleCheck = (id) => {
		setSelectedLists(prevIds => {
			if (prevIds.includes(id)) {
				return prevIds.filter(itemId => itemId !== id)
			} else {
				return [...prevIds, id]
			}
		})
	}
 



	/**
	 * Fetches lists when the component is mounted or when the
	 * search text are changed.
	 */
	useEffect(() => {
		setLists(lists)
		fetchingList()
	}, [searchListText, lists])



	/**
	 * Fetches the lists from the backend, either from cache or by a new API-call.
	 */
	function fetchingList() {

		const args = {
			text: searchListText,
			isAuthor: true,
			isShared: false,
			hidden: false
		}

		getLists(args, token, map, mapActions, (result) => {
			if (result.error) return

			// Extract the 'id' and 'name' fields from each item in the result used in displaying the list.
			const listsToAdd = result.results.map(item => ({

				id: item.id,
				name: item.name,
				author: {
					userId: item.author.userId,
					username: item.author.username
				},
				hidden: item.hidden,
				date: item.date
			}))

			setLists(listsToAdd)
		})
	}


	/**
	 * POST request to save the activity to the selected lists.
	 */
	async function saveActivityToLists() {
		const jsonContent = {
			listId: selectedLists[0],
			exerciseId: techExerID.exerciseId,
			techniqueId: techExerID.techniqueId
		}
	
		const response = await fetch("/api/activitylistentry/multiAdd", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"ids": selectedLists.join(","),
				"token": token
			},
			body: JSON.stringify(jsonContent)
		})
		
		if (!response.ok) {
			setError("Fel vid sparning av aktivitet till listor")
		} else {
			setSuccess("Aktivitet sparad till listor")
			setShowMorePopup(false)
		}
	}




	return (
		<div className={styles["container"]}>
			<div className="my-4">
				<Link to={"/list/create"}>
					<Button outlined={true}>
						<p>+ Skapa ny lista</p>
					</Button>
				</Link>
			</div>
			<SearchBar 
				id="lists-search-bar"
				placeholder="Sök efter listor"
				text={searchListText}
				onChange={setSearchListText}
			/>
			<InfiniteScrollComponent>
				{lists.map((item, index) => (
					<AddToListItem
						item={item}
						key={index}
						onCheck={handleCheck}
					/>
				))}
			</InfiniteScrollComponent>
			<div className="fixed-bottom w-100 bg-white pt-2">
				<div className="mb-4">
					<Button onClick={saveActivityToLists}>Spara</Button>
				</div>
			</div>
		</div>
	)
}

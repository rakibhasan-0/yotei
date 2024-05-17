import { useEffect, useState, useContext } from "react"
import Button from "../Common/Button/Button"
import InfiniteScrollComponent from "../Common/List/InfiniteScrollComponent"
import SearchBar from "../Common/SearchBar/SearchBar"
import { AddToListItem } from "../SavedList/AddToListItem"
import styles from "./AddToListPopup.module.css"
import Spinner from "../Common/Spinner/Spinner"
import { getLists } from "../Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../context"
import useMap from "../../hooks/useMap"

export const AddToListPopupContent = () => {
	const [isLoading, setIsLoading] = useState(true)

	const [lists, setLists] = useState([])
	const [searchListText, setSearchListText] = useState("")
	const { token } = useContext(AccountContext)
	const [map, mapActions] = useMap()




	/**
	 * Fetches lists when the component is mounted or when the
	 * search text are changed.
	 */
	useEffect(() => {
		setIsLoading(true)
		setLists(lists)
		fetchingList()
	}, [searchListText])



	/**
	 * Fetches the lists from the backend, either from cache or by a new API-call.
	 */
	function fetchingList() {

		const args = {
			text: searchListText
		}

		getLists(args, token, map, mapActions, (result) => {
			if (result.error) return

			// Extract the 'id' and 'name' fields from each item in the result used in displaying the list.
			const lists = result.map(item => ({ id: item.id, name: item.name, author: item.author, numberOfActivities: item.act}))

			setLists(lists)
			setIsLoading(false)
		})
	}

	return isLoading ? (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
    		<Spinner />
		</div>
	) : (
		<div className={styles["container"]}>
			<div className="my-4">
				<Button outlined={true}>
					<p>+ Skapa ny lista</p>
				</Button>
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
						name={item.name}
						numberOfActivities={item.numberOfActivities}
						author={item.author}
						key={index}
					/>
				))}
			</InfiniteScrollComponent>

			<div className="fixed-bottom w-100 bg-white pt-2">
				<div className="mb-4">
					<Button>Spara</Button>
				</div>
			</div>
		</div>
	)
}

import { useEffect, useState } from "react"
import Button from "../Common/Button/Button"
import InfiniteScrollComponent from "../Common/List/InfiniteScrollComponent"
import SearchBar from "../Common/SearchBar/SearchBar"
import { AddToListItem } from "../SavedList/AddToListItem"
import styles from "./AddToListPopup.module.css"
import Spinner from "../Common/Spinner/Spinner"

export const AddToListPopupContent = () => {
	const [lists, setLists] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const mockData = [
		{
			id: 1,
			name: "Lista 1",
			numberOfActivities: 3,
			author: {
				username: "Admin",
				id: 1,
			},
		},
		{
			id: 1,
			name: "Lista 2",
			numberOfActivities: 4,
			author: {
				username: "Editor",
				id: 2,
			},
		},
	]
	useEffect(() => {
		setLists(mockData)
		setIsLoading(false)
	}, [])

	return isLoading ? (
		<Spinner />
	) : (
		<div className={styles["container"]}>
			<div className="my-4">
				<Button outlined={true}>
					<p>+ Skapa ny lista</p>
				</Button>
			</div>
			<SearchBar placeholder={"Sök efter lista"} />
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

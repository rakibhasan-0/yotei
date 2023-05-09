import React, {useState, useEffect, useContext} from "react"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import "../../components/Common/SearchBar/SearchBarUtils"
import "../../pages/Exercise/ExerciseIndex.css"
import ActivityList from "../../components/Activity/ActivityList"
import { AccountContext } from "../../context"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import InfiniteScroll from "react-infinite-scroll-component"
import { Plus } from "react-bootstrap-icons"

/**
 * Class for the Exercise-page. Creates the searchbar and the list.
 * 
 * When a user puts an input into the search bar, it will filter the
 * list after the current search term.
 *
 * Fetches the exercises from the API on pageload (componentDidMount).
 * @author Grupp 3 (Hawaii), Grupp 5 (Verona), Grupp 1 - Phoenix
 */

function ExerciseIndex() {
	const [visibleList, setVisibleList] = useState([])
	// const [allTags, setAllTags] = useState([])
	// const [usedTags, setUsedTags] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [searchText, setSearchText] = useState("")
	const [addedTags, setAddedTags] = useState([])
	const [suggestedTags, setSuggestedTags] = useState([])
	const { token } = useContext(AccountContext)
	//const uri = props.uri
	const detailURL = "/exercise/exercise_page/"

	useEffect(() => {
		// getAllTags();
		// getAllExercises();
		//getAllExercisesByTag();
		getSetAmountOfExercises()
	}, [])

	useEffect(() => {
		if (searchText === "") {
			setSuggestedTags([])
			return
		}
		// Check if exists in	// const [allTags, setAllTags] = useState([])
		// const [usedTags, setUsedTags] = useState([]) hashmap?
		const handleChange = async () => {
			const res = await fetch("/api/search/exercises", { headers: { token } })
			if (!res.ok) {
				console.log(res)
				return
			}
			// If fetch success, the error message resets
			let json = await res.json()
			// Makes sure that added tags are not suggested
			for (const tagInList of addedTags) {
				json.tagCompletion = json.tagCompletion.filter((tag) => tag !== tagInList)
			}

			console.log(json.tagCompletion)
			console.log(json)
			setSuggestedTags(json.tagCompletion)
		}

		handleChange()
	}, [searchText])

	// const getAllTags = async () => {
	// 	const headers = { token };

	// 	await fetch("/api/tags/all", { headers })
	// 	.then((res) => res.json())
	// 	.then((data) => {
	// 		setAllTags(data);
	// 		setVisibleTags(data);
	// 	})
	// 	.catch(console.log);
	// };

	const getSetAmountOfExercises =  async () => {
		const startIndex = visibleList.length
		const headers = { token }
		console.log("GOT HERE")
		await fetch(`/api/exercises/from/${startIndex}`, { headers })
			.then((res) => res.json())
			.then((newData) => {
				const newVisibleList = [...visibleList, ...newData]
				setVisibleList(newVisibleList)
				console.log("GOT HERE")
				if (newData.length < 20) {
					setHasMore(false)
				} else {
					setHasMore(true)
				}
			})
			.catch(console.log)
	}

	return (
		<div>
			<center>
				<h1 className="py-2">Övningar</h1>
				<SearchBar 
					id="nåt-id" 
					text={searchText} 
					onChange={setSearchText}
					addedTags={addedTags}
					setAddedTags={setAddedTags}
					suggestedTags={suggestedTags}
					setSuggestedTags={setSuggestedTags}
				/>
			</center>
			<InfiniteScroll
				dataLength={visibleList.length}
				next={getSetAmountOfExercises}
				hasMore={hasMore}
				loader={<h4>Loading...</h4>}
				scrollThreshold={0.8}
			>
				<ActivityList activities={visibleList}  apiPath={"exercises"} detailURL={detailURL}/>
			</InfiniteScroll>
			<br/>
			<br/>
			<br/>
			<br/>
			<RoundButton linkTo={"/exercise/create"}> 
				<Plus />
			</RoundButton>
		</div>
	)
}

export default ExerciseIndex
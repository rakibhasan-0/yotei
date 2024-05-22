import {useState, useEffect, useContext} from "react"
import { useCookies } from "react-cookie"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import "../../../components/Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../../context"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { Plus, ThreeDotsVertical } from "react-bootstrap-icons"
import { getExercises } from "../../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../../hooks/useMap"
import FilterContainer from "../../../components/Common/Filter/FilterContainer/FilterContainer"
import Sorter from "../../../components/Common/Sorting/Sorter"
import ExerciseCard from "../../../components/Common/ExerciseCard/ExerciseListItem"
import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"
import Spinner from "../../../components/Common/Spinner/Spinner"
import { canCreateAndEditActivity } from "../../../utils"
import Popup from "../../../components/Common/Popup/Popup"
import { AddToListPopupContent } from "../../../components/Activity/AddToListPopupContent"
import styles from "./ExerciseIndex.module.css"
import { Link } from "react-router-dom"


/**
 * Displays a searchbar, a sorter and a list of exercises.
 * 
 * @author Hawaii, Verona, Phoenix, Cyclops, Team Mango, Team Coconut, Team Tomato, Team Durian, Team Kiwi, Team Mango
 * @since 2024-04-18
 * @version 3.3
 * @update v3.3 (2024-05-02 Team Kiwi) removed header from html, also rerouted button from ./create to ./exercise/create
 * @updated 2024-05-16 Team Durian, removed title height
 * @updated 2024-05-22 Team Mango: Changed check for adding exercise according to new permissions.
 */
export default function ExerciseIndex() {
	const sortOptions = [
		{label: "Namn: A-Ö", cmp: (a, b) => {return a.name.localeCompare(b.name)}},
		{label: "Namn: Ö-A", cmp: (a, b) => {return -a.name.localeCompare(b.name)}},
		{label: "Tid: Kortast först", cmp: (a, b) => {return a.duration - b.duration}},
		{label: "Tid: Längst först", cmp: (a, b) => {return b.duration - a.duration}}
	]
	const context = useContext(AccountContext)
	const cookieID = "exercise-search-results-userId-"+context.userId
	const [cookies, setCookie] = useCookies([cookieID])
	const [exercises, setExercises] = useState([])
	const [visibleList, setVisibleList] = useState([])
    
	//Restore info from cookie here to avoid empty load
	const filterCookie = cookies[cookieID]
	const [searchText, setSearchText] = useState(filterCookie ? filterCookie.searchText : "")
	const [addedTags, setAddedTags] = useState(filterCookie ? filterCookie.tags : [])
	const [suggestedTags, setSuggestedTags] = useState([])
	const detailURL = "/exercise/exercise_page/"
	const [popupVisible, setPopupVisible] = useState(false)
	const [map, mapActions] = useMap()
	const [sort, setSort] = useState(sortOptions[0])
	const [loading, setIsLoading] = useState(true)
	const [selectedExerciseId, setSelectedExerciseId] = useState(null)
	const [showMorePopup, setShowMorePopup] = useState(false)

	

	useEffect(() => {
		if(filterCookie) {
			let cachedSort = sortOptions.find(option => filterCookie.sort === option.label)
			setSort(cachedSort ? cachedSort : sortOptions[0])
		}
		deleteLocalStorage()
		window.localStorage.setItem("popupState", false)
		setPopupVisible(false)
	}, [])

	useEffect(setExerciseList, [exercises, sort, searchText])

	useEffect(() => {
		if (popupVisible === true) {
			map.clear()
			return
		}
		setCookie(cookieID, {tags: addedTags, sort: sort.label, searchText: searchText}, {path: "/"})
		const args = {
			text: searchText,
			selectedTags: addedTags
		}   

		getExercises(args, context.token, map, mapActions, result => {
			if(!result.error) {
				setSuggestedTags(result.tagCompletion)
				setExercises(result.results)
			}
			setIsLoading(false)
		})
	}, [searchText, addedTags, popupVisible])

	/**
	 * Sets the exercise list by sorting the exercises and updating the visible list state. 
	 * Also updates the exercise search-results cookie.
	 */
	function setExerciseList() {
		setCookie(cookieID, {tags: addedTags, sort: sort.label, searchText: searchText}, {path: "/"})
		if(exercises && searchText == "") {
			const sortedList = [...exercises].sort(sort.cmp)
			setVisibleList(sortedList)
		}
		else {
			const temp = [...exercises ?? []]
			setVisibleList(temp)
		}
	}
    
	function deleteLocalStorage() {
		window.localStorage.setItem("name", "")
		window.localStorage.setItem("desc", "")
		window.localStorage.setItem("time", "")
	}


	const handleMoreClicked = (id) => {
		setSelectedExerciseId(id)
		//Open pop up
		setShowMorePopup(!showMorePopup)
	}


	return (
		<>
			<h1 id ={"exercise-header"}></h1>

			<SearchBar 
				id="exercise-search-bar" 
				placeholder="Sök efter övningar"
				text={searchText} 
				onChange={setSearchText}
				addedTags={addedTags}
				setAddedTags={setAddedTags}
				suggestedTags={suggestedTags}
				setSuggestedTags={setSuggestedTags}
			/>

			<FilterContainer id="ei-filter" title="Sortering" numFilters={0}>
				<Sorter onSortChange={setSort} id="ei-sort" selected={sort} options={sortOptions} />
			</FilterContainer>
			{ loading ? <Spinner/> :
				<div>
					<title>Övningar</title>
					<InfiniteScrollComponent>
						{ visibleList.map((exercise, index) => {
							return (
								<div key={exercise.id} className={styles["exercise-row"]}>
									<div style={{ flexGrow: 1 }}>
										<ExerciseCard
											item={exercise.name}
											text={exercise.duration + " min"}
											key={exercise.id}
											id={exercise.id}
											detailURL={detailURL}
											index={index}
										/>
									</div>
									<Link variant="link" style={{ marginTop: "10px", paddingLeft: "20px" }} onClick={() => handleMoreClicked(exercise.id)}>
										<ThreeDotsVertical color="black" size={24} />
									</Link>
								</div>
							)
						})}
					</InfiniteScrollComponent>
				</div>
			}

			{/* Spacing so the button doesn't cover a exercise card */}
			<br/><br/><br/><br/><br/>

			
			{canCreateAndEditActivity(context) && 
			<RoundButton linkTo={"exercise/create"} id={"exercise-round-button"}  style={{maxWidth: "5px"}}>
				<Plus/>
			</RoundButton>
			}
			<Popup title="Lägg till i lista" isOpen={showMorePopup} setIsOpen={setShowMorePopup}>
				<AddToListPopupContent techExerID={{ techniqueId: null, exerciseId: selectedExerciseId }} />
			</Popup>
		</>
	)
}
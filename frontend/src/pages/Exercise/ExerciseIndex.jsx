import React, {useState, useEffect, useContext} from "react"
import { useCookies } from "react-cookie"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import "../../components/Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../context"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import { getExercises } from "../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../hooks/useMap"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import Sorter from "../../components/Common/Sorting/Sorter"
import ExerciseCard from "../../components/Common/ExerciseCard/ExerciseListItem"
import InfiniteScrollComponent from "../../components/Common/List/InfiniteScrollComponent"
import Spinner from "../../components/Common/Spinner/Spinner"
import { isEditor } from "../../utils"

/**
 * Displays a searchbar, a sorter and a list of exercises.
 * 
 * @author Hawaii, Verona, Phoenix, Cyclops, Team Mango, Team Coconut, Team Tomato, Team Durian
 * @since 2024-04-18
 * @version 3.2
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

	return (
		<>


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
							return <ExerciseCard
								item={exercise.name}
								text={exercise.duration + " min"}
								key={exercise.id}
								id={exercise.id}
								detailURL={detailURL}
								index={index}>
							</ExerciseCard>
						})}
					</InfiniteScrollComponent>
				</div>
			}

			{/* Spacing so the button doesn't cover a exercise card */}
			<br/><br/><br/><br/><br/>

			{isEditor(context) && 
			<RoundButton linkTo={"exercise/create"} id={"exercise-round-button"}  style={{maxWidth: "5px"}}>
				<Plus/>
			</RoundButton>
			}
		</>
	)
}
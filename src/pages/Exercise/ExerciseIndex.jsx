import React, {useState, useEffect, useContext} from "react"
import { useCookies } from "react-cookie"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import "../../components/Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../context"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import { getExercises } from "../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../hooks/useMap"
import Popup from "../../components/Common/Popup/Popup"
import ExerciseCreate from "./ExerciseCreate"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import Sorter from "../../components/Common/Sorting/Sorter"
import ExerciseCard from "../../components/Common/ExerciseCard/ExerciseListItem"
import InfiniteScrollComponent from "../../components/Common/List/InfiniteScrollComponent"
import Spinner from "../../components/Common/Spinner/Spinner"
import { isEditor } from "../../utils"

/**
 * Displays a searchbar, a sorter and a list of exercises.
 * 
 * @author Hawaii, Verona, Phoenix, Cyclops
 * @since 2023-05-30
 * @version 2.0
 */
export default function ExerciseIndex() {
	const sortOptions = [
		{label: "Namn: A-Ö", cmp: (a, b) => {return a.name.localeCompare(b.name)}},
		{label: "Namn: Ö-A", cmp: (a, b) => {return -a.name.localeCompare(b.name)}},
		{label: "Tid: Kortast först", cmp: (a, b) => {return a.duration - b.duration}},
		{label: "Tid: Längst först", cmp: (a, b) => {return b.duration - a.duration}}
	]

	const [cookies, setCookie] = useCookies(["exercise-filter"])
	const [exercises, setExercises] = useState([])
	const [visibleList, setVisibleList] = useState([])
	const [searchText, setSearchText] = useState("")
	const [addedTags, setAddedTags] = useState([])
	const [suggestedTags, setSuggestedTags] = useState([])
	const context = useContext(AccountContext)
	const detailURL = "/exercise/exercise_page/"
	const [popupVisible, setPopupVisible] = useState(false)
	const [map, mapActions] = useMap()
	const [sort, setSort] = useState(sortOptions[0])
	const [loading, setIsLoading] = useState(true)

	useEffect(() => {
		const filterCookie = cookies["exercise-filter"]
		if(filterCookie) {
			setAddedTags(filterCookie.tags)
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
		setCookie("exercise-filter", {tags: addedTags, sort: sort.label}, {path: "/"})
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
     * Also updates the exercise filter cookie.
     */
	function setExerciseList() {
		setCookie("exercise-filter", {tags: addedTags, sort: sort.label}, {path: "/"})
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
		
			<h1 className="py-2" id={"exercise-title"} style={{marginBottom: "-10px"}}>Övningar</h1>
				
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
            
			<FilterContainer id="ei-filter" title="Sortering">
				<Sorter onSortChange={setSort} id="ei-sort" selected={sort} options={sortOptions} />
			</FilterContainer>
			{ loading ? <Spinner/> :
				<div>
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
			<RoundButton linkTo={null} onClick={() => setPopupVisible(true)} id={"exercise-round-button"}  style={{maxWidth: "5px"}}>
				<Plus/>
			</RoundButton>
			}

			<Popup
				title="Skapa övning"
				id="create-exercise-popup"
				isOpen={popupVisible}
				setIsOpen={setPopupVisible}
				style={{maxHeight: "fit-content"}}
			>
				<ExerciseCreate setShowPopup={setPopupVisible}/>
			</Popup>
		</>
	)
}
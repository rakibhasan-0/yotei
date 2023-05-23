import React, {useState, useEffect, useContext} from "react"
import { useCookies } from "react-cookie"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import "../../components/Common/SearchBar/SearchBarUtils"
//import styles from "../../pages/Exercise/ExerciseIndex.module.css"
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

/**
 * Function for the Exercise-page. Creates the searchbar and the list.
 * 
 * Displays a searchbar and a list of exercises.
 * 
 * @author Hawaii, Verona, Phoenix
 * @since 2023-05-10
 * @version 1.0
 */
function ExerciseIndex() {
	const [cookies, setCookie] = useCookies(["exercise-filter"])
	const [visibleList, setVisibleList] = useState([])
	const [searchText, setSearchText] = useState("")
	const [addedTags, setAddedTags] = useState([])
	const [suggestedTags, setSuggestedTags] = useState([])
	const { token } = useContext(AccountContext)
	const detailURL = "/exercise/exercise_page/"
	const [popupVisible, setPopupVisible] = useState(false)
	const [map, mapActions] = useMap()
	const [sort, setSort] = useState("nameAsc")
	const [triggerReload, setTriggerReload] = useState(false)

	useEffect(() => {
		const filterCookie = cookies["exercise-filter"]
		if(filterCookie) {
			setAddedTags(filterCookie.tags)
		}
	}, [])

	const getAllExercises =  async () => {
		const headers = { token }
		const url = `/api/exercises/all?sort=${sort}`

		await fetch(url, {headers})
			.then(res => res.json())
			.then((data) => {
				setVisibleList("") // Need to empty list before inserting new data.
				setVisibleList(data)
			})            
	}

	useEffect(() => {
		const args = {
			text: searchText,
			selectedTags: addedTags
		}

		getExercises(args, token, map, mapActions, (result) => {
			setVisibleList(result.results)
			setSuggestedTags(result.tagCompletion)
			setCookie("exercise-filter", {tags: addedTags}, {path: "/"})
		})
	}, [searchText, addedTags])

	const handleSortChange = (selectedOption) => {
		let newSort
		switch (selectedOption) {
		case "Namn: A-Ö":
			newSort = "nameAsc"
			break
		case "Namn: Ö-A":
			newSort = "nameDesc"
			break
		case "Längd: Kortast först":
			newSort = "durationAsc"
			break
		case "Längd: Längst först":
			newSort = "durationDesc"
			break
		default:
			console.error("Invalid sort option")
			return // Early return if an invalid sort option is selected
		}
		if (newSort !== sort) {
			setSort(newSort)
		}
	}
    
	useEffect(() => {
		console.log("Sort: " + sort)
		getAllExercises()
	}, [sort])

	useEffect(() => {
		getAllExercises()
		setSearchText("")
		console.log("reloaded")
	}, [triggerReload])

	useEffect(() => {
		const handlePopstate = () => {
			setTriggerReload(true)
		}

		window.addEventListener("popstate", handlePopstate)

		return () => {
			window.removeEventListener("popstate", handlePopstate)
		}
	}, [])

	function renderExercises(activities, detailURL) {
		const exercises = activities?.map((activity, index) => {
			return <ExerciseCard
				item={activity.name}
				text={activity.duration + " min"}
				key={index}
				id={activity.id}
				detailURL={detailURL}
				index={index}>
			</ExerciseCard>
		})

		return exercises
	}

	return (
		<>
			<h1 className="py-2" id={"exercise-title"} style={{marginBottom: "-10px"}}>Övningar</h1>
				
			<SearchBar 
				id="exercise-search-bar" 
				text={searchText} 
				onChange={setSearchText}
				addedTags={addedTags}
				setAddedTags={setAddedTags}
				suggestedTags={suggestedTags}
				setSuggestedTags={setSuggestedTags}
			/>
			
			<FilterContainer id="ei-filter" title="Sortering">
				<Sorter onSortChange={handleSortChange} id="ei-sort" defaultSort={"Namn: A-Ö"}>
					<div>Namn: A-Ö</div>
					<div>Namn: Ö-A</div>
					<div>Längd: Kortast först</div>
					<div>Längd: Längst först</div>

					{/* Add more options as needed */}
				</Sorter>
			</FilterContainer>
		
			{renderExercises(visibleList, detailURL)}

			<br/><br/><br/><br/>

			<RoundButton linkTo={null} onClick={() => setPopupVisible(true)} id={"exercise-round-button"}  style={{maxWidth: "5px"}}>
				<Plus/>
			</RoundButton>

			<Popup
				title={"Skapa övning"}
				id={"create-exercise-popup"}
				isOpen={popupVisible}
				setIsOpen={setPopupVisible}
				noBackground={false}
			>
				<ExerciseCreate setShowPopup={setPopupVisible} onClose={() => setTriggerReload((prevState) => !prevState)}/>
			</Popup>
		</>
	)
}

export default ExerciseIndex
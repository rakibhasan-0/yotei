import React, { useState, useEffect, useContext } from "react"
import { useCookies } from "react-cookie"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import "../../components/Common/SearchBar/SearchBarUtils"
import "../../pages/Exercise/ExerciseIndex.css"
import ActivityList from "../../components/Activity/ActivityList"
import { AccountContext } from "../../context"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import { getExercises } from "../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../hooks/useMap"
import Popup from "../../components/Common/Popup/Popup"
import ExerciseCreate from "../../pages/Exercise/ExerciseCreate"

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

	useEffect(() => {
		const filterCookie = cookies["exercise-filter"]
		if(filterCookie) {
			setAddedTags(filterCookie.tags)
		}
	}, [])

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
	const handleClosePopup = () => {
		setPopupVisible(false)
		window.location.reload() // Reload the page
	}

	return (
		<div>
			<center>
				<h1 className="py-2" id={"exercise-title"} style={{marginBottom: "-10px"}}>Övningar</h1>
				<div className="grid-striped" id={"exercise-search-bar"} style={{marginBottom: "-15px"}}>
					<SearchBar 
						id="exercise_searchbar" 
						text={searchText} 
						onChange={setSearchText}
						addedTags={addedTags}
						setAddedTags={setAddedTags}
						suggestedTags={suggestedTags}
						setSuggestedTags={setSuggestedTags}
					/>
				</div>

			</center>
			<ActivityList activities={visibleList} apiPath={"exercises"} detailURL={detailURL}/>

			<br/><br/><br/><br/>
			<RoundButton linkTo={null} onClick={() => setPopupVisible(true)} id={"exercise-round-button"}  style={{maxWidth: "5px"}}>
				<Plus />
			</RoundButton>
			<Popup
				title={"Skapa övning"}
				id={"create-exercise-popup"}
				isOpen={popupVisible}
				setIsOpen={setPopupVisible}
				width={90}
				height={95}
				noBackground={false}
			>
				<ExerciseCreate setShowPopup={setPopupVisible} onClose={handleClosePopup}/>
			</Popup>
		</div>
	)
}

export default ExerciseIndex
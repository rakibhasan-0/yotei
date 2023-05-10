import React, {useState, useEffect, useContext} from "react"
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
	const [visibleList, setVisibleList] = useState([])
	//const [allTags, setAllTags] = useState([])
	//const [usedTags, setUsedTags] = useState([])
	const [selectedTags, setSelectedTags] = useState([])
	const [searchText, setSearchText] = useState("")
	const [addedTags, setAddedTags] = useState([])
	const [suggestedTags, setSuggestedTags] = useState([])
	const { token } = useContext(AccountContext)
	//const uri = props.uri
	const detailURL = "/exercise/exercise_page/"
	const [popupVisible, setPopupVisible] = useState(false)
	const [map, mapActions] = useMap()

	useEffect(() => {
		// getAllTags();
		getAllExercises()
		//getAllExercisesByTag();
		// getSetAmountOfExercises()
	}, [])



	const getAllExercises =  async () => {
		const headers = { token }

		await fetch("/api/exercises/all", {headers})
			.then(res => res.json())
			.then((data) => {
				setVisibleList(data)
			})
			.catch(console.log)
	} 


	useEffect(() => {

		const args = {
			text: searchText,
			selectedTags: selectedTags
		}

		getExercises(args, token, map, mapActions, (result) => {
			setVisibleList(result.results)
			setSuggestedTags(result.tagCompletion)
			console.log(result.results)
			console.log(setSelectedTags) //Temporary, to avoid lint error
		})
	}, [searchText])

	return (
		<div>
			<center>
				<h1 className="py-2">Övningar</h1>
				<SearchBar 
					id="exercise_searchbar" 
					text={searchText} 
					onChange={setSearchText}
					addedTags={addedTags}
					setAddedTags={setAddedTags}
					suggestedTags={suggestedTags}
					setSuggestedTags={setSuggestedTags}
				/>
			</center>
			<ActivityList activities={visibleList}  apiPath={"exercises"} detailURL={detailURL}/>

			<br/><br/><br/><br/>
			<RoundButton linkTo={null} onClick={() => setPopupVisible(true)}>
				<Plus />
			</RoundButton>
			<Popup
				title={"Skapa övning"}
				id={"create-exercise-popup"}
				isOpen={popupVisible}
				setIsOpen={setPopupVisible}
				width={90}
				height={95}
				noBackground={false}>
				<ExerciseCreate setShowPopup={setPopupVisible}/>
			</Popup>
		</div>
	)
}

export default ExerciseIndex
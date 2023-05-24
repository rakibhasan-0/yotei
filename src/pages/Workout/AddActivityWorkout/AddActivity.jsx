import { React, useState, useEffect, useContext } from "react"
import { AccountContext } from "../../../context"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import Modal from "react-bootstrap/Modal"
import useMap from "../../../hooks/useMap"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import { getTechniques, getExercises } from "../../../components/Common/SearchBar/SearchBarUtils"
import TechniqueFilter from "../../../components/Common/Filter/TechniqueFilter"
import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import TechniqueCard from "../../../components/Common/Technique/TechniqueCard/TechniqueCard"
import ExerciseListItem from "../../../components/Common/ExerciseCard/ExerciseListItem"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { ChevronRight } from "react-bootstrap-icons"
import ErrorStateSearch from "../../../components/Common/ErrorState/ErrorStateSearch"
import style from "./AddActivity.module.css"

import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"

/**
 * This component is used to add activities to a workout. It contains two tabs, 
 * one for techniques and one for exercises.
 * 
 * What is an activity? In this case an activity is either a technique or an exercise.
 * 
 * @param {string} id A unique id of the component (Testing purposes)
 * @param {function} setShowActivityInfo Callback function to report selected activities
 *  
 * @author Kraken (Grupp 7)
 * @since 2023-05-23
 */
function AddActivity({ id, setShowActivityInfo }) {

	const { token } = useContext(AccountContext)

	/**
	 * Used to cache techniques and exercises that are fetched from the backend.
	 * This map is used as a parameter when using getTechniques method.
	 */
	const [map, mapActions] = useMap()

	/**
	 * States related to keeping track of which techniques
	 * to display, and the search text, selected belts, kihon 
	 * value and selected tags.
	 */
	const [techniques, setTechniques] = useState([])
	const [searchTechText, setSearchTechText] = useState("")
	const [selectedBelts, setSelectedBelts] = useState([])
	const [kihon, setKihon] = useState(false)
	const [selectedTechTags, setSelectedTechTags] = useState([])
	const [suggestedTechTags, setSuggestedTechTags] = useState([])

	/**
	 * States related to keeping track of which exercises
	 * to display, and the search text and selected tags.
	 */
	const [exercises, setExercises] = useState([])
	const [searchExerText, setSearchExerText] = useState("")
	const [selectedExerTags, setSelectedExerTags] = useState([])
	const [suggestedExerTags, setSuggestedExerTags] = useState([])
	const [fetchedTech, setFetchedTech] = useState(false)
	const [fetchedExer, setFetchedExer] = useState(false)


	/**
	 * Keeps track of which activities that are checked/selected by the user.
	 */
	const [checkedActivities, setCheckedActivities] = useState([])

	/**
	 * Fetches techniques when the component is mounted or when the 
	 * search text, selected belts, kihon value or selected tags are changed.
	 */
	useEffect(() => {
		setFetchedTech(false)
		let filtered = techniques.filter(technique => checkedActivities.includes(technique))
		setTechniques(filtered)
		searchTechniques()

	}, [searchTechText, selectedBelts, kihon, selectedTechTags])

	/**
	 * Fetches exercises when the component is mounted or when the
	 * search text or selected tags are changed.
	 */
	useEffect(() => {
		setFetchedExer(false)
		setExercises(exercises.filter(exercise => checkedActivities.includes(exercise)))
		searchExercises()
	}, [searchExerText, selectedExerTags])

	/**
	 * Function for handling when a belt has been picked from the BeltPicker.
	 * Returns an object that is a list of the selected belts.
	 * 
	 * @param {bool} checked Boolean if the checkbox for the selected belt was already pressed.
	 * @param {object} belt Object that is an list of the selected belts from the BeltPicker.
	 */
	function handleBeltChanged(checked, belt) {
		setSelectedBelts(prev => {
			if (!checked) {
				return prev.filter(b => b.id !== belt.id)
			}
			else {
				return [...prev, belt]
			}
		})
	}

	/**
	 * Function for handling the kihon checkbox in the TechniqueFilter.
	 * 
	 * @param {bool} newKihon True/False if the kihon is selected or not.
	 */
	function handleKihonChanged(newKihon) {
		setKihon(newKihon)
	}

	/**
	 * Handles selecting or deselecting a checkbox for an activity.
	 */
	const onActivityToggle = (activity, type) => setCheckedActivities(prev => {
		if (prev.includes(activity)) {
			return prev.filter(a => a !== activity)
		}
		activity.type = type
		return [...prev, activity]
	})


	/**
	 * Fetches techniques from the backend. But first, the selected belts 
	 * are filtered and parsed to be used in the request. 
	 * 
	 * When new techniques are fetched, the results are filtered to not include
	 * techniques that are checked/selected by the user. Those techniques are
	 * kept in the state to be displayed.
	 */
	const searchTechniques = () => {

		const filteredBelts = []

		selectedBelts.forEach(function (arrayItem) {
			var x = arrayItem.name
			if (arrayItem.child == true) {
				x = x + "-barn"
			}
			filteredBelts.push(x)
		})

		const args = {
			text: searchTechText,
			selectedBelts: filteredBelts,
			kihon: kihon,
			selectedTags: selectedTechTags
		}

		getTechniques(args, token, map, mapActions, (result) => {
			const res = result.results.filter((technique) => !checkedActivities.includes(technique))
			setTechniques((techniques) => [...techniques, ...res])
			setSuggestedTechTags(result.tagCompletion)
			setFetchedTech(true)
		})
	}

	/**
	 * Fetches exercises from the backend.
	 * 
	 * When new exercises are fetched, the results are filtered to not include
	 * exercises that are checked/selected by the user. Those exercises are
	 * kept in the state to be displayed.
	 */
	const searchExercises = () => {

		const args = {
			text: searchExerText,
			selectedTags: selectedExerTags,
		}

		getExercises(args, token, map, mapActions, (result) => {
			result.results = result.results.filter(exercise => !checkedActivities.includes(exercise))
			setExercises((exercises) => [...exercises, ...result.results])
			setSuggestedExerTags(result.tagCompletion)
			setFetchedExer(true)
		})
	}

	return (
		<div id={id}>
			<Modal.Body style={{ padding: "0" }}>
				<Tabs defaultActiveKey="technique" className={style.tabs}>
					<Tab eventKey="technique" title="Tekniker" tabClassName={`nav-link ${style.tab}`}>
						<div className={style.searchBar}>
							<SearchBar
								id="technique-search-bar"
								placeholder="Sök tekniker"
								text={searchTechText}
								onChange={setSearchTechText}
								addedTags={selectedTechTags}
								setAddedTags={setSelectedTechTags}
								suggestedTags={suggestedTechTags}
								setSuggestedTags={setSuggestedTechTags}
							/>
						</div>
						<TechniqueFilter
							belts={selectedBelts}
							onBeltChange={handleBeltChanged}
							kihon={kihon}
							onKihonChange={handleKihonChanged}
							id="test">
						</TechniqueFilter>

						{(techniques.length === 0 && fetchedTech) ?
							<ErrorStateSearch id="add-activity-no-technique" message="Kunde inte hitta tekniker" />
							:
							(<InfiniteScrollComponent>
								{techniques.map((technique, key) => (
									<TechniqueCard
										id={"technique-list-item-" + technique.id}
										checkBox={
											<CheckBox
												checked={checkedActivities.includes(technique)}
												onClick={() => onActivityToggle(technique, "technique")}
											/>
										}
										technique={technique}
										key={key}
									/>
								))}
							</ InfiniteScrollComponent>)
						}

					</Tab>
					<Tab eventKey="exercise" title="Övningar" tabClassName={style.tab}>
						<div className={style.searchBar}>
							<SearchBar
								id="exercise-search-bar"
								placeholder="Sök övningar"
								text={searchExerText}
								onChange={setSearchExerText}
								addedTags={selectedExerTags}
								setAddedTags={setSelectedExerTags}
								suggestedTags={suggestedExerTags}
								setSuggestedTags={setSuggestedExerTags}
							/>
						</div>

						{(exercises.length === 0 && fetchedExer) ?
							<ErrorStateSearch id="add-activity-no-exercise" message="Kunde inte hitta övningar" />
							:
							<InfiniteScrollComponent>
								{exercises.map((exercise, key) => (
									<ExerciseListItem
										id={exercise.id}
										text={exercise.name}
										detailURL={"/exercise/exercise_page/"}
										item={
											<CheckBox
												id=""
												checked={checkedActivities.includes(exercise)}
												onClick={() => onActivityToggle(exercise, "exercise")}
											/>
										}
										key={key}
										index={key}
									/>
								))}
							</InfiniteScrollComponent>
						}
					</Tab>
				</Tabs>
				<RoundButton onClick={() => setShowActivityInfo(checkedActivities)}>
					<ChevronRight width={30} />
				</RoundButton>
			</Modal.Body>
		</div>
	)
}
export default AddActivity

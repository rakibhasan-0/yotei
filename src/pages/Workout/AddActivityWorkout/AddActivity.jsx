import { React, useState, useEffect, useContext } from "react"
import { AccountContext } from "../../../context"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import Modal from "react-bootstrap/Modal"
import useMap from "../../../hooks/useMap"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import { getTechniques, getExercises } from "../../../components/Common/SearchBar/SearchBarUtils"
import TechniqueFilter from "../../../components/Common/Filter/TechniqueFilter"
import "./AddActivity.css"
import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import TechniqueCard from "../../../components/Common/Technique/TechniqueCard/TechniqueCard"
//import Component from "../../../components/Common/List/Component"
import ExerciseListItem from "../../../components/Common/List/Item/ExerciseListItem"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { ChevronRight } from "react-bootstrap-icons"

/**
 * This is an example description.SearchBarUtils
 * 
 * Props:
 *     id @type {string}     - The id of the class
 *     prop2 @type {number}  - A description of prop2
 *     prop3 @type {boolean} - A description of prop3
 *
 * Example usage:
 *     <MyComponent prop1="Hello world!" prop2={42} prop3={true}/>
 *
 * @author Kraken
 * @version 1.0
 * @since 2023-05-09
 */
function AddActivity({id, setShowActivityInfo}) {

	const { token } = useContext(AccountContext)

	const [map, mapActions] = useMap()
	
	//Techniques
	const [techniques, setTechniques] = useState([])
	const [searchTechText, setSearchTechText] = useState("")
	const [selectedBelts, setSelectedBelts] = useState([])
	const [kihon, setKihon] = useState(false)
	const [selectedTechTags, setSelectedTechTags] = useState([])
	const [suggestedTechTags, setSuggestedTechTags] = useState([])

	//Exercises
	const [exercises, setExercises] = useState([])
	const [searchExerText, setSearchExerText] = useState("")
	const [selectedExerTags, setSelectedExerTags] = useState([])
	const [suggestedExerTags, setSuggestedExerTags] = useState([])
	
	const [checkedActivities, setCheckedActivities] = useState([])
	
	useEffect(() => {
		setTechniques(techniques.filter(technique => checkedActivities.includes(technique)))
		searchTechniques()
	}, [searchTechText, selectedBelts, kihon, selectedTechTags])
	

	useEffect(() => {
		setExercises(exercises.filter(exercise => checkedActivities.includes(exercise)))
		searchExercises()
	}, [searchExerText, selectedExerTags])


	const onActivityToggle = (activity, type) => setCheckedActivities(prev => {
		if(prev.includes(activity)) {
			return prev.filter(a => a !== activity)
		}
		activity.type = type
		return [...prev, activity]
	})

	const searchTechniques = () => {

		const filteredBelts = []
		
		selectedBelts.forEach(function (arrayItem) {
			var x = arrayItem.name
			if(arrayItem.child == true) {
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
			result.results = result.results.filter(technique => !checkedActivities.includes(technique))
			setTechniques((techniques) => [...techniques, ...result.results])
			setSuggestedTechTags(result.tagCompletion)
		})
	}

	
	const searchExercises = () => {
		
		const args = {
			text: searchExerText,
			selectedTags: selectedExerTags,
		}

		getExercises(args, token, map, mapActions, (result) => {
			result.results = result.results.filter(exercise => !checkedActivities.includes(exercise))
			setExercises((exercises) => [...exercises, ...result.results])
			setSuggestedExerTags(result.tagCompletion)
		})
	}


	return (
		<div id={id}>
			<Modal.Body>
				<Tabs defaultActiveKey="technique" className="tabs">
					<Tab eventKey="technique" title="Tekniker" tabClassName="tab">
						<div className="searchBar">		
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
						<TechniqueFilter belts={selectedBelts} setBelts={setSelectedBelts} kihon={kihon} setKihon= {setKihon}/>
						{techniques.map((technique, key) => (
							<TechniqueCard
								id={"technique-list-item-" + technique.id}
								checkBox={
									<CheckBox 
										id=""
										checked={checkedActivities.includes(technique)}
										onClick={() => onActivityToggle(technique, "technique")} 
									/>
								}
								technique={technique}
								key={key}
							/>
						))}
					</Tab>
					<Tab eventKey="exercise" title="Övningar" tabClassName="tab">
						<div className="searchBar">
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
						{exercises.map((exercise, key) => (
							<ExerciseListItem
								id={"exercise-list-item-" + key}
								text={exercise.name}
								index={key}
								item={
									<CheckBox 
										id=""
										checked={checkedActivities.includes(exercise)}
										onClick={() => onActivityToggle(exercise, "exercise")} 
									/>
								}
								key={key}
							/>
						))}
					</Tab>
				</Tabs>
				<RoundButton onClick={() => setShowActivityInfo(checkedActivities)}> 
					<ChevronRight width={30}/>
				</RoundButton>
			</Modal.Body>
		</div>
	)
}
export default AddActivity

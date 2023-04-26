import "../Workout/ActivitySelectionList.css"
import WorkoutSelectionListItem from "./WorkoutSelectionListItem"
import SearchBar from "./../Common/SearchBar.js"
import React, {useEffect, useState} from "react"

/**
 * This class is responsible for presenting a list of activities and keeps track of
 * which once are selected
 *
 * @author Kebabpizza (Group 8)
 */
function WorkoutSelectionList({workouts, radioChanged}) {

	const scrollContainerStyle = {maxHeight: "600px" }

	const [visibleList, setVisibleList] = useState(workouts)
	const [searchTerm, setSearchTerm] = useState("")

	useEffect(() =>{
		setVisibleList(workouts.filter(workout => workout.name.toLowerCase().includes(searchTerm)))
	}, [workouts, searchTerm])

	return (
		<>
			<div id="searchBar">
				<SearchBar onSearch={ event=> setSearchTerm(event.target.value.toLowerCase()) }/>
			</div>
			<div className="scrollbar scrollbar-primary" style={scrollContainerStyle}>
				<div className="container grid-striped select-activity-list-container" >
					{visibleList.map((workout, index) => (
						<WorkoutSelectionListItem key={workout.id} workout={workout} radioSelected={selectedWorkout => radioChanged(selectedWorkout)} index={index}/>
					))}

				</div>
			</div>
		</>
	)
}

export default WorkoutSelectionList

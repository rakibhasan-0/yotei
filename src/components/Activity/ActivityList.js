/**
 * Creates the container for the List items. Each item represents a row in the list.
 *
 * @author G3 HAWAII, G8 KEBABPIZZA
 * @param activity The exercise or technique
 * @param apiPath The path to the function (either 'exercises' or 'techniques')
 */
import React, { useState, useContext, useEffect } from "react"
import ListItem from "../Common/ListItem.js"
import TechniqueCard from "../Common/Technique/TechniqueCard/TechniqueCard"
import WorkoutListItem from "../Workout/WorkoutListItem.js"
import WorkoutActivityListItem from "../Workout/WorkoutActivityListItem/WorkoutActivityListItem.jsx"
import { AccountContext } from "../../context"

const ActivityList = ({activities, apiPath, detailURL}) => {
	const { token, userId } = useContext(AccountContext)
	const [favoriteList, setFavoriteList] = useState([])

	useEffect(() => {
		getFavoriteWorkouts(token, userId).then(data => (data.json())).then(data => setFavoriteList(data.map(obj => obj.id)))
        
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="container grid-striped activity-list">
			{apiPath === "workouts" ? 
				activities.map((activity) => <WorkoutListItem key={activity.id} workout={activity} isFavorite={favoriteList.includes(activity.id)}/>)
				:
				apiPath === "workouts/activities" ?
					activities.map((activity, index) => <WorkoutActivityListItem key={activity.id} activity={activity} index={index}/>)
					:    
					apiPath === "techniques" ?
						activities.map((activity) => <TechniqueCard key={activity.id} technique={activity} checkBox={false}/>)
						:
						activities.map((activity, index) => <ListItem key={activity.id} activity={activity} apiPath = {apiPath} detailURL={detailURL} index={index}/>)
						
			}
		</div>
	)
}

async function getFavoriteWorkouts(token, userId) {
	const requestOptions = {
		headers: { "Content-type": "application/json", token }
	}
	const response = await fetch(`/api/workouts/favorites/${userId}`, requestOptions)
	return response
}


export default ActivityList

/**
 * This class is responsible to create the UI for a Workout-item in the list.
 * It's made up by one stripe row with the name and an arrow and redirects the user
 * to the appropriate workout.
 *
 * @author Hot-pepper (Group 7), Cyclops (Group 5)
 * @version 2
 */
import React from "react"
import "./WorkoutListItem.css"
import { Link } from "react-router-dom"
import FavoriteButton from "./WorkoutFavoriteButton"

export default function WorkoutListItem({ workout, isFavorite}) {
	return (
		<div className="row align-items-center font-weight-bold py-2 workout-item-row" key={workout.id}>
			<div className="col-2 workout-star">
				<FavoriteButton workoutId={workout.id} initState={isFavorite}/>
			</div>
			<div className="col-8 align-items-center align-self-center workout-text fill">
				<Link className="text-center workout-name" to={`/workout/${workout.id}`}>{workout.name}</Link>
			</div>
			<Link className="col-2 align-items-center align-self-center" to={`/workout/${workout.id}`}>
				<i id="workout-detail-arrow" className="bi-chevron-right h4"/>
			</Link>
		</div>
	)
}
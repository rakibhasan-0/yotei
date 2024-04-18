/**
 * This class is responsible to create the UI for a Workout-item in the list.
 * It's made up by one stripe row with the name and an arrow and redirects the user
 * to the appropriate workout.
 * 
 * Changes version 3.0:
 *     Added prop showFavorite, to show or not show the favorite button on a workout.
 *
 * @author Hot-pepper (Group 7), Cyclops (Group 5), Medusa (Group 6)
 * @since May 9, 2023
 * @version 3.0
 */
import "./WorkoutListItem.module.css"
import { Link } from "react-router-dom"
import FavoriteButton from "./WorkoutFavoriteButton"

export default function WorkoutListItem({ workout, favoriteCallback, showFavorite = true}) {
	return (
		<div className="row align-items-center font-weight-bold workout-item-row" style={{marginRight: 0, marginLeft: 0}}>
			{showFavorite ? (
				<div className="col-2 workout-star">
					<FavoriteButton workout={workout} favoriteCallback={favoriteCallback}/>
				</div>
			) : <div className="workout-star col-2"/>}
			<Link className="col align-items-center align-self-center workout-text fill" to={`/workout/${workout.workoutID}`}>
				{workout.name}
			</Link>
			<Link className="col-2 align-items-center align-self-center workout-text fill" to={`/workout/${workout.workoutID}`}>
				<i id="workout-detail-arrow" className="bi-chevron-right h4"/>
			</Link>
		</div>
	)
}
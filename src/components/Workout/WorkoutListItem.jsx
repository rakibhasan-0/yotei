/**
 * This class is responsible to create the UI for a Workout-item in the list.
 * It's made up by one stripe row with the name and an arrow and redirects the user
 * to the appropriate workout.
 *
 * @author Hot-pepper (Group 7), Cyclops (Group 5)
 * @since May 9, 2023
 * @version 2
 */
import "./WorkoutListItem.css"
import { Link } from "react-router-dom"
import FavoriteButton from "./WorkoutFavoriteButton"

export default function WorkoutListItem({ workout, favoriteCallback}) {
	return (
		<div className="row align-items-center font-weight-bold workout-item-row">
			<div className="col-2 workout-star">
				<FavoriteButton workout={workout} favoriteCallback={favoriteCallback}/>
			</div>
			<Link className="col align-items-center align-self-center workout-text fill" to={`/workout/${workout.workoutID}`}>
				{workout.name}
			</Link>
			<Link className="col-2 align-items-center align-self-center workout-text fill" to={`/workout/${workout.workoutID}`}>
				<i id="workout-detail-arrow" className="bi-chevron-right h4"/>
			</Link>
		</div>
	)
}
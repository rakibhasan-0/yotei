import React, { useState, useContext } from "react"
import { AccountContext } from "../../context"
import StarButton from "../Common/StarButton/StarButton.jsx"

/**
 * This component is an extension of the star button which includes
 * Favorite logic capabilities.
 *
 * @author Cyclops (Group 5) dv21adt
 * @since May 9, 2023
 */
export default function WorkoutFavoriteButton({id, workout, favoriteCallback}) {
	const { token, userId } = useContext(AccountContext)
	const [ isFavorite, setFavorite ] = useState(workout.favourite)

	return(
		<StarButton id={id} toggled={isFavorite} onClick={handleFavoriteClicked}/>
	)

	async function handleFavoriteClicked(event) {
		const requestOptions = {
			headers: {"Content-type": "application/json", token},
			method: isFavorite ? "DELETE" : "POST",
			body: JSON.stringify({userId: userId, workoutId: workout.workoutID})
		}

		fetch("/api/workouts/favorites", requestOptions).then(response => {
			if(response.ok) {
				setFavorite(!isFavorite)
			}
			else {
				console.log(response)
			}
		})

		if(favoriteCallback) {
			favoriteCallback(event, workout)
		}
	}
}
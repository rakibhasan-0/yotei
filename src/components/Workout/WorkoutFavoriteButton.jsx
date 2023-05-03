import React, { useState, useContext } from "react"
import { AccountContext } from "../../context"
import StarButton from "../Common/StarButton/StarButton.jsx"

/**
 * This component is an extension of the star button which includes
 * Favorite logic capabilities.
 *
 * @author Cyclops (Group 5) dv21adt
 */
export default function FavoriteButton({id, workoutId, initState}) {
	const { token, userId } = useContext(AccountContext)
	const [ isFavorite, setFavorite ] = useState(initState)

	return(
		<StarButton id={id} toggled={isFavorite} onClick={handleFavoriteClicked}/>
	)

	async function handleFavoriteClicked() {
		const requestOptions = {
			headers: {"Content-type": "application/json", token},
			method: isFavorite ? "DELETE" : "POST",
			body: JSON.stringify({userId: userId, workoutId: workoutId})
		}

		fetch("/api/workouts/favorites", requestOptions).then(response => {
			if(response.ok) setFavorite(!isFavorite)
		})
	}
}
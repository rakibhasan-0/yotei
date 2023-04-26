import React, { useState, useEffect, useContext } from "react"
import { AccountContext } from "../../context"

/**
 * This class creates a favorite button instance.
 *
 * @author Hot-pepper (Group 7)
 * @deprecated use StarButton.jsx instead
 */
const FavoriteButton = ({ workoutId, initState }) => {
	const { token, userId } = useContext(AccountContext)
	const [isFavorite, setFavorite] = useState(initState)

	useEffect(() => {
		setFavorite(initState)
	}, [initState])

	/**
     * Called when the user clicks the cleared star. 
     * If successful the workout is added to the users favorite workout list.
     */
	async function favoriteClicked() {
		const requestOptions = {
			headers: {"Content-type": "application/json", token},
			method: "POST",
			body: JSON.stringify({userId: userId, workoutId: workoutId })
		}
		await fetch("/api/workouts/favorites", requestOptions)
		setFavorite(true)
	}

	/**
     * Called when the user clicks the filled(yellow) star. 
     * If successful the workout is removed from the users favorite workout list.
     */
	async function favoriteUnclicked() {
		const requestOptions = {
			headers: {"Content-type": "application/json", token},
			method: "DELETE",
			body: JSON.stringify({userId: userId, workoutId: workoutId})
		}
		await fetch("/api/workouts/favorites", requestOptions)
		setFavorite(false)
	}
    
	return (
		<div id="no-print" className='text-left'>
			{isFavorite ? (
				<button className="override-yellow" onClick={() => favoriteUnclicked()}><i className="bi-star-fill m-auto h3"></i></button>
			) : (
				<button className="override" onClick={() => favoriteClicked()}><i className="bi-star m-auto h3"></i></button>
			)}
		</div>
	)
}

export default FavoriteButton
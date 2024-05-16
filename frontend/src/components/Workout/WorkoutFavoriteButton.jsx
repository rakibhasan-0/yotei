import React, { useState, useContext } from "react"
import { AccountContext } from "../../context"
import StarButton from "../Common/StarButton/StarButton.jsx"
import {toast} from "react-toastify"
import {setError as setErrorToast} from "../../utils"


/**
 * This component is an extension of the star button which includes
 * Favorite logic capabilities.
 *
 * @author Cyclops (Group 5) dv21adt
 * @since May 9, 2023
 */
export default function WorkoutFavoriteButton({id, workout, favoriteCallback = () => {}}) {
	const { token, userId } = useContext(AccountContext)
	const [ isFavorite, setIsFavorite ] = useState(workout.favourite)

	return(
		<div style={{ maxWidth: "40px" }}>
			<StarButton id={id} toggled={isFavorite} onClick={handleFavoriteClicked}/>
		</div>
	)

	async function handleFavoriteClicked(event) {
		const requestOptions = {
			headers: {"Content-type": "application/json", token},
			method: isFavorite ? "DELETE" : "POST",
			body: JSON.stringify({userId: userId, workoutId: workout.workoutID})
		}
		const prev = isFavorite
		setIsFavorite(!isFavorite)
		fetch("/api/workouts/favorites", requestOptions).then(response => {
			if(!response.ok) {
				throw new Error(response.status)
			}
			favoriteCallback(event, workout)
		}).catch(() => {
			setIsFavorite(prev)
			if (toast.isActive("server-error")) return
			setErrorToast("Serverfel: Kunde inte lägga till som favorit!", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true, 
				draggable: false,
				progress: undefined,
				theme: "colored",
				toastId: "server-error",
			})
		})
	}
}
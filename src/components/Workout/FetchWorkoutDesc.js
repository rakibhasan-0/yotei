import React, { useEffect, useState, useContext } from "react"
import "../Activity/activity.css"
import { AccountContext } from "../../context"

/**
 * Creates a fallout row for the description, date, author and duration (if it exists)
 * Fetches the description from the database by the apiPath to workouts.
 * TODO : the date and author is hardcoded "melinda vestberg" atm. will correct
 *        this once the database is working correctly
 * @author Hawaii, Kebabpizza, Capricciosa
 * @param activity The workout
 * @param apiPath The path to the workout api
 * @returns {JSX.Element} The fallout description
 *
 */
const FetchWorkoutDesc = ({workout, apiPath}) => {
	const [out, setOut] = useState({desc: "", duration : "", created: "", authorName: ""})
	const [min, setMin] = useState("")
	const { token } = useContext(AccountContext)

	useEffect(() => {
		const requestOptions = {
			headers: {"Content-type": "application/json", token}
		}

		fetch(`/api/${apiPath}/getdesc/${workout.id}`, requestOptions)
			.then(res => res.json())
			.then(data => {
				fetch(`/user/getname/${workout.author}`, requestOptions)
					.then(res => res.json())
					.then(data2 => {
						data.authorName = data2.username
						setOut(data)
						setMin(data.duration + " min")
					})
			})
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="col">
			<div className="textDesc">{out.desc}</div>
			<div className="text-right listItemTime">{min}</div>

			<div className="row">
				<div className="col created-col">Created {out.created} by {out.authorName}</div>

			</div>
		</div>
	)
}

export default FetchWorkoutDesc
import React, {useContext, useEffect, useState} from "react"
import "./activity.css"
import {AccountContext} from "../../context"

/**
 * Creates a fallout row for the description and duration (if it exists)
 * Fetches the description from the database by the apiPath to either exercise or technique.
 *
 * @author Hawaii
 * @param activity The exercise or technique
 * @param apiPath The path to the api (either 'exercises' or 'techniques')
 * @returns {JSX.Element} The fallout description
 *
 */
const FetchActivityDesc =  ({activity, apiPath}) => {
	const [out, setOut] = useState({description: "",duration : ""})
	const { token } = useContext(AccountContext)

	useEffect(() => {
		const requestOptions = {
			headers: {"Content-type": "application/json", token}
		}

		fetch(`/api/${activity.exerciseId ? "exercises" : activity.techniqueId ? "techniques" : apiPath}/getdesc?id=${activity.exerciseId ? activity.exerciseId : activity.techniqueId ? activity.techniqueId : activity.id}`,requestOptions)
			.then(res => res.json())
			.then(data => {
				setOut(data)

			})
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="col">
			<div className="textDesc">{out.description}</div>
		</div>
	)
}

export default FetchActivityDesc
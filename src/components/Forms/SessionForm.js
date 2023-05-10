import Select from "react-select"
import { useState, useEffect, useContext } from "react"
import { AccountContext } from "../../context"
import TimePicker from "react-time-picker"
import DatePicker from "../Common/DatePicker/DatePicker"
import "../../Globals/DatePicker.css"
import "../../Globals/TimePicker.css"
/**
 * This functional component is used as a form for adding sessions.
 * 
 * @param data 		Describes the details of a Session.
 * @param onClick   The onClick callback that sets form input to an
 * 				    associated state. 
 * 
 * @author Calzone (2022-05-17), Hawaii (2022-05-17)
 */
function SessionForm(props) {

	/**
	 * A state for storing a list of plans to choose from.
	 */
	const [plans, setPlans] = useState([])

	/* Local names for entered data */
	var name = props.data.name
	var time = props.data.time

	
	var okDate = props.dateOk // eslint-disable-line no-unused-vars
	var buttonClicked = props.buttonClicked // eslint-disable-line no-unused-vars

	var onClickPlan = props.onClickPlan
	var onClickData = props.onClickData

	/**
	 * Gets the token for the user
	 */
	const { token } = useContext(
		AccountContext
	)

	/**
	 * Fetches the data for displaying the plans in a list
	 */
	async function getPlans() {

		var json

		try {
			const response = await fetch("/api/plan/all", { headers: { token } })
			json = await response.json()

		} catch (error) {
			alert("Could not find details about the plans")
		}

		const updatedPlans = json.map(({ id, name, color, userId }) => ({
			plan: id,
			name: name,
			color: color,
			userId: userId,
			label: name
		}))

		setPlans(updatedPlans)
	}

	/**
	 * Is called when the component is mounted 
	 */
	useEffect(() => {
		getPlans()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps


	return (
		<form className="d-flex flex-column">

			{/* Ask the user for the name of the session */}
			Välj planering
			<div>
				<Select
					placeholder={name ? <div style={{ color: "black" }}>{name}</div> : "Välj en planering"}
					options={plans}
					isSearchable="true"
					value={name}
					defaultValue={name}
					noOptionsMessage="Det finns inga planeringar"
					onChange={(e) => { onClickPlan("plan", e.plan, "name", e.name) }}
				/>
			</div>

			{/* Ask the user for the date of the session */}
			<label htmlFor="date">
				Datum
				<DatePicker
					onChange={(e) => { onClickData("date", e.target.value) }}
				/>
			</label>

			{/* Ask the user for the sessions starting time */}
			<label htmlFor="dayTime">
				Tid
				<div className="div-day-selected-container">
					<div>
						<TimePicker 
							locale="sv-SV"
							name="time"
							id="time"
							type="time"
							className="DateTimePicker form-control"
							format="H:mm"
							maxTime="23:59"
							minTime="00:00"
							disableClock={true}
							value={time}
							onChange={(e) => onClickData("time", e)}
						/>
					</div>
				</div>
			</label>
			
		</form>
	)
}

export default SessionForm

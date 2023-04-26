import { React, useState, useContext } from "react"
import { AccountContext } from "../../context"
import PlanForm from "../../components/Forms/PlanForm"
import GoBackButton from "../../components/Common/GoBackButton"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Check } from "react-bootstrap-icons"

/**
 * This is a page containing components to allow creation of 'Plan'
 * objects.
 *
 * Contains a form for collecting a name, colour, start & end dates.
 * As well as checkboxes, indicating which day of the week to
 * include.
 *
 * @author Calzone (2022-05-13), Hawaii (2022-05-13)
 */
function PlanCreate() {

	/**
     * Gets the token for the user
     */
	const { token, userId } = useContext(AccountContext)

	/**
     * Local model of a plan.
     */
	const [planData, setPlanData] = useState({
		name: "",
		color: "#000000",
		startDate: "",
		endDate: "",
		weekdaysSelected: false
	})

	/**
     * A state representing each day of the week. The boolean values are used for deciding which days should be displayed.
     * The user can choose a time for each day.
     */
	const [weekdays, setWeekdays] = useState([
		{ name: "Mån", value: false, time: "" },
		{ name: "Tis", value: false, time: "" },
		{ name: "Ons", value: false, time: "" },
		{ name: "Tors", value: false, time: "" },
		{ name: "Fre", value: false, time: "" },
		{ name: "Lör", value: false, time: "" },
		{ name: "Sön", value: false, time: "" }
	])

	/**
     * Checks if any weekdays selected
     * Return true if 1+ weekdays selected, false if none
     */
	function setWeekdaysSelected() {
		for (let i = 0; i < weekdays.length; i++) {
			if (weekdays[i].value === true) {
				setPlanData({ ...planData, weekdaysSelected: true})
				return true
			}
		}
		setPlanData({ ...planData, weekdaysSelected: false})
		return false
	}

	/**
     * Will hold the dates for the weekdays
     * initially selected in the form.
     */
	var firstDatesArray = []

	/**
     * Will hold the dates for all weekdays
     * selected in the form, between the
     * starting date and ending date.
     */
	var allDatesArray = []

	/**
     * Model of what fields are correctly modeled.
     */
	const [fieldCheck, setFieldCheck] = useState({
		name: false,
		startDate: false,
		endDate: false,
		buttonClicked: false
	})

	/**
     *
     */
	const [displayAlert, setDisplayAlert] = useState()

	/**
     * Is called when the data is modified by the form.
     * Updates the local data.
     *
     * @param variableName  The name of the variable being updated.
     * @param value         The updated value.
     */
	const dataClickHandler = (variableName, value) => {
		setPlanData({ ...planData, [variableName]: value })
	}

	/**
     * Is called when a weekday is chosen in the form.
     * Updates the local data.
     *
     * @param dayName   The 3-4 letter name of the day.
     */
	const weekdayClickHandler = (dayName) => {

		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.value = !dayRow.value
				setWeekdays({ ...weekdays, [i]: dayRow })
				break
			}
		}
		setWeekdaysSelected()
	}

	/**
     * Is called when the time slot for a day is modified in the form.
     * Updates the local data.
     *
     * @param dayName   The 3-4 letter name of the day.
     * @param value     The time value.
     */
	const dayTimeClickHandler = (dayName, value) => {

		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.time = value
				setWeekdays({ ...weekdays, [i]: dayRow })
				break
			}
		}
	}

	/**
    * Function for api call when creating a plan
    */
	async function addPlan() {

		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": token },
			body: JSON.stringify({ name: planData.name, color: planData.color, userId: userId })
		}

		if (validateForm()) {

			/* Post Plan */
			try {
				const response = await fetch("/api/plan/add", requestOptions)
				const res = await response.json()

				/* Success */
				if (response.ok)
					dateHandler(res.id)

			} catch (error) {
				console.log(error)
				failureAlert()
			}
		}
	}

	/**
     * Function for api call when creating a plan
     */
	async function addSessions() {

		allDatesArray = allDatesArray.map(session => {
			let x = new Date(session.date)
			let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60
			let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60
			x.setHours(hoursDiff)
			x.setMinutes(minutesDiff)
			x.setDate(x.getDate()+2)
			return { ...session, date: new Date(x)}
		})

		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": token },
			body: JSON.stringify(allDatesArray)
		}

		/* Post Sessions */
		try {
			const response = await fetch("/api/session/addList", requestOptions)
			await response.json()

			if (response.ok) {
				successAlert()
			}

		} catch (error) {
			failureAlert("Tillfällen kunde inte läggas till.")
			console.log(error)
		}
	}

	/**
     * Handles the dates for the chosen sessions. Populates allDatesArray with
     * the days chosen by the user within the span
     * between startDate and endDate.
     *
     * @param plan  the id of the created plan
     */
	function dateHandler(plan) {

		/* Format Date to ISO standard (YYYY-MM-DD) */
		const formatDate = (date) => {
			const [dateStr] = new Date(date).toISOString().split("T")
			return dateStr
		}

		/* Check for start and end date */
		if (fieldCheck.startDate) {
			if (fieldCheck.endDate) {

				let startDate = new Date(planData.startDate)
				let endDate = new Date(planData.endDate)
				let dayNr = startDate.getDay()

				var tempDate
				var tempTime

				/* Find first date occurences of chosen weekdays */
				for (var i = 0; i < 7; i++) {

					if (weekdays[dayNr].value) {

						tempDate = new Date(startDate)
						tempTime = weekdays[dayNr].time

						firstDatesArray.push({ date: tempDate, time: tempTime })
					}

					/* Update loop variables */
					dayNr = (dayNr + 1) % 7
					startDate.setDate(startDate.getDate() + 1)
				}

				/* If days chosen */
				if (firstDatesArray.length !== 0) {

					/* Find all date occurences of chosen weekdays */
					firstDatesArray.forEach((e) => {

						tempDate = new Date(e.date)
						tempTime = e.time

						while (tempDate <= endDate) {

							allDatesArray.push({ plan: plan, date: formatDate(tempDate), time: tempTime })

							tempDate.setDate(tempDate.getDate() + 7)
						}
					})

					/* Add plan id to each object in array */
					allDatesArray = allDatesArray.map(session => {
						return { plan: plan, ...session }
					})

					addSessions()
				}
				else
					successAlert()
			}
		}
	}

	/**
     * A function that checks that a given field in the form is not empty.
     * Updates the fieldCheck useState.
     *
     * @param fieldName     The name of the field being checked
     * @returns             If the field is not empty.
     */
	function checkNotEmpty(fieldName) {

		const value = planData[fieldName]
		const isEmpty = value === undefined || value === null || value === ""

		if (!fieldCheck[fieldName]) {
			if (!isEmpty)
				setFieldCheck({ ...fieldCheck, [fieldName]: true })
		}
		else {
			if (isEmpty)
				setFieldCheck({ ...fieldCheck, [fieldName]: false })
		}

		return fieldCheck[fieldName]
	}

	/**
     * A function that checks if both date-fields are empty, or a given
     * date-field in the form is not empty.
     *
     * @param dateFieldName The name of the date-field being checked
     * @returns             True if both date fields are empty.
     *                      Else returns whether the field is not empty.
     */
	function checkDate(dateFieldName) {

		checkNotEmpty("startDate")
		checkNotEmpty("endDate")

		if (!fieldCheck.startDate && !fieldCheck.endDate)
			return true

		else
			checkNotEmpty(dateFieldName)

		return fieldCheck[dateFieldName]
	}

	/**
     * A function that updates the displayAlert useState with a success message.
     *
     * @returns     True
     */
	function successAlert() {
		setDisplayAlert(
			<div className="alert alert-success" role="alert">
                Planeringen {planData.name} lades till med färg {planData.color}.
			</div>
		)
		return true
	}

	/**
     * A function that updates the displayAlert useState with a fail message.
     * The message is appended by a given body.
     *
     * @param body  The string to append the message
     *
     * @returns     False
     */
	function failureAlert(body) {
		setDisplayAlert(
			<div className="alert alert-danger"
				role="alert">
                Planeringen {planData.name} kunde inte läggas till. {body}
			</div>
		)
		return false
	}

	/**
     * A function that will validate the users input.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean
     */
	function validateForm() {

		var res = false

		if (fieldCheck.startDate || fieldCheck.endDate) {

			if (fieldCheck.endDate && planData.endDate < planData.startDate)
				res = failureAlert("Det valda slut-datumet är före det valda start-datumet.")
			else if (!fieldCheck.name || !fieldCheck.startDate || !fieldCheck.endDate)
				res = failureAlert("Vänligen fyll i alla fält.")
			else
				res = true
		}
		else {
			if (!fieldCheck.name && fieldCheck.buttonClicked)
				res = failureAlert("Vänligen fyll i namn.")
			else
				res = successAlert()
		}
		setFieldCheck({ ...fieldCheck, buttonClicked: false })
		return res
	}


	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-8">
					<h2 className="display-4 text-center">
						<strong>Skapa planering</strong>
					</h2>

					{/*Form to get input from user*/}
					<PlanForm
						planData={planData}
						weekdays={weekdays}
						onClickData={dataClickHandler}
						onClickWeekday={weekdayClickHandler}
						onClickDayTime={dayTimeClickHandler}
						okName={checkNotEmpty("name")}
						okStartDate={checkDate("startDate")}
						okEndDate={checkDate("endDate")}
						buttonClicked={fieldCheck.buttonClicked}
					/>

					{/*Button for the form. Retrieves the users input*/}
					<RoundButton onClick={() => { addPlan().then(() => { setFieldCheck({ ...fieldCheck, buttonClicked: true }) }) }}>
						<Check />
					</RoundButton>


					<GoBackButton confirmationNeeded={
						!((planData.name === undefined || planData.name === "")
                        && (planData.color === undefined || planData.color === "#000000")
                        && (planData.startDate === undefined || planData.startDate === "")
                        && (planData.endDate === undefined || planData.endDate === "")
                        && (!planData.weekdaysSelected))
					} />
					{fieldCheck.buttonClicked ? displayAlert : ""}
				</div>
			</div>
		</div>
	)
}

export default PlanCreate

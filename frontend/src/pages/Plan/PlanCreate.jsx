import { React, useState, useContext, useEffect } from "react"
import { AccountContext } from "../../context"
import { useNavigate } from "react-router"
import PlanForm from "../../components/Forms/PlanForm.jsx"
import styles from "./PlanCreate.module.css"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"
import { unstable_useBlocker as useBlocker } from "react-router"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
    
/**
 * This is a page containing components to allow creation of 'Plan'
 * objects.
 *
 * Contains a form for collecting a name, colour, start & end dates.
 * As well as checkboxes, indicating which day of the week to
 * include.
 *
 * @author Calzone (2022-05-13), Hawaii (2022-05-13), Squad 2 Griffin, Team Mango (2024-04-22), Team Durian (Group 3) (2024-04-23)
 */

export default function PlanCreate() {


	/**
	 * Blocking state for the page. 
	 */
	const [isBlocking, setIsBlocking] = useState(false)


	/**
	 * A state for the popup that appears when the user tries to navigate away from the page.
	 */
	const [goBackPopup, setGoBackPopup] = useState(false)

	/**
	 * Blocks navigation away from the page if the user has unsaved changes.
	 */
	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})

	/**
     * Gets the token for the user
     */
	const { token, userId } = useContext(AccountContext)
	
	/**
	 * The red thing around the textinput field...
	 */
	const [textInputErrorMsg,setTextInputErrorMsg] = useState("")

	const navigate = useNavigate()

	/**
     * Local model of a plan.
     */
	const [planData, setPlanData] = useState({
		name: "",
		startDate: "",
		endDate: "",
		weekdaysSelected: false,
	})

	/**
     * A state representing each day of the week. The booleafieldCheckn values are used for deciding which days should be displayed.
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

	const [beltsChosen, setBelts] = useState([])

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
	})

	/**
     * Is called when the data is modified by the form.
     * Updates the local data.
     *
     * @param variableName  The name of the variable being updated.
     * @param value         The updated value.
     */
	const dataClickHandler = (variableName, value) => {
		setTextInputErrorMsg("")
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
		setIsBlocking(false)
		if (validateForm()) {

			const requestOptions = {
				method: "POST",
				headers: { "Content-type": "application/json", "token": token },
				body: JSON.stringify({ name: planData.name, belts: beltsChosen, userId: userId })
			}

			/* Post Plan */
			try {
				const response = await fetch("/api/plan/add", requestOptions)

				/* Success */
				if (response.ok){
					const res = await response.json()
					dateHandler(res.id)

									
					setSuccessToast("Gruppen "+ planData.name +" lades till")
					navigate(-1)
				} else {
					if (response.status == 409) {
						setTextInputErrorMsg("Gruppnamnet finns redan")
					}
				}
			} catch (error) {
				setErrorToast("Kunde inte skapa gruppen.")
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
			x.setDate(x.getDate()+1)
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
				setSuccessToast("Tillfällen lades till.")
			}

		} catch (error) {
			setErrorToast("Tillfällen kunde inte läggas till.")
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
				let dayNr = startDate.getDay() -1

				var tempDate
				var tempTime

				/* Find first date occurences of chosen weekdays */
				for (var i = 0; i < 7; i++) {

					if (weekdays[dayNr].value) {

						tempDate = new Date(startDate)
						tempTime = weekdays[dayNr].time.target.value + ":00"

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
     * A function that will validate the users input.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean
     */
	function validateForm() {
		var res = true
		
		if (!fieldCheck.name){
			setTextInputErrorMsg("Vänligen fyll i namn.")
			res = false
		}

		if (beltsChosen.length == 0) {
			setErrorToast("Vänligen välj bälten till gruppen.")
			res = false
		}

		if (!(fieldCheck.startDate && fieldCheck.endDate)) {
			setErrorToast("Vänligen välj start- och slutdatum.")
			res = false
		} 
		else if (planData.endDate < planData.startDate) {
			setErrorToast("Det valda startdatumet är senare än det valda slutdatumet.")
			res = false
		}

		for (let i = 0; i < 7; i++) {
			const day = weekdays[i]
			if (day.value && day.time == "") {
				setErrorToast("Du måste ge tid till varje aktiv dag")
				res = false
				break
			}
		}

		return res
	}

	/**
	 * Side effect that blocks navigation if any of the form states have been changed.
	 */
	useEffect(() => {
		setIsBlocking(planData.name != "" || planData.startDate != "" || planData.endDate != "" || beltsChosen.length != 0)
	}, [planData, weekdays, beltsChosen, fieldCheck])
	
	return (
		<div className={styles.plan_create}>
			<div className="overflow-visible">
				<div>
					<title>Skapa grupp</title>
					<h1 className={styles.title}>Skapa grupp</h1>

					{/*Form to get input from user*/}
					<PlanForm
						planData={planData}
						weekdays={weekdays}
						belts={beltsChosen}
						setBelts={setBelts}
						onClickData={dataClickHandler}
						onClickWeekday={weekdayClickHandler}
						onClickDayTime={dayTimeClickHandler}
						okName={checkNotEmpty("name")}
						okStartDate={checkDate("startDate")}
						okEndDate={checkDate("endDate")}
						submitClicked={addPlan}
						backClicked={() => navigate(-1)}
						textInputErrorMsg={textInputErrorMsg}
					/>
					<ConfirmPopup 
						showPopup={goBackPopup}
						setShowPopup={setGoBackPopup}
						popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
						confirmText="Lämna"
						backText="Avbryt"
						onClick={async () => {
							blocker.proceed()
						}}
					/>
				</div>
			</div>
		</div>
	)
}
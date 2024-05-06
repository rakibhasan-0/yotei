import { React, useState, useContext, useEffect } from "react"
import { AccountContext } from "../../context"
import { useNavigate } from "react-router"
import PlanForm from "../../components/Forms/PlanForm.jsx"
import styles from "./SessionsCreate.module.css"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"
import { unstable_useBlocker as useBlocker } from "react-router"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import { useLocation } from "react-router-dom"
import Dropdown from "../../components/Common/List/Dropdown"
import Divider from "../../components/Common/Divider/Divider.jsx"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import WeekdayTimePicker from "../../components/Plan/WeekdayTimePicker.jsx"
import Button from "../../components/Common/Button/Button.jsx"


/**
 * Page for creating multiple sessions for a group, similar to PlanCreate but enables the user to create
 * multiple session for a already existing group.
 * 
 * 
 * Contains a form for collecting the group selected, start & end dates.
 * As well as checkboxses indicating which day of the week to include
 * 
 * @author Team Kiwi
 * @since 2024-05-03
 */


export default function SessionsCreate(){

	


	const today = new Date()
	const twoYearsFromNow = new Date()
	twoYearsFromNow.setFullYear(today.getFullYear()+2)

    const { state } = useLocation()
    const navigate = useNavigate()
    const { token } = useContext(AccountContext)

    const [groups, setGroups] = useState()
    const [group, setGroup] = useState(state?.session?.group)
    const [groupError, setGroupError] = useState()
    
    const [goBackPopup, setGoBackPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)

	


    useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/plan/all", { headers: { token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					throw new Error("Could not fetch groups")
				}
				setGroups(await response.json())
			} catch (ex) {
				setErrorToast("Kunde inte hämta alla grupper")
				console.error(ex)
			}
		})()
	}, [token])


/**
     * Local model of a plan.
     */
	const [planData, setPlanData] = useState({
		group: "",
		startDate: "",
		endDate: "",
		weekdaysSelected: false,
	})



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
		group: false,
		startDate: false,
		endDate: false,
	})

	/**
     * Is called when the data is modified.
     * Updates the local data.
     *
     * @param variableName  The name of the variable being updated.
     * @param value         The updated value.
     */
	const dataClickHandler = (variableName, value) => {
		setPlanData({ ...planData, [variableName]: value })
		console.log(planData)
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
     * Handles the dates for the chosen sessions. Populates allDatesArray with
     * the days chosen by the user within the span
     * between startDate and endDate.
     *
     * @param plan  the id of group
     */
	function dateHandler(plan) {


		checkNotEmpty("name") 
		checkDate("startDate") 
		checkDate("EndDate")
	

		if(validateForm()){
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
					console.log("Inside DateHandler")
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
							return { plan: plan.id, ...session }
						})
	
						addSessions()
					} 
				}
			}

		}
		/* Format Date to ISO standard (YYYY-MM-DD) */
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
		allDatesArray.forEach((session) =>{
			session.plan = group.id
		})
		console.log(allDatesArray)
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
				navigate(-1)
			}

		} catch (error) {
			setErrorToast("Tillfällen kunde inte läggas till.")
		}
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
		

		if(!group){
			setErrorToast("Vänligen välj en grupp")
			res = false;
		}
		else if (!(fieldCheck.startDate && fieldCheck.endDate)) {
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
		setIsBlocking(group != "" || planData.startDate != "" || planData.endDate != "")
	}, [group, weekdays, fieldCheck])
	





    return (
        <>
            {/* <ConfirmPopup
				confirmText={"Lämna"}
				backText={"Avbryt"}
				id={"session-create-leave-page-popup"}
				showPopup={goBackPopup}
				onClick={blocker.proceed}
				setShowPopup={setGoBackPopup}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
			/> */}
			<title>Skapa flera tillfällen</title>
			<h1 style={{ marginTop: "2rem" }}>Skapa flera tillfällen</h1>
			<Divider option={"h2_left"} title={"Grupp"} />
            <Dropdown errorMessage={groupError} id={"session-dropdown"} text={group?.name || "Grupp"} centered={true}>
				{groups?.length > 0 ? groups.map((plan, index) => (
					<div className={styles.dropdownRow} key={index} onClick={() =>{ 
						setGroup(plan)
						}}>
						<p className={styles.dropdownRowText}>{plan.name}</p>
					</div>
				)) : <div className={styles.dropdownRow}>
					<p className={styles.dropdownRowText}>Kunde inte hitta några grupper</p>
				</div>}
			</Dropdown>

			<Divider title="Period" option="h2_left"/>
			<div className={styles.start_end_date}>
				<p className={styles.p_date_name}>Från:</p>
				<div className={styles.p_date_picker}>
					<DatePicker 
						id="start-date-picker"
						onChange={(e) => {dataClickHandler("startDate", e.target.value) }} 
						minDate={dateFormatter(today)}   
					/>
				</div>
				<p className={styles.p_date-name}>Till:</p>
				<div className={styles.p_date_picker}>
					<DatePicker 
						id="end-date-picker"
						onChange={(e) => {dataClickHandler("endDate", e.target.value) }}
						maxDate={dateFormatter(twoYearsFromNow)}
					/>
				</div>
			</div>
			<Divider title="Dagar" option="h2_left"/>
			<div style={{marginTop: "20px"}}>
				<div className={styles.weekday_container}>
					<div className={styles.div_week_day_time}>
						<WeekdayTimePicker 
							dayName="Mån" 
							weekdays={weekdays}
							weekdayClickHandler={weekdayClickHandler}
							dayTimeClickHandler={dayTimeClickHandler}
						/>
						<WeekdayTimePicker 
							dayName="Tis" 
							weekdays={weekdays}
							weekdayClickHandler={weekdayClickHandler}
							dayTimeClickHandler={dayTimeClickHandler}
						/>
						<WeekdayTimePicker 
							dayName="Ons" 
							weekdays={weekdays}
							weekdayClickHandler={weekdayClickHandler}
							dayTimeClickHandler={dayTimeClickHandler}
						/>
						<WeekdayTimePicker 
							dayName="Tors" 
							weekdays={weekdays}
							weekdayClickHandler={weekdayClickHandler}
							dayTimeClickHandler={dayTimeClickHandler}
						/>
						<WeekdayTimePicker 
							dayName="Fre" 
							weekdays={weekdays}
							weekdayClickHandler={weekdayClickHandler}
							dayTimeClickHandler={dayTimeClickHandler}
						/>
						<WeekdayTimePicker 
							dayName="Lör" 
							weekdays={weekdays}
							weekdayClickHandler={weekdayClickHandler}
							dayTimeClickHandler={dayTimeClickHandler}
						/>
						<WeekdayTimePicker 
							dayName="Sön"
							weekdays={weekdays}
							weekdayClickHandler={weekdayClickHandler}
							dayTimeClickHandler={dayTimeClickHandler}
						/>
					</div>
				</div>
			</div>
			<div className={styles.button_container}>
				<Button 
					//onClick={navigate(-1)}
					outlined={true}
				>
					<p>
						Tillbaka
					</p>
				</Button>
				<Button onClick = {() => { 
							dateHandler(planData)}}
				>
					<p>
						Gå vidare
					</p>
				</Button>
			</div> 
        
        </>
    )
}

/**
	 * Formats given date to a string with formatting 'YYYY-MM-DD'
	 * 
	 * @param { string } today - Date to be formatted.
	 * @returns Date as a string on the correct format.
	 */
function dateFormatter(today) {
	const date = today
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return [year, month, day].join("-")
}
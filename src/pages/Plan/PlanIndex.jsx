import { useContext, useEffect, useState } from "react"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import { AccountContext } from "../../context"
import FilterPlan from "../../components/Plan/FilterPlan"
import SessionList from "../../components/Plan/SessionList"
import PopupAdd from "../../components/Plan/PopupAdd"

/**
 * PlanIndex is the page that displays group plannings. Contains of a 
 * FilterPlan-component and a SessionList. Fetches and filters sessions 
 * depending on what is selected as selected plans(groups) in the FilterPlan-component.
 * If nothing is selected, the default is from todays date until inf.
 * TODO: PlanIndex is error handling on fetches(react toast).
 * 
 * @author Griffin
 * @version 1.0
 * @since 2023-05-24
 */
export default function PlanIndex() {
	const { token } = useContext(AccountContext)
	const [ plans, setPlans ] = useState()
	const [ workouts, setWorkouts ] = useState()
	const [sessions, setSessions] = useState()
	const [showPopup, setShowPopup] = useState(false)
	
	// Filtering props
	const [ selectedPlans, setSelectedPlans ] = useState([])
	const [ dates, setDates ] = useState({
		from: dateFormatter(new Date()),
		to: "9999-12-31"
	})

	// Filtering handles
	function handleSelPlansChange(newSelectedPlans) {
		setSelectedPlans(newSelectedPlans)
	}
	function handleDatesChange(variableName, value) {
		setDates({...dates, [variableName]: value})
	}
	
	// Triggered on page load and when dates or selected plans change.
	useEffect(() => {
		const fetchData = async () => {
			var fetchedPlans, fetchedSessions, fetchedWorkouts
			
			if (selectedPlans.length === 0) {
				//Fetch all if no selected plans was returned from FilterPlan.
				fetchedPlans = await fetchAllPlans()
				fetchedSessions = await fetchAllSessions()
			} 
			else{
				//Fetch only sessions connected to plans selected in FilterPlan.
				fetchedPlans = selectedPlans
				var planIds = plans.map(obj => obj.id).flat()
				fetchedSessions = await fetchSessionsByPlans(planIds)
			}

			fetchedWorkouts = await fetchAllWorkouts()

			// Filter session according to selected date interval.
			let filteredSessions = Object.values(fetchedSessions).filter(session => {
				const sessionDate = new Date(session.date)
				const fromDate = new Date(dates.from)
				const toDate = new Date(dates.to)
			
				return sessionDate >= fromDate && sessionDate <= toDate
			})
			
			//Update state with filtered plans, sessions and workouts.
			setPlans(fetchedPlans)
			setSessions(filteredSessions)
			setWorkouts(fetchedWorkouts)
		}
		fetchData()
	}, [ dates, selectedPlans ])

	async function fetchAllPlans() {
		return await fetch("api/plan/all", {
			headers: { token }
		})
			.then(async data => {
				const plans = await data.json()
				return plans
			})
			.catch(function() {
				
			})
	}

	async function fetchAllWorkouts(){
		return await fetch("api/workouts/all", {
			headers: { token }
		})
			.then(async data => {
				const workouts = await data.json()
				return workouts
			})
			.catch(function() {
			
			})
	}

	async function fetchAllSessions(){
		
		return await fetch("api/session/all", {
			headers: { token }
		})
			.then(async data => {
				const sessions = await data.json()
				return sessions
			})
			.catch(function() {
			
			})
	}

	async function fetchSessionsByPlans(planIds){
		
		let ids = planIds.join("&id=")
		return await fetch("api/session/getByPlans?id="+ids, {
			headers: { token }
		})
			.then(async data => {
				const sessions = await data.json()
				return sessions
			})
			.catch(function() {
			
			})
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

	return (
		<center>
			<h1>Grupplanering</h1>
			<FilterPlan
				id={42}
				setChosenGroups={handleSelPlansChange}
				onDatesChange={handleDatesChange}
				chosenGroups={selectedPlans}
				dates={dates}
			>
			</FilterPlan>

			<div>
				{
					(plans && sessions && workouts) &&
					<SessionList id = {"sessionlistID"} plans={plans} sessions={sessions} workouts={workouts}/>
				}
			</div>	
			
			<RoundButton onClick={() => setShowPopup(true)}>
				<Plus />
			</RoundButton>

			<PopupAdd id={"popupAddId"} isOpen={showPopup} setIsOpen={setShowPopup}/>
		</center>
	)

	
}
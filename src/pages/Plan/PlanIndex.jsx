import { useContext, useEffect, useState } from "react"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import { AccountContext } from "../../context"
import FilterPlan from "./FilterPlan"
import SessionList from "../../components/Plan/SessionList"
import Spinner from "../../components/Common/Spinner/Spinner"
import {People} from "react-bootstrap-icons"
import Button from "../../components/Common/Button/Button"
import {Link} from "react-router-dom"

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
	const twoYears = new Date()
	twoYears.setFullYear(twoYears.getFullYear()+2)


	const [loading, setLoading] = useState(true)
	
	// Filtering props
	const [ selectedPlans, setSelectedPlans ] = useState([])
	const [ dates, setDates ] = useState({
		from: dateFormatter(new Date()),
		to: dateFormatter(twoYears)
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
				var planIds = selectedPlans.map(obj => obj.id).flat()
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
			setLoading(false)
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
			{/* TODO: Improve this later, its a hotfix because FilterPlan is bad */}
			<div style={{ marginTop: "-25px", marginLeft: "auto", width: "fit-content", transform: "translateY(100%)" }}>
				<Link to={"/groups"}>
					<Button width="fit-content">
						<People />
					</Button>
				</Link>
			</div>
			<FilterPlan
				id={42}
				setChosenGroups={handleSelPlansChange}
				onDatesChange={handleDatesChange}
				chosenGroups={selectedPlans}
				dates={dates}
			>
			</FilterPlan>

			{loading ? <Spinner /> : <div>
				{
					(plans && sessions && workouts) &&
					<SessionList id = {"sessionlistID"} plans={plans} sessions={sessions} workouts={workouts}/>
				}
			</div>}
			
			<RoundButton linkTo={"/session/create"}>
				<Plus />
			</RoundButton>

		</center>
	)	
}
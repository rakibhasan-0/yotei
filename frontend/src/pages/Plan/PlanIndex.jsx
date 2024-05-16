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
import { useCookies } from "react-cookie"
import { HTTP_STATUS_CODES, setError } from "../../utils"

/**
 * PlanIndex is the page that displays group plannings. Contains a 
 * FilterPlan-component and a SessionList. Fetches and filters sessions 
 * depending on what is selected as selected plans(groups) in the FilterPlan-component.
 * If nothing is selected, the default is from todays date until inf.
 * TODO: PlanIndex is error handling on fetches(react toast).
 * 
 * @author Griffin, Team Durian (Group 3) (2024-04-23), Team Mango (Group 4) (2024-05-10)
 * @version 1.0
 * @since 2023-05-24
 * Updates: 2024-05-10: Added a toggle for a new checkbox. The filtering part does not work yet.
 */
export default function PlanIndex() {
	const { token } = useContext(AccountContext)
	const [ cookies, setCookie ] = useCookies("plan-filter")

	const [ plans, setPlans ] = useState()
	const [ workouts, setWorkouts ] = useState()
	const [ sessions, setSessions ] = useState()
	const twoYears = new Date()
	twoYears.setFullYear(twoYears.getFullYear()+2)

	const [ loading, setLoading ] = useState(true)

	const [ groups, setGroups ] = useState() //TODO comment usage.
	const [ onlyMyGroups, setOnlyMyGroups ] = useState(true) //TODO comment usage.

	const user = useContext(AccountContext) //Needed to get the userId to get only this user's groups.
	
	// Filtering props
	const [ selectedPlans, setSelectedPlans ] = useState(cookies["plan-filter"] ? cookies["plan-filter"].plans : [])
	const [ dates, setDates ] = useState({
		from: dateFormatter(new Date()),
		to: dateFormatter(twoYears)
	})

	useEffect(() => {
		const filterCookie = cookies["plan-filter"]
		if(filterCookie) {
			if(filterCookie.from)
				setDates({...dates, from: filterCookie.from})

			if(filterCookie.to)
				setDates({...dates, to: filterCookie.to})
		}
		loadWorkouts()
		loadPlans()
	}, [])

	function handleDatesChange(variableName, value) {
		let newD = new Date(value)
		let from = new Date(dates.from)
		let to = new Date(dates.to)
		if(variableName == "from") {
			setDates(newD > to ? {from: value, to: value} : {...dates, from: value})
		}
		else if(newD >= from) {
			setDates({...dates, [variableName]: value})
		}
	}

	useEffect(() => {
		const filterCookie = cookies["plan-filter"]

		if (filterCookie) {
			setSelectedPlans(filterCookie.plans)
			setDates({to: filterCookie.to, from: filterCookie.from})
		}
	}, [])
	
	// Triggered on page load and when dates or selected plans change.
	useEffect(() => {
		let args = {
			from: dates.from, 
			to: dates.to,
			plans: selectedPlans
		}
		setCookie("plan-filter", args, { path: "/" })
		let fetchSessionPath = "api/session/all"
		let planIds = selectedPlans.join("&id=")
		console.log("DEFAULT PLANIDS: " + planIds)
		if (selectedPlans && selectedPlans.length > 0) {
			//Fetch only sessions connected to plans selected in FilterPlan.
			// (plans = groups)
			fetchSessionPath = "api/session/getByPlans?id="+ planIds
			//TODO: In the future if sessions can be made without a group then maybe you need to check if planIds is empty here.
			if (onlyMyGroups) {
				//TODO anything here?
				//TODO yes probably want to filter out of planIds first based on the new userId...
			}
		} else {
			//No groups are chosen.

			console.log("No groups are chosen!!!")
			//console.log(selectedPlans)

			if (onlyMyGroups) { //TODO onlyMyGroups here.
				//We still only want to fetch sessions connected to this user's groups.
			
				let planIds = []
				//Filter out only my groups (array of group ids used)
				console.log("GROUPS:" + groups)
				if (!groups) {
					console.log("Undefined/no groups")
					setLoading(false)
				}
				//selectedPlans?.forEach(group => {if (groups?.includes(group.id)) {selectedPlans2.push(group.id)}})
				let groups2 = groups?.filter(group => group.userId === user.userId)
				//groups.filter(group => group.userId === user.userId)
				console.log("G2: " + groups2)
				groups2?.forEach(group => {console.log(group.userId); planIds.push(group.id)})
				console.log("PIII: " + planIds) //PLAN=GROUP
				
				if (planIds.length === 0) {
					console.log("YOU HAVE NO GROUPS!!!")
					setLoading(false)
					fetchSessionPath = "api/session/getByPlans?id=0" //No groups have id 0???
					return //DONE.
				} else {
					//console.log("ERROR???") //TODO this is never run??
					//planIds = selectedPlans.join("&id=")
					fetchSessionPath = "api/session/getByPlans?id="+ planIds //TODO what if there are no groups that I have?
				}

			} //If false, then all sessions connected to all groups may be fetched.
			console.log(fetchSessionPath)
		}
		//TODO remove: selected plans seems to be an array of numbers with the ids of the groups (= plans) to choose from.

		fetch(fetchSessionPath, {
			method: "GET",
			headers: { token }
		})
			.then(response => {
				if(!response.ok && !HTTP_STATUS_CODES.NOT_FOUND) {
					setError("Kunde inte hämta tillfällen.")
				}
				return response.json()
			})
			.then(sessions => setSessions(filterSessions(sessions, args)))
			.catch(() => {
				setError("Kunde inte ansluta till servern.")
			})

		setLoading(false)

		function filterSessions(sessions, args) {
			return sessions.filter(session => {
				const sessionDate = new Date(session.date).getTime()
				const fromDate = new Date(args.from).getTime()
				const toDate = new Date(args.to).getTime()
			
				return sessionDate >= fromDate && sessionDate <= toDate
			})
		}
	}, [ dates.to, dates.from, selectedPlans, onlyMyGroups ])

	

	function loadWorkouts() {
		fetch("api/workouts/all", {
			method: "GET",
			headers: { token }
		})
			.then(response => {
				if(!response.ok) {
					setError("Kunde inte hämta övningar")
				}
				return response.json()
			})
			.then(workouts => setWorkouts(workouts))
			.catch(() => {
				setError("Kunde inte ansluta till servern.")
			})
	}

	function loadPlans() {
		fetch("api/plan/all", {
			method: "GET",
			headers: { token }
		})
			.then(response => {
				if(!response.ok) {
					setError("Kunde inte hämta övningar")
				}
				return response.json()
			})
			.then(plans => {
				setPlans(plans) //TODO remove???
				setGroups(plans) //This was added to update the newly used "group" variable which is the same as the previous "plan" variable.

				const filterCookie = cookies["plan-filter"]
				if(filterCookie && filterCookie.plans) {
					setSelectedPlans(plans.filter(plan => filterCookie.plans.includes(plan.id)).map(p => p.id))
				}
			})
			.catch(() => {
				setError("Kunde inte ansluta till servern.")
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
			<title>Planering</title>
			<h1>Planering</h1>
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
				setChosenGroups={setSelectedPlans}
				onDatesChange={handleDatesChange}
				chosenGroups={selectedPlans}
				dates={dates}
				//callbackFunction={toggleOnlyMyGroups} //Register callback function. TODO REMOVE.
				callbackFunction={setGroups}
				setOnlyMyGroupsPI={setOnlyMyGroups} //Register callback for the variable here to synchronize values.
			>
			</FilterPlan>

			{/*onlyMyGroups ? <div> true </div> : <div> false </div>*/ //TEST TODO REMOVE!
			}

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
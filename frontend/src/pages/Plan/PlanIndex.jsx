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
import { HTTP_STATUS_CODES, canCreateSessionsAndGroups, isAdminUser, setError } from "../../utils"

/**
 * PlanIndex is the page that displays group plannings. Contains a 
 * FilterPlan-component and a SessionList. Fetches and filters sessions 
 * depending on what is selected as selected plans(groups) in the FilterPlan-component.
 * If nothing is selected, the default is from todays date until inf.
 * 
 * @author Griffin, Team Durian (Group 3) (2024-04-23), Team Mango (Group 4) (2024-05-28) , Team Durian (Group 3) (2024-05-22)
 * @version 1.0
 * @since 2023-05-24
 * Updates: 2024-05-10: Added a toggle for a new checkbox. The filtering part does not work yet.
 * 			2024-05-17: Fixed the filtering and refactored code slightly.
 *          2024-05-20: Added a check for if the add session button should be shown or not.
 * 		    2024-05-22: Added a numFilters counter to the FilterPlan.
 *  		2024-05-28: Fixed a filtering bug for the onlyMyGroups selection and refactored the code a bit.
 * 						Also updated error handling to remove unnecessary error message.
 * 			2024-05-29: Added an id to the create session button to be able to test it.
 * 			2024-05-30: Fixed a critical bug where the site crashes if you have no selected groups and refactored code slightly.
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

	const [ groups, setGroups ] = useState() //This variable is used for groups and is set by GroupPicker (via FilterPlan). Potential conflict with plans, so plans should be removed.
	const [ onlyMyGroups, setOnlyMyGroups ] = useState(cookies["plan-filter"] ? cookies["plan-filter"].onlyMyGroups : true) //Variable for if to filter by only this user's groups.
	
	const user = useContext(AccountContext) //Needed to get the userId to get only this user's groups.
	
	//This function needs to be high up in the code or it will be called all the time instead of only once when you press the checkbox on the screen.
	/**
	 * toggleOnlyMyGroups() - Toggles the boolean variable 'onlyMyGroups'.
	 * If the variable is true, it gets set to false, and if it is false it gets set to true.
	 */
	function toggleOnlyMyGroups() {
		//setChosenGroups([]) //Reset chosen groups. This is not done anymore every time you press the checkbox, because that seems bad.
		if (onlyMyGroups) {
			setOnlyMyGroups(false)
		} else {
			//We want to toggle on the variable. Here we could clear the groups that are not shown anymore, but their states are instead kept the same.
			setOnlyMyGroups(true)
		}
	}

	// Filtering props

	//selectedPlans is an array of ids (numbers) of the groups (= plans) that have been chosen in the GroupPicker.
	const [ selectedPlans, setSelectedPlans ] = useState(cookies["plan-filter"] ? cookies["plan-filter"].plans : [])
	
	const [ dates, setDates ] = useState({
		from: dateFormatter(new Date()),
		to: dateFormatter(twoYears)
	})

	/**
	 * getFetchSessionPath() - Get the path for fetching the correct sessions based on filtering.
	 * @param {String} planIds The string of ids to use in the API call (e.g. 1&id=2&id=3)
	 * @returns A string of the fetch session path or null if no sessions should be fetched.
	 */
	function getFetchSessionPath(planIds) {
		let fetchSessionPath = "api/session/all"
		if (selectedPlans && selectedPlans.length > 0) {
			//Fetch only sessions connected to plans (groups) selected in FilterPlan.
			
			//In the future if sessions can be made without a group then maybe you need to check if the 'planIds' variable is empty here.
			if (onlyMyGroups) {
				//If only my groups are to be used in the filtering then we need to remove some Ids from selectedPlans.
				//Filter out only my groups.
				let myGroups = groups?.filter(group => group.userId === user.userId)
				//Filter out the selected groups from myGroups. (Basically we have removed the other selected groups now.)
				let mySelectedGroups = myGroups?.filter(group => selectedPlans.includes(group.id))?.map(g => g.id)
				//(The map part just extracts the id to get an array of ids.)

				if (mySelectedGroups && mySelectedGroups.length === 0) {
					//There are no selected groups, except for "hidden" selected groups that are not mine.
					//Then we get all of myGroups as the selected ones.
					mySelectedGroups = myGroups?.map(p => p.id)
				}
				planIds = mySelectedGroups?.join("&id=")
				
				//In case there are no selected planIds.
				if (!planIds) {
					setSessions([]) //There are no sessions that should be shown.
					setLoading(false)
					return null
				}
				fetchSessionPath = "api/session/getByPlans?id=" + planIds
			} else {
				fetchSessionPath = "api/session/getByPlans?id=" + planIds
			}
		} else {
			//No groups are chosen.

			if (onlyMyGroups) {
				//We still only want to fetch sessions connected to this user's groups.

				//Filter out only my groups.
				let myGroups = groups?.filter(group => group.userId === user.userId)

				//Extract the group ids into an array and form the string.
				let groupIds = myGroups?.map(g => g.id)
				
				if (!groupIds || groupIds.length === 0) {
					//There are no groups.
					setSessions([]) //This removes all sessions, since none should be shown. Remove if you can create sessions without groups.
					setLoading(false)
					return null//Nothing could be done.
				}

				let groupIdsStr = groupIds?.join("&id=")
				fetchSessionPath = "api/session/getByPlans?id=" + groupIdsStr
			} //If false, then all sessions connected to all groups may be fetched (default).
		}
		return fetchSessionPath
	}



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
			setOnlyMyGroups(filterCookie.onlyMyGroups)
		}
	}, [])
	
	// Triggered on page load and when dates or selected plans change.
	useEffect(() => {
		let args = {
			from: dates.from, 
			to: dates.to,
			plans: selectedPlans,
			onlyMyGroups: onlyMyGroups
		}
		setCookie("plan-filter", args, { path: "/" })
		
		
		if (!selectedPlans || !groups) {
			//The groups have not been fetched yet. (Or there are no groups or nothing is chosen.)
			setLoading(false)
			return //Nothing to be done.
		}
		
		let planIds = selectedPlans.join("&id=")
		//let fetchSessionPath = "api/session/all"
		let fetchSessionPath = getFetchSessionPath(planIds)
		if (!fetchSessionPath) {
			return //If the returned result was null we return here and do not fetch anything.
		}

		fetch(fetchSessionPath, {
			method: "GET",
			headers: { token }
		})
			.then(response => {
				if(!response.ok && !HTTP_STATUS_CODES.NOT_FOUND) {
					setError("Kunde inte hämta tillfällen.")
				}
				if (response === HTTP_STATUS_CODES.NO_CONTENT) {
					return
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
				if (response.status === HTTP_STATUS_CODES.NO_CONTENT) {
					//There were no groups.
					return []
				}
				if (response.status === HTTP_STATUS_CODES.NOT_FOUND) {
					setError("Kunde inte ansluta till servern.") //TODO better error message?
					return []
				}
				return response.json()
			})
			.then(plans => {
				setPlans(plans) //TODO remove later by replacing it with groups. Right now cookies are used for selectedPlans via plans, not groups, which should probably be changed.
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
			{/* Comment from 2023 that I do not understand how to fix: TODO: Improve this later, it's a hotfix because FilterPlan is bad */}
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
				callbackFunctionCheckbox={setGroups} //Register callback for updating the groups when the checkbox is pressed.
				onlyMyGroups={onlyMyGroups} //Pass in the variable to know for filtering in FilterPlan.jsx.
				toggleOnlyMyGroups={toggleOnlyMyGroups} //Register callback function for toggling onlyMyGroups.
				numFilters={selectedPlans.length + (onlyMyGroups ? 1 : 0)} //Count the number of filters.
			>
			</FilterPlan>

			{loading ? <Spinner /> : <div>
				{
					(plans && sessions && workouts) &&
					<SessionList id = {"sessionlistID"} plans={plans} sessions={sessions} workouts={workouts}/>
				}
			</div>}

			{
				(isAdminUser(user) || canCreateSessionsAndGroups(user)) ? 
					<RoundButton linkTo={"/session/create"} id={"CreateSessionButton"}>
						<Plus />
					</RoundButton>
					: <></>
			}

		</center>
	)	
}
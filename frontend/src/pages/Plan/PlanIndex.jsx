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
import Popup from "../../components/Common/Popup/Popup"

/**
 * PlanIndex is the page that displays group plannings. Contains of a 
 * FilterPlan-component and a SessionList. Fetches and filters sessions 
 * depending on what is selected as selected plans(groups) in the FilterPlan-component.
 * If nothing is selected, the default is from todays date until inf.
 * TODO: PlanIndex is error handling on fetches(react toast).
 * 
 * @author Griffin, Team Durian (Group 3) (2024-04-23)
 * @version 1.0
 * @since 2023-05-24
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
		if (selectedPlans && selectedPlans.length > 0) {
			//Fetch only sessions connected to plans selected in FilterPlan.
			var planIds = selectedPlans.join("&id=")
			fetchSessionPath = "api/session/getByPlans?id="+ planIds
		}

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
	}, [ dates.to, dates.from, selectedPlans ])

	

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
				setPlans(plans)

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

    const [showPopup, setShowPopup] = useState(false)

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

            <div>
                <Popup id={"test-popup"} title={"Navigering"} isOpen={showPopup} setIsOpen={setShowPopup}>
                    <Button><p>Teknik1</p></Button>
                    <Button><p>Teknik2</p></Button>
                    <Button><p>Teknik3</p></Button>
                    <Button><p>Teknik4</p></Button>  
                </Popup>
            </div>
            <RoundButton  onClick={() => setShowPopup(true)} />

            <Button children={<p>Tekniker</p>} onClick={() => setShowPopup(true)}></Button>
            

			<FilterPlan
				id={42}
				setChosenGroups={setSelectedPlans}
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